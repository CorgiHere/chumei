type Gender = "male" | "female";
type School = "NTHU" | "NYCU" | "OTHER";

export type PunchEntry = {
  id: string;
  name: string;
  score: number;
  school: School;
  department: string;
  gender: Gender;
  updatedAt: string;
};

export type PunchBoard = {
  eventName: string;
  endAt: string;
  updatedAt: string;
  version: number;
  entries: PunchEntry[];
};

export type PunchEnv = {
  CHUMEI_VOTES?: {
    get(key: string): Promise<string | null>;
    put(key: string, value: string): Promise<void>;
  };
  PUNCHBOARD_ADMIN_SECRET?: string;
};

/** Browsers revalidate every poll; the edge serves a shared copy for ~5s. */
export const PUBLIC_CACHE_CONTROL =
  "public, max-age=0, s-maxage=5, stale-while-revalidate=2";
export const PUBLIC_CDN_CACHE_CONTROL =
  "public, max-age=5, stale-while-revalidate=2";
export const PUBLIC_CACHE_KEY = "https://chumei.org/api/punchboard/public-v1";

export async function purgePublicBoardCache() {
  try {
    await caches.default.delete(new Request(PUBLIC_CACHE_KEY, { method: "GET" }));
  } catch {
    /* Cache API may be unavailable in some runtimes */
  }
}

export const BOARD_KEY = "punchboard-v1";
export const BOARD_HISTORY_KEY = "punchboard-v1-history";
export const BOARD_HISTORY_LIMIT = 20;
export const DEFAULT_NAME = "拳擊機大賽";
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
    entries: [],
  };
}

const DEMO_ROWS: Array<Omit<PunchEntry, "updatedAt">> = [
  { id: "demo-m1", name: "測試・林大為", score: 998, school: "NTHU", department: "電機系", gender: "male" },
  { id: "demo-m2", name: "測試・陳冠宇", score: 912, school: "NYCU", department: "資工系", gender: "male" },
  { id: "demo-m3", name: "測試・黃志明", score: 870, school: "NTHU", department: "動機系", gender: "male" },
  { id: "demo-m4", name: "測試・周柏宇", score: 755, school: "NTHU", department: "工工系", gender: "male" },
  { id: "demo-m5", name: "測試・許家豪", score: 731, school: "NYCU", department: "電控所", gender: "male" },
  { id: "demo-m6", name: "測試・鄭偉哲", score: 704, school: "NTHU", department: "物理系", gender: "male" },
  { id: "demo-m7", name: "測試・蔡承恩", score: 662, school: "NYCU", department: "土木系", gender: "male" },
  { id: "demo-m8", name: "測試・簡子軒", score: 628, school: "NTHU", department: "計財系", gender: "male" },
  { id: "demo-m9", name: "測試・呂冠廷", score: 591, school: "NYCU", department: "機械系", gender: "male" },
  { id: "demo-m10", name: "測試・方柏翰", score: 540, school: "OTHER", department: "企管系", gender: "male" },
  { id: "demo-f1", name: "測試・張雅婷", score: 940, school: "NYCU", department: "外文系", gender: "female" },
  { id: "demo-f2", name: "測試・王心怡", score: 888, school: "NTHU", department: "人社院", gender: "female" },
  { id: "demo-f3", name: "測試・李佳蓉", score: 801, school: "NYCU", department: "生科系", gender: "female" },
  { id: "demo-f4", name: "測試・吳欣儀", score: 720, school: "OTHER", department: "設計系", gender: "female" },
  { id: "demo-f5", name: "測試・林予安", score: 693, school: "NTHU", department: "化工系", gender: "female" },
  { id: "demo-f6", name: "測試・陳詩涵", score: 651, school: "NYCU", department: "傳科系", gender: "female" },
  { id: "demo-f7", name: "測試・黃詠晴", score: 617, school: "NTHU", department: "醫科系", gender: "female" },
  { id: "demo-f8", name: "測試・周宜蓁", score: 574, school: "NYCU", department: "護理系", gender: "female" },
  { id: "demo-f9", name: "測試・許若瑄", score: 533, school: "NTHU", department: "經濟系", gender: "female" },
  { id: "demo-f10", name: "測試・高子晴", score: 498, school: "OTHER", department: "建築系", gender: "female" },
];

function demoEntries(now: string): PunchEntry[] {
  return DEMO_ROWS.map((row) => ({ ...row, updatedAt: now }));
}

function demoBoard(): PunchBoard {
  const now = new Date().toISOString();
  return {
    eventName: DEFAULT_NAME,
    endAt: DEFAULT_END_AT,
    updatedAt: now,
    version: 1,
    entries: demoEntries(now),
  };
}

function coerceBoard(raw: string): PunchBoard {
  try {
    const parsed = JSON.parse(raw) as Partial<PunchBoard>;
    const entries = Array.isArray(parsed.entries) ? parsed.entries.filter(isEntry) : [];
    return {
      eventName: String(parsed.eventName || DEFAULT_NAME).slice(0, 80),
      endAt: String(parsed.endAt || DEFAULT_END_AT).slice(0, 40),
      updatedAt: String(parsed.updatedAt || ""),
      version: Number(parsed.version) || 0,
      entries,
    };
  } catch {
    return emptyBoard();
  }
}

/** Seed demo scores only when the board key is missing. Never revive deleted rows. */
export async function seedBoardIfEmpty(
  env: PunchEnv,
): Promise<{ board: PunchBoard; ready: boolean }> {
  if (!env.CHUMEI_VOTES) return { board: emptyBoard(), ready: false };
  const raw = await env.CHUMEI_VOTES.get(BOARD_KEY);
  if (!raw) {
    const seeded = demoBoard();
    await env.CHUMEI_VOTES.put(BOARD_KEY, JSON.stringify(seeded));
    return { board: seeded, ready: true };
  }
  return { board: coerceBoard(raw), ready: true };
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
  return { ready: true, board: coerceBoard(raw) };
}

export function rank(entries: PunchEntry[], gender: Gender) {
  return entries
    .filter((e) => e.gender === gender)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.updatedAt.localeCompare(b.updatedAt);
    })
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function publicPayload(board: PunchBoard, ready: boolean) {
  return {
    ready,
    eventName: board.eventName,
    endAt: board.endAt,
    updatedAt: board.updatedAt,
    male: rank(board.entries, "male"),
    female: rank(board.entries, "female"),
  };
}
