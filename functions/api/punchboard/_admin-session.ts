import {
  cookieHeader,
  hmacHex,
  namedCookieHeader,
  readNamedCookie,
  timingSafeEqual,
} from "../_admin-auth";
import { corsOrigin, type PunchEnv } from "./_shared";
import { sendAdminOtp } from "./notify-top10";

export const OTP_COOKIE = "chumei-punch-otp";
export const SESSION_COOKIE = "chumei-punch-sess";
const COOKIE_PATH = "/api/punchboard/admin/";
const OTP_KEY = "punchboard-admin-otp-v1";
const SESSION_KEY = "punchboard-admin-session-v1";
const OTP_TTL_SEC = 10 * 60;
const SESSION_TTL_SEC = 4 * 60 * 60;
const RATE_TTL_SEC = 15 * 60;
const MAX_OTP_SENDS = 5;
const MAX_OTP_TRIES = 5;
const MAX_PASSWORD_FAILS = 8;

type OtpRecord = {
  id: string;
  hash: string;
  tries: number;
  exp: number;
};

type SessionRecord = {
  hash: string;
  exp: number;
};

function clientIp(request: Request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function rateKey(kind: string, ip: string) {
  return `punchboard-admin-rl-v1:${kind}:${ip}`;
}

export function originAllowed(request: Request) {
  const origin = request.headers.get("Origin");
  if (!origin) return request.method === "GET" || request.method === "OPTIONS";
  return corsOrigin(request) === origin;
}

function punchCookie(request: Request, name: string, value: string, maxAge: number) {
  return namedCookieHeader(request, name, value, maxAge, COOKIE_PATH, "Strict");
}

export function clearAuthCookies(request: Request) {
  return [
    punchCookie(request, OTP_COOKIE, "", 0),
    punchCookie(request, SESSION_COOKIE, "", 0),
    cookieHeader(request, "", 0),
  ];
}

async function readJson<T>(env: PunchEnv, key: string): Promise<T | null> {
  if (!env.CHUMEI_VOTES) return null;
  try {
    const raw = await env.CHUMEI_VOTES.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function bumpRate(env: PunchEnv, kind: string, ip: string, max: number) {
  if (!env.CHUMEI_VOTES) return { ok: false as const, error: "kv_missing" };
  const key = rateKey(kind, ip);
  const n = Number.parseInt((await env.CHUMEI_VOTES.get(key)) ?? "0", 10) || 0;
  if (n >= max) return { ok: false as const, error: "rate_limited" };
  await env.CHUMEI_VOTES.put(key, String(n + 1), { expirationTtl: RATE_TTL_SEC });
  return { ok: true as const };
}

function sixDigitCode() {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return String(bytes[0] % 1_000_000).padStart(6, "0");
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function passwordOk(password: string, secret: string) {
  return password.length === secret.length && timingSafeEqual(password, secret);
}

export async function isPunchAuthed(request: Request, env: PunchEnv, secret: string) {
  if (!secret || !env.CHUMEI_VOTES) return false;
  const token = readNamedCookie(request, SESSION_COOKIE);
  if (!token || token.length < 32) return false;
  const row = await readJson<SessionRecord>(env, SESSION_KEY);
  if (!row || row.exp < Date.now()) return false;
  const hash = await hmacHex(secret, `sess:${token}`);
  return timingSafeEqual(hash, row.hash);
}

export async function startOtpChallenge(
  request: Request,
  env: PunchEnv,
  secret: string,
  password: string,
) {
  if (!env.CHUMEI_VOTES) return { ok: false as const, error: "kv_missing", status: 503 as const };
  const ip = clientIp(request);
  if (!passwordOk(password, secret)) {
    await bumpRate(env, "pw", ip, MAX_PASSWORD_FAILS);
    return { ok: false as const, error: "bad_password", status: 401 as const };
  }
  const sendLimit = await bumpRate(env, "otp", ip, MAX_OTP_SENDS);
  if (!sendLimit.ok) return { ok: false as const, error: sendLimit.error, status: 429 as const };

  const id = randomToken();
  const code = sixDigitCode();
  const hash = await hmacHex(secret, `otp:${id}:${code}`);
  const record: OtpRecord = {
    id,
    hash,
    tries: 0,
    exp: Date.now() + OTP_TTL_SEC * 1000,
  };
  await env.CHUMEI_VOTES.put(OTP_KEY, JSON.stringify(record), {
    expirationTtl: OTP_TTL_SEC,
  });
  await env.CHUMEI_VOTES.put(SESSION_KEY, "", { expirationTtl: 60 });

  const mailed = await sendAdminOtp(env, code);
  if (mailed.mailed !== "sent") {
    await env.CHUMEI_VOTES.put(OTP_KEY, "", { expirationTtl: 60 });
    return {
      ok: false as const,
      error: mailed.mailed === "skipped" ? "mail_unconfigured" : "mail_failed",
      status: 503 as const,
    };
  }
  return {
    ok: true as const,
    cookies: [
      punchCookie(request, OTP_COOKIE, id, OTP_TTL_SEC),
      punchCookie(request, SESSION_COOKIE, "", 0),
      cookieHeader(request, "", 0),
    ],
  };
}

export async function completeOtpLogin(
  request: Request,
  env: PunchEnv,
  secret: string,
  password: string,
  rawCode: string,
) {
  if (!env.CHUMEI_VOTES) return { ok: false as const, error: "kv_missing", status: 503 as const };
  const ip = clientIp(request);
  if (!passwordOk(password, secret)) {
    await bumpRate(env, "pw", ip, MAX_PASSWORD_FAILS);
    return { ok: false as const, error: "bad_password", status: 401 as const };
  }

  const code = String(rawCode ?? "").replace(/\D/g, "").slice(0, 6);
  const challengeId = readNamedCookie(request, OTP_COOKIE);
  const record = await readJson<OtpRecord>(env, OTP_KEY);
  const dummy = await hmacHex(secret, "otp:missing:000000");
  const expected = record?.hash ?? dummy;
  const provided = await hmacHex(secret, `otp:${challengeId || "missing"}:${code.padStart(6, "0")}`);
  const fresh = Boolean(record && record.id === challengeId && record.exp >= Date.now());
  const match = timingSafeEqual(provided, expected);

  if (!fresh || !match || code.length !== 6) {
    if (record && record.id === challengeId) {
      record.tries += 1;
      if (record.tries >= MAX_OTP_TRIES) {
        await env.CHUMEI_VOTES.put(OTP_KEY, "", { expirationTtl: 60 });
      } else {
        await env.CHUMEI_VOTES.put(OTP_KEY, JSON.stringify(record), {
          expirationTtl: OTP_TTL_SEC,
        });
      }
    }
    await bumpRate(env, "otptry", ip, MAX_OTP_TRIES * 3);
    return { ok: false as const, error: "bad_code", status: 401 as const };
  }

  await env.CHUMEI_VOTES.put(OTP_KEY, "", { expirationTtl: 60 });
  const token = randomToken();
  const session: SessionRecord = {
    hash: await hmacHex(secret, `sess:${token}`),
    exp: Date.now() + SESSION_TTL_SEC * 1000,
  };
  await env.CHUMEI_VOTES.put(SESSION_KEY, JSON.stringify(session), {
    expirationTtl: SESSION_TTL_SEC,
  });
  return {
    ok: true as const,
    cookies: [
      punchCookie(request, OTP_COOKIE, "", 0),
      punchCookie(request, SESSION_COOKIE, token, SESSION_TTL_SEC),
      cookieHeader(request, "", 0),
    ],
  };
}

export async function destroySession(request: Request, env: PunchEnv) {
  if (env.CHUMEI_VOTES?.delete) {
    await env.CHUMEI_VOTES.delete(SESSION_KEY);
    await env.CHUMEI_VOTES.delete(OTP_KEY);
  } else if (env.CHUMEI_VOTES) {
    await env.CHUMEI_VOTES.put(SESSION_KEY, "", { expirationTtl: 60 });
    await env.CHUMEI_VOTES.put(OTP_KEY, "", { expirationTtl: 60 });
  }
  return { ok: true as const, cookies: clearAuthCookies(request) };
}
