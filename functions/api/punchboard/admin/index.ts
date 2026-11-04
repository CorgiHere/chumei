import {
  ADMIN_TOKEN_MSG,
  cookieHeader,
  hmacHex,
  isAuthed,
  timingSafeEqual,
} from "../../_admin-auth";
import {
  BOARD_HISTORY_KEY,
  BOARD_HISTORY_LIMIT,
  BOARD_KEY,
  DEFAULT_END_AT,
  DEFAULT_NAME,
  PUNCH_SCORE_MAX,
  findRegistrant,
  json,
  normalizePlayerId,
  personKey,
  punchDisplayName,
  purgePublicBoardCache,
  readBoard,
  readRoster,
  uniqueByPerson,
  writeRoster,
  type PunchBoard,
  type PunchEntry,
  type PunchEnv,
  type PunchNameMode,
  type PunchRegistrant,
} from "../_shared";
import {
  notifyTop10IfChanged,
  parseMailTo,
  sendCurrentBoard,
  type MailResult,
} from "../notify-top10";

type PagesContext = {
  request: Request;
  env: PunchEnv;
};

const MAX_ENTRIES = 800;

async function pushBoardHistory(env: PunchEnv, board: PunchBoard) {
  if (!env.CHUMEI_VOTES) return;
  let list: unknown[] = [];
  try {
    const raw = await env.CHUMEI_VOTES.get(BOARD_HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) list = parsed;
    }
  } catch {
    list = [];
  }
  list.unshift({
    savedAt: board.updatedAt,
    version: board.version,
    eventName: board.eventName,
    endAt: board.endAt,
    entries: board.entries,
  });
  await env.CHUMEI_VOTES.put(
    BOARD_HISTORY_KEY,
    JSON.stringify(list.slice(0, BOARD_HISTORY_LIMIT)),
  );
}

function clip(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function parseNameMode(value: unknown): PunchNameMode {
  return value === "nick" ? "nick" : "legal";
}

function parseRegistrant(raw: Partial<PunchRegistrant>): PunchRegistrant | null {
  const id = normalizePlayerId(clip(raw.id, 20));
  const legalName = clip(raw.legalName, 40);
  if (!id || !legalName) return null;
  const school = raw.school;
  const gender = raw.gender;
  if (school !== "NTHU" && school !== "NYCU" && school !== "OTHER") return null;
  if (gender !== "male" && gender !== "female") return null;
  return {
    id,
    legalName,
    nickname: clip(raw.nickname, 40),
    nameMode: parseNameMode(raw.nameMode),
    school,
    schoolOther: school === "OTHER" ? clip(raw.schoolOther, 40) : "",
    department: clip(raw.department, 40),
    gender,
    contact: clip(raw.contact, 80),
  };
}

function entryFromRegistrant(
  registrant: PunchRegistrant,
  score: number,
  nameMode: PunchNameMode,
): PunchEntry | null {
  if (!Number.isFinite(score) || score < 1 || score > PUNCH_SCORE_MAX) return null;
  const mode = nameMode === "nick" && registrant.nickname.trim() ? "nick" : "legal";
  return {
    id: registrant.id,
    legalName: registrant.legalName,
    nickname: registrant.nickname,
    nameMode: mode,
    name: punchDisplayName({ ...registrant, nameMode: mode }),
    score: Math.round(score),
    school: registrant.school,
    schoolOther: registrant.schoolOther ?? "",
    department: registrant.department,
    gender: registrant.gender,
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
  const roster = await readRoster(context.env);
  return authedJson(context.request, {
    ok: true,
    ready,
    eventName: board.eventName,
    endAt: board.endAt,
    updatedAt: board.updatedAt,
    entries: board.entries,
    roster,
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
    entry?: Partial<PunchEntry> & { nameMode?: PunchNameMode };
    entries?: Partial<PunchEntry>[];
    registrant?: Partial<PunchRegistrant>;
    roster?: Partial<PunchRegistrant>[];
    to?: string;
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
    const token = await hmacHex(secret, ADMIN_TOKEN_MSG);
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
  let roster = await readRoster(env);
  const now = new Date().toISOString();

  function snapshot() {
    return {
      eventName: board.eventName,
      endAt: board.endAt,
      updatedAt: board.updatedAt,
      entries: board.entries,
      roster,
    };
  }

  if (action === "mail") {
    const to = parseMailTo(payload.to);
    if (!to) return authedJson(request, { error: "invalid_email" }, 400);
    const attempt = await sendCurrentBoard(env, board, to);
    return authedJson(request, {
      ok: attempt.mailed === "sent",
      mailed: attempt.mailed,
      mailError: attempt.mailError,
      mailedTo: to,
      ...snapshot(),
    });
  }

  if (action === "upsertRegistrant") {
    const next = parseRegistrant(payload.registrant ?? {});
    if (!next) return authedJson(request, { error: "invalid_registrant" }, 400);
    const idx = roster.findIndex((row) => row.id === next.id);
    if (idx >= 0) roster[idx] = next;
    else roster.push(next);
    await writeRoster(env, roster);
    return authedJson(request, { ok: true, ready: true, ...snapshot() });
  }

  if (action === "deleteRegistrant") {
    const id = normalizePlayerId(clip(payload.id, 20));
    roster = roster.filter((row) => row.id !== id);
    await writeRoster(env, roster);
    return authedJson(request, { ok: true, ready: true, ...snapshot() });
  }

  if (action === "replaceRoster") {
    if (!Array.isArray(payload.roster)) {
      return authedJson(request, { error: "invalid_roster" }, 400);
    }
    const nextRoster: PunchRegistrant[] = [];
    for (const raw of payload.roster) {
      const parsed = parseRegistrant(raw);
      if (parsed) nextRoster.push(parsed);
    }
    const byId = new Map(nextRoster.map((row) => [row.id, row]));
    roster = [...byId.values()];
    await writeRoster(env, roster);
    return authedJson(request, { ok: true, ready: true, ...snapshot() });
  }

  if (action === "cue") {
    const id = normalizePlayerId(clip(payload.id, 20));
    const entry = board.entries.find((row) => normalizePlayerId(row.id) === id);
    if (!id || !entry) {
      return authedJson(request, { error: "unknown_player", ...snapshot() }, 400);
    }
    board.cue = { id, nonce: `${Date.now()}-${id}`, at: now };
    board.updatedAt = now;
    board.version += 1;
    await env.CHUMEI_VOTES.put(BOARD_KEY, JSON.stringify(board));
    await purgePublicBoardCache();
    return authedJson(request, { ok: true, ready: true, cued: true, ...snapshot() });
  }

  if (action === "saveMeta") {
    board.eventName = clip(payload.eventName, 80) || DEFAULT_NAME;
    board.endAt = clip(payload.endAt, 40) || DEFAULT_END_AT;
  } else if (action === "upsert") {
    const raw = payload.entry ?? {};
    const id = normalizePlayerId(clip(raw.id, 20));
    const registrant = findRegistrant(roster, id);
    if (!registrant) {
      return authedJson(request, { error: "not_registered", ...snapshot() }, 400);
    }
    const next = entryFromRegistrant(registrant, Number(raw.score), parseNameMode(raw.nameMode));
    if (!next) return authedJson(request, { error: "invalid_entry", ...snapshot() }, 400);
    const idx = board.entries.findIndex((e) => personKey(e) === personKey(next));
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
    const id = normalizePlayerId(clip(payload.id, 80));
    board.entries = board.entries.filter((e) => normalizePlayerId(e.id) !== id);
  } else if (action === "replace") {
    if (!Array.isArray(payload.entries)) {
      return authedJson(request, { error: "invalid_entries" }, 400);
    }
    const nextEntries: PunchEntry[] = [];
    for (const raw of payload.entries) {
      const registrant = findRegistrant(roster, String(raw.id ?? ""));
      if (!registrant) continue;
      const parsed = entryFromRegistrant(
        registrant,
        Number(raw.score),
        parseNameMode(raw.nameMode),
      );
      if (parsed) {
        if (typeof raw.updatedAt === "string" && raw.updatedAt) {
          parsed.updatedAt = raw.updatedAt.slice(0, 40);
        }
        nextEntries.push(parsed);
      }
    }
    if (nextEntries.length > MAX_ENTRIES) {
      return authedJson(request, { error: "too_many" }, 400);
    }
    board.entries = uniqueByPerson(nextEntries);
    if (payload.eventName !== undefined) {
      board.eventName = clip(payload.eventName, 80) || DEFAULT_NAME;
    }
    if (payload.endAt !== undefined) {
      board.endAt = clip(payload.endAt, 40) || DEFAULT_END_AT;
    }
  } else {
    return authedJson(request, { error: "unknown_action" }, 400);
  }

  board.entries = uniqueByPerson(board.entries);
  board.updatedAt = now;
  board.version += 1;
  await env.CHUMEI_VOTES.put(BOARD_KEY, JSON.stringify(board));
  await pushBoardHistory(env, board);
  await purgePublicBoardCache();
  let mailed: MailResult = "skipped";
  if (action === "upsert" || action === "delete" || action === "replace") {
    try {
      mailed = await notifyTop10IfChanged(env, board);
    } catch {
      mailed = "failed";
    }
  }
  return authedJson(request, {
    ok: true,
    ready: true,
    mailed,
    eventName: board.eventName,
    endAt: board.endAt,
    updatedAt: board.updatedAt,
    entries: board.entries,
    roster,
  });
}
