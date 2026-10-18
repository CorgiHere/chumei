export type PunchGender = "male" | "female";
export type PunchSchool = "NTHU" | "NYCU" | "OTHER";

export type PunchEntry = {
  id: string;
  name: string;
  score: number;
  school: PunchSchool;
  department: string;
  gender: PunchGender;
  updatedAt: string;
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

export const PUNCHBOARD_DEFAULT_NAME = "拳擊機大賽";
export const PUNCHBOARD_DEFAULT_END_AT = "2026-11-17T23:59:00+08:00";
export const PUNCHBOARD_START_AT = "2026-11-17T00:00:00+08:00";

export const PUNCH_SCHOOL_LABEL: Record<PunchSchool, string> = {
  NTHU: "清大",
  NYCU: "交大",
  OTHER: "其他",
};

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

export function rankEntries(entries: PunchEntry[]): RankedPunchEntry[] {
  return [...entries]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.updatedAt.localeCompare(b.updatedAt);
    })
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function matchesQuery(entry: PunchEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [
    entry.name,
    entry.department,
    entry.school,
    PUNCH_SCHOOL_LABEL[entry.school],
  ]
    .join(" ")
    .toLowerCase()
    .includes(q);
}
