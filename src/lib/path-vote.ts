export type PathChoice = "qingjiao" | "jiaoqing";

export type PathVoteCounts = {
  qingjiao: number;
  jiaoqing: number;
  ready: boolean;
};

export const PATH_VOTE_STORAGE_KEY = "chumei-path-vote-v3";
export const PATH_VOTE_VOTER_KEY = "chumei-path-voter-v3";
export const PATH_VOTE_COOKIE = "chumei-path-voter-v3";

export const PATH_OPTIONS: Record<PathChoice, { name: string }> = {
  qingjiao: { name: "清交小徑" },
  jiaoqing: { name: "交清小徑" },
};

export function emptyCounts(ready = false): PathVoteCounts {
  return { qingjiao: 0, jiaoqing: 0, ready };
}

const PATH_VOTE_LOCAL_HOSTS = new Set([
  "chumei.org",
  "xn--eyqvve1quev2be32g7sbba230jtip1rbz09du88b.xyz",
  "localhost",
  "127.0.0.1",
]);

export function getVoteEndpoint(): string {
  if (typeof window === "undefined") return "/api/path-vote/";
  const host = window.location.hostname;
  if (PATH_VOTE_LOCAL_HOSTS.has(host)) {
    return "/api/path-vote/";
  }
  return "https://chumei.org/api/path-vote/";
}

export function readStoredChoice(): PathChoice | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(PATH_VOTE_STORAGE_KEY);
  return value === "qingjiao" || value === "jiaoqing" ? value : null;
}

export function storeChoice(choice: PathChoice) {
  window.localStorage.setItem(PATH_VOTE_STORAGE_KEY, choice);
}

export function clearStoredChoice() {
  window.localStorage.removeItem(PATH_VOTE_STORAGE_KEY);
}

export function getOrCreateVoterId(): string {
  if (typeof window === "undefined") return "";
  const fromStore = window.localStorage.getItem(PATH_VOTE_VOTER_KEY);
  const fromCookie = readCookie(PATH_VOTE_COOKIE);
  const id =
    fromStore ||
    fromCookie ||
    window.crypto.randomUUID?.() ||
    `v-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(PATH_VOTE_VOTER_KEY, id);
  writeCookie(PATH_VOTE_COOKIE, id);
  return id;
}

function readCookie(name: string) {
  const prefix = `${name}=`;
  const hit = document.cookie.split("; ").find((part) => part.startsWith(prefix));
  return hit ? decodeURIComponent(hit.slice(prefix.length)) : null;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}
