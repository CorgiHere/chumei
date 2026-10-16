export const ADMIN_COOKIE = "chumei-punch-admin";
export const ADMIN_TOKEN_MSG = "punch-admin-v1";

export function cookieHeader(request: Request, value: string, maxAge: number) {
  const parts = [
    `${ADMIN_COOKIE}=${value}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (new URL(request.url).protocol === "https:") parts.push("Secure");
  return parts.join("; ");
}

export async function hmacHex(secret: string, message: string) {
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

export function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

function readCookie(request: Request) {
  const raw = request.headers.get("Cookie") ?? "";
  const prefix = `${ADMIN_COOKIE}=`;
  const hit = raw.split(";").map((p) => p.trim()).find((p) => p.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : "";
}

export async function isAuthed(request: Request, secret: string) {
  if (!secret) return false;
  const token = readCookie(request);
  if (!token) return false;
  const expected = await hmacHex(secret, ADMIN_TOKEN_MSG);
  return timingSafeEqual(token, expected);
}
