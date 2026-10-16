import {
  BOARD_KEY,
  DEFAULT_END_AT,
  DEFAULT_NAME,
  json,
  purgePublicBoardCache,
  readBoard,
  type PunchEntry,
  type PunchEnv,
} from "../_shared";

type PagesContext = {
  request: Request;
  env: PunchEnv;
};

const COOKIE = "chumei-punch-admin";
const TOKEN_MSG = "punch-admin-v1";
const MAX_ENTRIES = 800;

function cookieHeader(request: Request, value: string, maxAge: number) {
  const parts = [
    `${COOKIE}=${value}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (new URL(request.url).protocol === "https:") parts.push("Secure");
  return parts.join("; ");
}

async function hmacHex(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function readCookie(request: Request) {
  const raw = request.headers.get("Cookie") ?? "";
  const prefix = `${COOKIE}=`;
  const hit = raw.split(";").map((p) => p.trim()).find((p) => p.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : "";
}

async function isAuthed(request: Request, secret: string) {
  if (!secret) return false;
  const token = readCookie(request);
  if (!token) return false;
  const expected = await hmacHex(secret, TOKEN_MSG);
  return timingSafeEqual(token, expected);
}

function clip(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function parseEntry(raw: Partial<PunchEntry>, fallbackId?: string): PunchEntry | null {
  const name = clip(raw.name, 40);
  const department = clip(raw.department, 40);
  const score = Number(raw.score);
  const school = raw.school;
  const gender = raw.gender;
  if (!name || !Number.isFinite(score) || score < 0 || score > 999999) return null;
  if (school !== "NTHU" && school !== "NYCU" && school !== "OTHER") return null;
  if (gender !== "male" && gender !== "female") return null;
  return {
    id: clip(raw.id || fallbackId || crypto.randomUUID(), 80) || crypto.randomUUID(),
    name,
    score: Math.round(score),
    school,
    department,
    gender,
    updatedAt: new Date().toISOString(),
  };
}

function authedJson(request: Request, body: unknown, status = 200) {
  const res = json(request, body, status, {
    "Access-Control-Allow-Credentials": "true",
  });
  return res;
}

export async function onRequestOptions(context: PagesContext) {
  return authedJson(context.request, {});
}

export async function onRequestGet(context: PagesContext) {
  const secret = context.env.PUNCHBOARD_ADMIN_SECRET ?? "";
  if (!secret) {
    return authedJson(context.request, { error: "admin_unconfigured", ready: false }, 503);
  }
  if (!(await isAuthed(context.request, secret))) {
    return authedJson(context.request, { error: "unauthorized", ok: false }, 401);
  }
  const { board, ready } = await readBoard(context.env);
  return authedJson(context.request, {
    ok: true,
    ready,
    eventName: board.eventName,
    endAt: board.endAt,
    updatedAt: board.updatedAt,
    entries: board.entries,
  });
}

export async function onRequestPost(context: PagesContext) {
  const { request, env } = context;
  const secret = env.PUNCHBOARD_ADMIN_SECRET ?? "";
  if (!secret) {
    return authedJson(request, { error: "admin_unconfigured", ready: false }, 503);
  }

  let payload: {
    action?: string;
    password?: string;
    eventName?: string;
    endAt?: string;
    id?: string;
    entry?: Partial<PunchEntry>;
  } = {};
  try {
    payload = (await request.json()) as typeof payload;
  } catch {
    return authedJson(request, { error: "invalid_json" }, 400);
  }

  const action = payload.action;
  if (action === "login") {
    const password = String(payload.password ?? "");
    if (password.length !== secret.length || !timingSafeEqual(password, secret)) {
      return authedJson(request, { error: "bad_password" }, 401);
    }
    const token = await hmacHex(secret, TOKEN_MSG);
    const res = authedJson(request, { ok: true });
    const headers = new Headers(res.headers);
    headers.append("Set-Cookie", cookieHeader(request, token, 60 * 60 * 24 * 14));
    return new Response(res.body, { status: 200, headers });
  }

  if (action === "logout") {
    const res = authedJson(request, { ok: true });
    const headers = new Headers(res.headers);
    headers.append("Set-Cookie", cookieHeader(request, "", 0));
    return new Response(res.body, { status: 200, headers });
  }

  if (!(await isAuthed(request, secret))) {
    return authedJson(request, { error: "unauthorized" }, 401);
  }
  if (!env.CHUMEI_VOTES) {
    return authedJson(request, { error: "kv_missing", ready: false }, 503);
  }

  const { board } = await readBoard(env);
  const now = new Date().toISOString();

  if (action === "saveMeta") {
    board.eventName = clip(payload.eventName, 80) || DEFAULT_NAME;
    board.endAt = clip(payload.endAt, 40) || DEFAULT_END_AT;
  } else if (action === "upsert") {
    const next = parseEntry(payload.entry ?? {});
    if (!next) return authedJson(request, { error: "invalid_entry" }, 400);
    const idx = board.entries.findIndex((e) => e.id === next.id);
    if (idx >= 0) {
      const prev = board.entries[idx];
      next.updatedAt = prev.score === next.score ? prev.updatedAt : now;
      board.entries[idx] = next;
    } else {
      if (board.entries.length >= MAX_ENTRIES) {
        return authedJson(request, { error: "too_many" }, 400);
      }
      next.updatedAt = now;
      board.entries.push(next);
    }
  } else if (action === "delete") {
    const id = clip(payload.id, 80);
    board.entries = board.entries.filter((e) => e.id !== id);
  } else {
    return authedJson(request, { error: "unknown_action" }, 400);
  }

  board.updatedAt = now;
  board.version += 1;
  await env.CHUMEI_VOTES.put(BOARD_KEY, JSON.stringify(board));
  await purgePublicBoardCache();
  return authedJson(request, {
    ok: true,
    ready: true,
    eventName: board.eventName,
    endAt: board.endAt,
    updatedAt: board.updatedAt,
    entries: board.entries,
  });
}
