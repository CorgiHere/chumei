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

export const BOARD_KEY = "punchboard-v1";
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

function demoBoard(): PunchBoard {
  const now = new Date().toISOString();
  const rows: Array<Omit<PunchEntry, "updatedAt">> = [
    { id: "demo-m1", name: "測試・林大為", score: 998, school: "NTHU", department: "電機系", gender: "male" },
    { id: "demo-m2", name: "測試・陳冠宇", score: 912, school: "NYCU", department: "資工系", gender: "male" },
    { id: "demo-m3", name: "測試・黃志明", score: 870, school: "NTHU", department: "動機系", gender: "male" },
    { id: "demo-m4", name: "測試・周柏宇", score: 755, school: "NTHU", department: "工工系", gender: "male" },
    { id: "demo-f1", name: "測試・張雅婷", score: 940, school: "NYCU", department: "外文系", gender: "female" },
    { id: "demo-f2", name: "測試・王心怡", score: 888, school: "NTHU", department: "人社院", gender: "female" },
    { id: "demo-f3", name: "測試・李佳蓉", score: 801, school: "NYCU", department: "生科系", gender: "female" },
    { id: "demo-f4", name: "測試・吳欣儀", score: 720, school: "OTHER", department: "設計系", gender: "female" },
  ];
  return {
    eventName: DEFAULT_NAME,
    endAt: DEFAULT_END_AT,
    updatedAt: now,
    version: 1,
    entries: rows.map((row) => ({ ...row, updatedAt: now })),
  };
}

/** First visit writes demo scores so the live board can be checked. */
export async function seedBoardIfEmpty(
  env: PunchEnv,
): Promise<{ board: PunchBoard; ready: boolean }> {
  if (!env.CHUMEI_VOTES) return { board: emptyBoard(), ready: false };
  const raw = await env.CHUMEI_VOTES.get(BOARD_KEY);
  if (raw) return readBoard(env);
  const seeded = demoBoard();
  await env.CHUMEI_VOTES.put(BOARD_KEY, JSON.stringify(seeded));
  return { board: seeded, ready: true };
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
  try {
    const parsed = JSON.parse(raw) as Partial<PunchBoard>;
    const entries = Array.isArray(parsed.entries) ? parsed.entries.filter(isEntry) : [];
    return {
      ready: true,
      board: {
        eventName: String(parsed.eventName || DEFAULT_NAME).slice(0, 80),
        endAt: String(parsed.endAt || DEFAULT_END_AT).slice(0, 40),
        updatedAt: String(parsed.updatedAt || ""),
        version: Number(parsed.version) || 0,
        entries,
      },
    };
  } catch {
    return { board: emptyBoard(), ready: true };
  }
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
