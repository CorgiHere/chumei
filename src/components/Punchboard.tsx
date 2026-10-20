"use client";

import { useEffect, useMemo, useState } from "react";
import { Press_Start_2P } from "next/font/google";
import localFont from "next/font/local";
import {
  emptyPunchboard,
  getPunchboardEndpoint,
  matchesQuery,
  PUNCHBOARD_START_AT,
  type PunchboardPayload,
  type PunchGender,
  type PunchSchool,
  type RankedPunchEntry,
} from "@/lib/punchboard";
import { cn, withBasePath } from "@/lib/utils";
import { useSchoolSides } from "./SchoolOrder";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const fusionPixel = localFont({
  src: "../../public/fonts/fusion-pixel-12px-zh-tw.woff2",
  display: "swap",
});

const POLL_MS = 8000;
const POLL_JITTER_MS = 2000;

function asRanked(raw: unknown, gender: PunchGender): RankedPunchEntry[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((row, index) => {
    if (!row || typeof row !== "object") return [];
    const item = row as Partial<RankedPunchEntry>;
    const name = String(item.name ?? "").trim();
    if (!name) return [];
    const school =
      item.school === "NYCU" || item.school === "OTHER" || item.school === "NTHU"
        ? item.school
        : "OTHER";
    return [
      {
        id: String(item.id ?? `${gender}-${index}`),
        name,
        score: Number(item.score) || 0,
        school,
        department: String(item.department ?? ""),
        gender,
        updatedAt: String(item.updatedAt ?? ""),
        rank: Number(item.rank) || index + 1,
      },
    ];
  });
}

function parseBoard(data: Partial<PunchboardPayload>): PunchboardPayload | null {
  if (typeof data.eventName !== "string" || typeof data.endAt !== "string") return null;
  return {
    ready: data.ready !== false,
    eventName: data.eventName,
    endAt: data.endAt,
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
    male: asRanked(data.male, "male"),
    female: asRanked(data.female, "female"),
  };
}

function formatScore(n: number) {
  return n.toLocaleString("en-US");
}

function ordinal(n: number) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}TH`;
  switch (n % 10) {
    case 1:
      return `${n}ST`;
    case 2:
      return `${n}ND`;
    case 3:
      return `${n}RD`;
    default:
      return `${n}TH`;
  }
}

function formatRemain(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return days > 0 ? `${days} 天 ${clock}` : clock;
}

function useCountdown(startAt: string, endAt: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, []);
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  if (now === null || !Number.isFinite(start)) {
    return { phase: "waiting" as const, label: "距離 11/17", clock: "—" };
  }
  if (now < start) {
    return {
      phase: "waiting" as const,
      label: "距離 11/17",
      clock: formatRemain(start - now),
    };
  }
  if (Number.isFinite(end) && now > end) {
    return { phase: "ended" as const, label: "活動狀態", clock: "本場完賽" };
  }
  return {
    phase: "live" as const,
    label: "距離結束",
    clock: Number.isFinite(end) ? formatRemain(end - now) : "進行中",
  };
}

function schoolTotal(rows: RankedPunchEntry[], school: PunchSchool) {
  return rows.filter((row) => row.school === school).reduce((sum, row) => sum + row.score, 0);
}

export function Punchboard({ headingLevel = "h1" }: { headingLevel?: "h1" | "h2" }) {
  const [board, setBoard] = useState<PunchboardPayload>(emptyPunchboard);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<PunchGender>("male");
  const Heading = headingLevel;
  const countdown = useCountdown(PUNCHBOARD_START_AT, board.endAt);

  useEffect(() => {
    let alive = true;

    const refresh = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const res = await fetch(getPunchboardEndpoint(), {
          cache: "no-cache",
          headers: { Accept: "application/json" },
        });
        if (!alive || !res.ok) return;
        const next = parseBoard((await res.json()) as Partial<PunchboardPayload>);
        if (!alive || !next) return;
        setBoard(next);
      } catch {
        /* keep last good board */
      }
    };

    void refresh();
    const timer = window.setInterval(
      refresh,
      POLL_MS + Math.floor(Math.random() * POLL_JITTER_MS),
    );
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const filteredMale = useMemo(
    () => board.male.filter((row) => matchesQuery(row, query)),
    [board.male, query],
  );
  const filteredFemale = useMemo(
    () => board.female.filter((row) => matchesQuery(row, query)),
    [board.female, query],
  );
  const rows = tab === "male" ? filteredMale : filteredFemale;

  return (
    <div data-keep-order className={cn("bg-ink text-white", fusionPixel.className)}>
      <div
        className="relative mx-auto w-full max-w-[390px] overflow-hidden bg-[#07133f] px-4 pb-8 pt-5 sm:max-w-[420px]"
        style={{ WebkitFontSmoothing: "none" }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 4px)",
          }}
        />
        <div className="flex items-center justify-center gap-2.5">
          <img
            src={withBasePath("/images/partners/whoscall-logo-green.png")}
            alt="Whoscall"
            className="h-6 w-auto"
          />
          <span className="text-white/70">×</span>
          <img
            src={withBasePath("/images/brand/chumei-logo.png")}
            alt="Chu Mei"
            className="h-8 w-auto"
          />
        </div>
        <p
          className={cn(
            pressStart.className,
            "relative mt-2 text-center text-[8px] leading-relaxed text-white/50",
          )}
        >
          {countdown.phase === "ended" ? "FINAL" : "LIVE"} 11/17 {countdown.clock}
        </p>

        <Heading className="sr-only">詐騙來電，Whoscall 開扁</Heading>
        <img
          src={withBasePath("/images/activities/whoscall-openflat-banner.png")}
          alt="詐騙來電，Whoscall 開扁"
          className="relative mx-auto mt-3 w-full"
          style={{ imageRendering: "pixelated" }}
        />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <TabButton
            active={tab === "male"}
            tone="p1"
            onClick={() => setTab("male")}
            kicker="1P"
            label="男生組"
            arcade={pressStart.className}
          />
          <TabButton
            active={tab === "female"}
            tone="p2"
            onClick={() => setTab("female")}
            kicker="2P"
            label="女生組"
            arcade={pressStart.className}
          />
        </div>

        <p
          className={cn(
            pressStart.className,
            "relative mt-6 text-center text-[16px] leading-none text-[#ffd54a]",
          )}
          style={{ textShadow: "2px 2px 0 #5a3a00, -1px 0 0 #5a3a00, 0 -1px 0 #5a3a00" }}
        >
          HIGH SCORE
        </p>
        <p className="relative mt-3 text-center text-[12px] leading-relaxed tracking-wide text-white/80">
          反詐達人就是你！即刻開扁
        </p>

        <label className="sr-only" htmlFor="punch-search">
          查詢姓名／學校／系所
        </label>
        <input
          id="punch-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="查姓名、學校、系所"
          className="relative mt-3 w-full rounded-none border-0 border-b-2 border-white/20 bg-transparent px-1 py-1.5 text-center text-[12px] text-white outline-none placeholder:text-white/30 hover:border-[#ffd54a]/70 focus:border-[#ffd54a]"
        />

        {rows.length === 0 ? (
          <p className="mt-6 py-8 text-center text-sm text-white/55">目前沒有符合的成績。</p>
        ) : (
          <ol className="relative mt-3">
            {rows.map((row) => (
              <li key={row.id} className="border-b-2 border-white/10">
                <RankRow entry={row} arcade={pressStart.className} />
              </li>
            ))}
          </ol>
        )}

        <SchoolTotals rows={rows} arcade={pressStart.className} />

        {board.ready ? null : (
          <p className="mt-3 text-center font-mono-ui text-[11px] tracking-widest text-[#5ef0ea]">
            連線中
          </p>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  tone,
  onClick,
  kicker,
  label,
  arcade,
}: {
  active: boolean;
  tone: "p1" | "p2";
  onClick: () => void;
  kicker: string;
  label: string;
  arcade: string;
}) {
  const filled =
    tone === "p1"
      ? "border-4 border-[#c9a000] bg-[#ffd000] text-[#1a1400] hover:bg-[#ffe34d] hover:shadow-[4px_4px_0_#8a6a00]"
      : "border-4 border-[#148f88] bg-[#2ee0d6] text-[#06203a] hover:bg-[#5ff0e8] hover:shadow-[4px_4px_0_#0a6a66]";
  const idle =
    tone === "p1"
      ? "border-4 border-[#ffd000]/55 bg-transparent text-[#ffe9a3] hover:bg-[#ffd000] hover:text-[#1a1400] hover:shadow-[4px_4px_0_#8a6a00]"
      : "border-4 border-[#2ee0d6] bg-transparent text-[#9ff6f2] hover:bg-[#2ee0d6] hover:text-[#06203a] hover:shadow-[4px_4px_0_#0a6a66]";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex min-h-[76px] cursor-pointer flex-col items-center justify-center rounded-md px-2 leading-none",
        active ? filled : idle,
      )}
    >
      <span className={cn(arcade, "text-[16px]")}>{kicker}</span>
      <span className="mt-2 text-[12px]">{label}</span>
    </button>
  );
}

function RankRow({
  entry,
  arcade,
}: {
  entry: RankedPunchEntry;
  arcade: string;
}) {
  return (
    <div className="flex cursor-default items-center gap-2 py-2 hover:bg-[#2ee0d6]/15">
      <span className={cn(arcade, "w-12 shrink-0 text-[10px] text-[#ffd54a]")}>
        {ordinal(entry.rank)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] leading-tight">{entry.name}</p>
        {entry.department.trim() ? (
          <p className="truncate text-[10px] leading-tight text-white/45">{entry.department}</p>
        ) : null}
      </div>
      <span
        className={cn(
          "inline-flex shrink-0 items-center rounded-none px-1.5 py-0.5 text-[12px] text-white",
          entry.school === "NTHU" && "bg-nthu",
          entry.school === "NYCU" && "bg-nycu",
          entry.school === "OTHER" && "bg-white/25 text-white/80",
        )}
      >
        {entry.school === "NTHU" ? "清" : entry.school === "NYCU" ? "交" : "他"}
      </span>
      <span className={cn(arcade, "w-14 shrink-0 text-right text-[12px] text-white")}>
        {formatScore(entry.score)}
      </span>
    </div>
  );
}

function SchoolTotals({
  rows,
  arcade,
}: {
  rows: RankedPunchEntry[];
  arcade: string;
}) {
  const nthu = schoolTotal(rows, "NTHU");
  const nycu = schoolTotal(rows, "NYCU");
  const [left, right] = useSchoolSides(
    { label: "清大", score: nthu, tone: "nthu" as const },
    { label: "交大", score: nycu, tone: "nycu" as const },
  );
  return (
    <div className="relative mt-5 flex items-center justify-between rounded-none border-4 border-[#ff4f9a] px-3 py-2.5 text-[12px]">
      <span>
        {left.label}{" "}
        <span
          className={cn(
            arcade,
            "text-[12px]",
            left.tone === "nthu" ? "text-[#ffd54a]" : "text-[#6ea8ff]",
          )}
        >
          {formatScore(left.score)}
        </span>
      </span>
      <span className={cn(arcade, "text-[10px] text-[#ff4f9a]")}>VS</span>
      <span>
        <span
          className={cn(
            arcade,
            "text-[12px]",
            right.tone === "nthu" ? "text-[#ffd54a]" : "text-[#6ea8ff]",
          )}
        >
          {formatScore(right.score)}
        </span>{" "}
        {right.label}
      </span>
    </div>
  );
}
