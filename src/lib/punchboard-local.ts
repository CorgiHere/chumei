import type { PunchEntry } from "@/lib/punchboard";

export type PunchLocalSnapshot = {
  savedAt: string;
  eventName: string;
  endAt: string;
  entries: PunchEntry[];
};

const STORAGE_KEY = "chumei-punchboard-local-v1";
const MAX_SNAPSHOTS = 40;

function readAll(): PunchLocalSnapshot[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSnapshot);
  } catch {
    return [];
  }
}

function isSnapshot(value: unknown): value is PunchLocalSnapshot {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<PunchLocalSnapshot>;
  return (
    typeof item.savedAt === "string" &&
    typeof item.eventName === "string" &&
    typeof item.endAt === "string" &&
    Array.isArray(item.entries)
  );
}

function sameBoard(a: PunchLocalSnapshot, b: PunchLocalSnapshot) {
  return (
    a.eventName === b.eventName &&
    a.endAt === b.endAt &&
    JSON.stringify(a.entries) === JSON.stringify(b.entries)
  );
}

export function rememberPunchboardLocal(board: {
  eventName: string;
  endAt: string;
  entries: PunchEntry[];
}) {
  const snapshot: PunchLocalSnapshot = {
    savedAt: new Date().toISOString(),
    eventName: board.eventName,
    endAt: board.endAt,
    entries: board.entries,
  };
  const all = readAll();
  if (all[0] && sameBoard(all[0], snapshot)) {
    return all[0];
  }
  const next = [snapshot, ...all].slice(0, MAX_SNAPSHOTS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return snapshot;
}

export function latestPunchboardLocal(): PunchLocalSnapshot | null {
  return readAll()[0] ?? null;
}

export function downloadPunchboardSnapshot(snapshot: PunchLocalSnapshot) {
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const stamp = snapshot.savedAt.replace(/[:.]/g, "-");
  const link = document.createElement("a");
  link.href = url;
  link.download = `punchboard-${stamp}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function readPunchboardFile(file: File): Promise<PunchLocalSnapshot> {
  const text = await file.text();
  const parsed = JSON.parse(text) as Partial<PunchLocalSnapshot> & {
    entries?: PunchEntry[];
  };
  if (!Array.isArray(parsed.entries)) {
    throw new Error("invalid");
  }
  return {
    savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : new Date().toISOString(),
    eventName: typeof parsed.eventName === "string" ? parsed.eventName : "拳擊機大賽",
    endAt: typeof parsed.endAt === "string" ? parsed.endAt : "",
    entries: parsed.entries,
  };
}

export function formatBackupTime(iso: string) {
  const date = new Date(iso);
  if (!Number.isFinite(date.getTime())) return iso;
  return date.toLocaleString("zh-TW", { hour12: false });
}
