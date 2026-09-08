export type PathChoice = "qingjiao" | "jiaoqing";

export type PathVoteCounts = {
  qingjiao: number;
  jiaoqing: number;
  ready: boolean;
};

export const PATH_VOTE_STORAGE_KEY = "chumei-path-vote-v2";
export const PATH_VOTE_VOTER_KEY = "chumei-path-voter-v2";

export const PATH_OPTIONS: Record<PathChoice, { name: string }> = {
  qingjiao: { name: "清交小徑" },
  jiaoqing: { name: "交清小徑" },
};

export function emptyCounts(ready = false): PathVoteCounts {
  return { qingjiao: 0, jiaoqing: 0, ready };
}

export function getVoteEndpoint(): string {
  if (typeof window === "undefined") return "/api/path-vote/";
  const host = window.location.hostname;
  if (
    host === "chumei.org" ||
    host === "localhost" ||
    host === "127.0.0.1"
  ) {
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

export function getOrCreateVoterId(): string {
  const existing = window.localStorage.getItem(PATH_VOTE_VOTER_KEY);
  if (existing) return existing;
  const id =
    window.crypto.randomUUID?.() ??
    `v-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(PATH_VOTE_VOTER_KEY, id);
  return id;
}
