type Gender = "male" | "female";
type School = "NTHU" | "NYCU" | "OTHER";
export type PunchNameMode = "legal" | "nick";

export type PunchEntry = {
  id: string;
  name: string;
  score: number;
  school: School;
  schoolOther?: string;
  department: string;
  gender: Gender;
  updatedAt: string;
  legalName?: string;
  nickname?: string;
  nameMode?: PunchNameMode;
};

export type PunchRegistrant = {
  id: string;
  legalName: string;
  nickname: string;
  nameMode: PunchNameMode;
  school: School;
  schoolOther?: string;
  department: string;
  gender: Gender;
  contact: string;
};

export type PunchBoard = {
  eventName: string;
  endAt: string;
  updatedAt: string;
  version: number;
  epoch?: number;
  entries: PunchEntry[];
};

export type PunchEnv = {
  CHUMEI_VOTES?: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
  PUNCHBOARD_ADMIN_SECRET?: string;
  RESEND_API_KEY?: string;
  PUNCHBOARD_MAIL_TO?: string;
  PUNCHBOARD_MAIL_FROM?: string;
  PUNCHBOARD_MAIL_WEBHOOK?: string;
};

/** Browsers revalidate every poll; the edge serves a shared copy for ~5s. */
export const PUBLIC_CACHE_CONTROL =
  "public, max-age=0, s-maxage=5, stale-while-revalidate=2";
export const PUBLIC_CDN_CACHE_CONTROL =
  "public, max-age=5, stale-while-revalidate=2";
export const PUBLIC_CACHE_KEY = "https://chumei.org/api/punchboard/public-v2";

export async function purgePublicBoardCache() {
  try {
    await caches.default.delete(new Request(PUBLIC_CACHE_KEY, { method: "GET" }));
  } catch {
    /* Cache API may be unavailable in some runtimes */
  }
}

export const BOARD_KEY = "punchboard-v1";
export const ROSTER_KEY = "punchboard-v1-roster";
export const BOARD_HISTORY_KEY = "punchboard-v1-history";
export const BOARD_HISTORY_LIMIT = 20;
/** Bump to wipe leftover practice scores once on the next deploy. */
export const LIVE_EPOCH = 2;
export const DEFAULT_NAME = "詐騙來電，Whoscall 開扁";
export const DEFAULT_END_AT = "2026-11-17T23:59:00+08:00";

export function corsOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  if (!origin) return "https://chumei.org";
  try {
    const host = new URL(origin).hostname;
    if (
      host === "chumei.org" ||
      host === "xn--eyqvve1quev2be32g7sbba230jtip1rbz09du88b.xyz" ||
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".github.io") ||
      host.endsWith(".pages.dev")
    ) {
      return origin;
    }
  } catch {
    /* ignore */
  }
  return "https://chumei.org";
}

export function json(
  request: Request,
  body: unknown,
  status = 200,
  extraHeaders?: Record<string, string>,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": corsOrigin(request),
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
      "Cache-Control": extraHeaders?.["Cache-Control"] ?? "no-store",
      ...extraHeaders,
    },
  });
}

export function emptyBoard(): PunchBoard {
  return {
    eventName: DEFAULT_NAME,
    endAt: DEFAULT_END_AT,
    updatedAt: "",
    version: 0,
    epoch: LIVE_EPOCH,
    entries: [],
  };
}

export function isDemoEntry(entry: PunchEntry) {
  return (
    entry.id.startsWith("demo-") ||
    entry.name.includes("測試") ||
    Boolean(entry.legalName?.includes("測試"))
  );
}

function coerceBoard(raw: string): PunchBoard {
  try {
    const parsed = JSON.parse(raw) as Partial<PunchBoard>;
    const entries = Array.isArray(parsed.entries)
      ? parsed.entries.filter(isEntry).map(withSchoolOther)
      : [];
    return {
      eventName: String(parsed.eventName || DEFAULT_NAME).slice(0, 80),
      endAt: String(parsed.endAt || DEFAULT_END_AT).slice(0, 40),
      updatedAt: String(parsed.updatedAt || ""),
      version: Number(parsed.version) || 0,
      epoch: Number(parsed.epoch) || 0,
      entries: uniqueByPerson(entries),
    };
  } catch {
    return emptyBoard();
  }
}

export async function seedBoardIfEmpty(
  env: PunchEnv,
): Promise<{ board: PunchBoard; ready: boolean }> {
  return readBoard(env);
}

function withSchoolOther(entry: PunchEntry): PunchEntry {
  const custom = typeof entry.schoolOther === "string" ? entry.schoolOther.trim() : "";
  const nameMode = entry.nameMode === "nick" ? "nick" : entry.nameMode === "legal" ? "legal" : undefined;
  return {
    ...entry,
    schoolOther: entry.school === "OTHER" ? custom.slice(0, 40) : "",
    legalName: typeof entry.legalName === "string" ? entry.legalName.slice(0, 40) : "",
    nickname: typeof entry.nickname === "string" ? entry.nickname.slice(0, 40) : "",
    nameMode,
  };
}

function isEntry(value: unknown): value is PunchEntry {
  if (!value || typeof value !== "object") return false;
  const e = value as Partial<PunchEntry>;
  return (
    typeof e.id === "string" &&
    typeof e.name === "string" &&
    typeof e.score === "number" &&
    (e.school === "NTHU" || e.school === "NYCU" || e.school === "OTHER") &&
    typeof e.department === "string" &&
    (e.gender === "male" || e.gender === "female") &&
    typeof e.updatedAt === "string"
  );
}

export async function readBoard(
  env: PunchEnv,
): Promise<{ board: PunchBoard; ready: boolean }> {
  if (!env.CHUMEI_VOTES) return { board: emptyBoard(), ready: false };
  const raw = await env.CHUMEI_VOTES.get(BOARD_KEY);
  if (!raw) return { board: emptyBoard(), ready: true };
  const board = coerceBoard(raw);
  const live = board.entries.filter((entry) => !isDemoEntry(entry));
  const resetScores = (board.epoch ?? 0) < LIVE_EPOCH;
  if (resetScores || live.length !== board.entries.length) {
    board.entries = resetScores ? [] : live;
    board.epoch = LIVE_EPOCH;
    board.updatedAt = new Date().toISOString();
    board.version += 1;
    await env.CHUMEI_VOTES.put(BOARD_KEY, JSON.stringify(board));
    await purgePublicBoardCache();
  }
  return { ready: true, board };
}

function isRegistrant(value: unknown): value is PunchRegistrant {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<PunchRegistrant>;
  return (
    typeof row.id === "string" &&
    typeof row.legalName === "string" &&
    (row.school === "NTHU" || row.school === "NYCU" || row.school === "OTHER") &&
    (row.gender === "male" || row.gender === "female")
  );
}

export async function readRoster(env: PunchEnv): Promise<PunchRegistrant[]> {
  if (!env.CHUMEI_VOTES) return [];
  const raw = await env.CHUMEI_VOTES.get(ROSTER_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const byId = new Map<string, PunchRegistrant>();
    for (const item of parsed) {
      if (!isRegistrant(item)) continue;
      const id = normalizePlayerId(item.id);
      if (!id) continue;
      byId.set(id, {
        id,
        legalName: String(item.legalName).trim().slice(0, 40),
        nickname: String(item.nickname ?? "").trim().slice(0, 40),
        nameMode: item.nameMode === "nick" ? "nick" : "legal",
        school: item.school,
        schoolOther: item.school === "OTHER" ? String(item.schoolOther ?? "").trim().slice(0, 40) : "",
        department: String(item.department ?? "").trim().slice(0, 40),
        gender: item.gender,
        contact: String(item.contact ?? "").trim().slice(0, 80),
      });
    }
    return [...byId.values()];
  } catch {
    return [];
  }
}

export async function writeRoster(env: PunchEnv, roster: PunchRegistrant[]) {
  if (!env.CHUMEI_VOTES) return;
  await env.CHUMEI_VOTES.put(ROSTER_KEY, JSON.stringify(roster));
}

export function findRegistrant(roster: PunchRegistrant[], id: string) {
  const key = normalizePlayerId(id);
  return roster.find((row) => row.id === key) ?? null;
}

export function normalizePlayerId(id: string) {
  return id.normalize("NFKC").trim().toUpperCase().replace(/\s+/g, "");
}

export function punchDisplayName(row: {
  legalName?: string;
  nickname?: string;
  nameMode?: PunchNameMode;
  name?: string;
}) {
  if (row.nameMode === "nick" && (row.nickname ?? "").trim()) {
    return row.nickname!.trim();
  }
  if ((row.legalName ?? "").trim()) return row.legalName!.trim();
  return (row.name ?? "").trim();
}

export function personKey(entry: { id?: string; name: string; gender: Gender }) {
  const id = normalizePlayerId(entry.id ?? "");
  if (id) return `id:${id}`;
  const nameKey = entry.name
    .normalize("NFKC")
    .replace(/[・·‧．.．\-—–_]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
  return `${entry.gender}:${nameKey}`;
}

export function uniqueByPerson<T extends PunchEntry>(entries: T[]): T[] {
  const best = new Map<string, T>();
  for (const entry of entries) {
    const key = personKey(entry);
    const prev = best.get(key);
    if (!prev) {
      best.set(key, entry);
      continue;
    }
    const betterScore = entry.score > prev.score;
    const sameScoreEarlier =
      entry.score === prev.score && entry.updatedAt.localeCompare(prev.updatedAt) < 0;
    if (betterScore || sameScoreEarlier) {
      best.set(key, { ...entry, id: prev.id });
    }
  }
  return [...best.values()];
}

export function rank(entries: PunchEntry[], gender: Gender) {
  return uniqueByPerson(entries)
    .filter((e) => e.gender === gender)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.updatedAt.localeCompare(b.updatedAt);
    })
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function publicPayload(board: PunchBoard, ready: boolean) {
  const entries = board.entries.filter((entry) => !isDemoEntry(entry));
  return {
    ready,
    eventName: board.eventName,
    endAt: board.endAt,
    updatedAt: board.updatedAt,
    male: rank(entries, "male").slice(0, 10),
    female: rank(entries, "female").slice(0, 10),
  };
}
