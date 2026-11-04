export type PunchGender = "male" | "female";
export type PunchSchool = "NTHU" | "NYCU" | "OTHER";
export type PunchNameMode = "legal" | "nick";

export type PunchEntry = {
  id: string;
  name: string;
  score: number;
  school: PunchSchool;
  schoolOther?: string;
  department: string;
  gender: PunchGender;
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
  school: PunchSchool;
  schoolOther?: string;
  department: string;
  gender: PunchGender;
  contact: string;
};

export type RankedPunchEntry = PunchEntry & { rank: number };

export type PunchboardPayload = {
  ready: boolean;
  eventName: string;
  endAt: string;
  updatedAt: string;
  male: RankedPunchEntry[];
  female: RankedPunchEntry[];
};

export const PUNCHBOARD_DEFAULT_NAME = "詐騙來電，Whoscall 開扁";
export const PUNCHBOARD_DEFAULT_END_AT = "2026-11-17T23:59:00+08:00";
export const PUNCHBOARD_START_AT = "2026-11-17T00:00:00+08:00";

export const PUNCH_SCHOOL_LABEL: Record<PunchSchool, string> = {
  NTHU: "清大",
  NYCU: "交大",
  OTHER: "其他",
};

export function punchSchoolDisplay(entry: {
  school: PunchSchool;
  schoolOther?: string;
}) {
  if (entry.school === "NTHU") return "清大";
  if (entry.school === "NYCU") return "交大";
  const custom = (entry.schoolOther ?? "").trim();
  return custom || "其他";
}

export const PUNCH_GENDER_LABEL: Record<PunchGender, string> = {
  male: "男性",
  female: "女性",
};

export function getPunchboardEndpoint(): string {
  if (typeof window === "undefined") return "https://chumei.org/api/punchboard/";
  const host = window.location.hostname;
  if (host === "chumei.org" || host.endsWith(".pages.dev")) {
    return "/api/punchboard/";
  }
  return "https://chumei.org/api/punchboard/";
}

/** Admin cookie is same-origin only — use https://chumei.org/punchboard/admin/ */
export function getPunchboardAdminEndpoint(): string {
  return "/api/punchboard/admin/";
}

export function emptyPunchboard(): PunchboardPayload {
  return {
    ready: false,
    eventName: PUNCHBOARD_DEFAULT_NAME,
    endAt: PUNCHBOARD_DEFAULT_END_AT,
    updatedAt: "",
    male: [],
    female: [],
  };
}

export function normalizePersonName(name: string) {
  return name
    .normalize("NFKC")
    .replace(/[・·‧．.．\-—–_]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

export function normalizePlayerId(id: string) {
  return id.normalize("NFKC").trim().toUpperCase().replace(/\s+/g, "");
}

export function personKey(entry: { id?: string; name: string; gender: PunchGender }) {
  const id = normalizePlayerId(entry.id ?? "");
  if (id) return `id:${id}`;
  return `${entry.gender}:${normalizePersonName(entry.name)}`;
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

export function rankEntries(entries: PunchEntry[]): RankedPunchEntry[] {
  return uniqueByPerson(entries)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.updatedAt.localeCompare(b.updatedAt);
    })
    .slice(0, 10)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function matchesQuery(entry: PunchEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [
    entry.id,
    entry.name,
    entry.legalName,
    entry.nickname,
    entry.department,
    entry.school,
    entry.schoolOther,
    PUNCH_SCHOOL_LABEL[entry.school],
    punchSchoolDisplay(entry),
  ]
    .join(" ")
    .toLowerCase()
    .includes(q);
}
