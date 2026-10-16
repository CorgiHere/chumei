import {
  ADMIN_TOKEN_MSG,
  cookieHeader,
  hmacHex,
  isAuthed,
  timingSafeEqual,
} from "../../_admin-auth";
import {
  FLAGS_KEY,
  flagsJson,
  publicFlagsPayload,
  purgeFlagsCache,
  readFlags,
  type FlagsEnv,
} from "../_shared";

type PagesContext = {
  request: Request;
  env: FlagsEnv;
};

function authedJson(request: Request, body: unknown, status = 200) {
  return flagsJson(request, body, status, {
    "Access-Control-Allow-Credentials": "true",
    "Cache-Control": "no-store",
  });
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
  const { flags, ready } = await readFlags(context.env);
  return authedJson(context.request, { ok: true, ...publicFlagsPayload(flags, ready) });
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
    joinFab?: boolean;
    joinTape?: boolean;
    joinSpin?: boolean;
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
  if (action !== "save") {
    return authedJson(request, { error: "unknown_action" }, 400);
  }

  const current = await readFlags(env);
  const flags = {
    joinFab: payload.joinFab === undefined ? current.flags.joinFab : payload.joinFab !== false,
    joinTape: payload.joinTape === undefined ? current.flags.joinTape : payload.joinTape !== false,
    joinSpin: payload.joinSpin === undefined ? current.flags.joinSpin : payload.joinSpin !== false,
    updatedAt: new Date().toISOString(),
  };
  await env.CHUMEI_VOTES.put(FLAGS_KEY, JSON.stringify(flags));
  await purgeFlagsCache();
  return authedJson(request, { ok: true, ready: true, ...flags });
}
