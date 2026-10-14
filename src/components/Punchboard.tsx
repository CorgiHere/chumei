"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  emptyPunchboard,
  getPunchboardEndpoint,
  matchesQuery,
  PUNCH_GENDER_LABEL,
  PUNCH_SCHOOL_LABEL,
  type PunchboardPayload,
  type PunchGender,
  type PunchSchool,
  type RankedPunchEntry,
} from "@/lib/punchboard";
import { cn } from "@/lib/utils";
import { HazardBar } from "./HazardBar";

const POLL_MS = 4000;

const PODIUM_META: Record<
  1 | 2 | 3,
  { title: string; accent: string; panel: string; score: string }
> = {
  1: {
    title: "冠軍",
    accent: "bg-brand-yellow text-ink",
    panel: "border-brand-yellow bg-brand-yellow text-ink",
    score: "text-ink",
  },
  2: {
    title: "亞軍",
    accent: "bg-chalk text-ink",
    panel: "border-white/35 bg-[#2a2a2a] text-chalk",
    score: "text-chalk",
  },
  3: {
    title: "季軍",
    accent: "bg-[#c47a3a] text-ink",
    panel: "border-[#c47a3a] bg-[#1c140e] text-chalk",
    score: "text-[#e8b27a]",
  },
};

function parseBoard(data: Partial<PunchboardPayload>): PunchboardPayload | null {
  if (typeof data.eventName !== "string" || typeof data.endAt !== "string") return null;
  return {
    ready: data.ready !== false,
    eventName: data.eventName,
    endAt: data.endAt,
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
    male: Array.isArray(data.male) ? data.male : [],
    female: Array.isArray(data.female) ? data.female : [],
  };
}

function formatScore(n: number) {
  return n.toLocaleString("en-US");
}

function useCountdown(endAt: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = window.setInterval(() => setNow(Date.now()), reduced ? 1000 : 250);
    return () => window.clearInterval(id);
  }, []);
  const end = new Date(endAt).getTime();
  if (!Number.isFinite(end)) {
    return { ended: false, label: "—" };
  }
  const diff = end - now;
  if (diff <= 0) return { ended: true, label: "本場完賽" };
  const total = Math.floor(diff / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  const clock = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return { ended: false, label: days > 0 ? `${days} 天 ${clock}` : clock };
}

export function Punchboard({ headingLevel = "h1" }: { headingLevel?: "h1" | "h2" }) {
  const [board, setBoard] = useState<PunchboardPayload>(emptyPunchboard);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<PunchGender>("male");
  const etagRef = useRef<string | null>(null);
  const Heading = headingLevel;
  const countdown = useCountdown(board.endAt);

  useEffect(() => {
    let cancelled = false;
    let inflight = false;

    const refresh = async () => {
      if (inflight || document.visibilityState === "hidden") return;
      inflight = true;
      try {
        const headers: HeadersInit = {};
        if (etagRef.current) headers["If-None-Match"] = etagRef.current;
        const res = await fetch(getPunchboardEndpoint(), {
          cache: "no-store",
          headers,
        });
        if (cancelled) return;
        if (res.status === 304) return;
        if (!res.ok) return;
        const next = parseBoard((await res.json()) as Partial<PunchboardPayload>);
        if (!next) return;
        etagRef.current = res.headers.get("ETag");
        setBoard(next);
      } catch {
        /* keep last good board */
      } finally {
        inflight = false;
      }
    };

    refresh();
    const timer = window.setInterval(refresh, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
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

  return (
    <div>
      <div className="container-main">
        <div className="flex flex-wrap items-center gap-3">
          <p
            className={cn(
              "inline-flex min-h-8 items-center gap-2 bg-brand-yellow px-3 font-mono-ui text-[11px] font-bold tracking-[0.18em] text-ink",
            )}
          >
            <span
              className="size-2 shrink-0 bg-ink motion-safe:animate-pulse"
              aria-hidden
            />
            {countdown.ended ? "FINAL" : "LIVE"}
          </p>
          <p className="eyebrow m-0">2026 年 11 月 17 日（二）</p>
        </div>
        <Heading className="display-title mt-4 text-[clamp(28px,5vw,56px)] leading-[1.15]">
          {board.eventName}
          <span className="mark"> 即時榜</span>
        </Heading>
        <p className="mt-3 max-w-2xl text-[15px] text-muted">
          現場拳擊機分數公開排名。分男性／女性兩榜，分數高到低。電腦與手機都會自動更新。
        </p>

        <div className="mt-8 overflow-hidden border-2 border-brand-yellow">
          <HazardBar animated={!countdown.ended} className="h-3" />
          <div className="grid gap-px bg-white/10 md:grid-cols-[1.15fr_1fr]">
            <div className="bg-ink px-5 py-6 md:px-7 md:py-8">
              <p className="font-mono-ui text-[11px] tracking-[0.2em] text-brand-yellow">
                {countdown.ended ? "活動狀態" : "距離結束"}
              </p>
              <p className="font-num mt-3 text-[clamp(40px,9vw,84px)] leading-none font-bold tracking-tight text-brand-yellow">
                {countdown.label}
              </p>
              <p className="mt-4 text-sm text-muted">
                {countdown.ended
                  ? "倒數已結束，以下為最終排名。"
                  : "現場登錄後約數秒內會出現在榜上。"}
              </p>
            </div>
            <div className="bg-dark-gray px-5 py-6 md:px-7 md:py-8">
              <label
                className="font-mono-ui text-[11px] tracking-[0.2em] text-brand-yellow"
                htmlFor="punch-search"
              >
                查詢姓名／學校／系所
              </label>
              <input
                id="punch-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="例如：王小明、清大、電機"
                className="mt-4 w-full border-2 border-white/20 bg-ink px-3 py-3 text-[15px] text-chalk outline-none placeholder:text-muted focus:border-brand-yellow"
              />
              <div className="mt-4 flex flex-wrap gap-2 font-mono-ui text-[12px] tracking-widest">
                <span className="border border-white/20 px-2 py-1">
                  男性 {board.male.length}
                </span>
                <span className="border border-white/20 px-2 py-1">
                  女性 {board.female.length}
                </span>
                {board.ready ? null : (
                  <span className="border border-brand-yellow px-2 py-1 text-brand-yellow">
                    連線中
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2 md:hidden">
          {(["male", "female"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setTab(g)}
              className={cn(
                "min-h-12 flex-1 px-3 font-mono-ui text-sm tracking-widest",
                tab === g
                  ? "bg-brand-yellow text-ink"
                  : "bg-dark-gray text-chalk",
              )}
            >
              {PUNCH_GENDER_LABEL[g]}
            </button>
          ))}
        </div>
      </div>

      <div className="container-main mt-8 grid gap-10 md:grid-cols-2 md:gap-8">
        <GenderBoard
          gender="male"
          rows={filteredMale}
          className={tab === "male" ? "block" : "hidden md:block"}
        />
        <GenderBoard
          gender="female"
          rows={filteredFemale}
          className={tab === "female" ? "block" : "hidden md:block"}
        />
      </div>
    </div>
  );
}

function GenderBoard({
  gender,
  rows,
  className,
}: {
  gender: PunchGender;
  rows: RankedPunchEntry[];
  className?: string;
}) {
  const first = rows.find((r) => r.rank === 1);
  const second = rows.find((r) => r.rank === 2);
  const third = rows.find((r) => r.rank === 3);
  const rest = rows.filter((r) => r.rank > 3);
  const hasPodium = Boolean(first || second || third);

  return (
    <section className={className} aria-labelledby={`punch-${gender}`}>
      <div className="mb-4 flex items-end justify-between gap-3 border-b-2 border-brand-yellow pb-3">
        <h2 id={`punch-${gender}`} className="m-0 text-2xl font-black md:text-3xl">
          {PUNCH_GENDER_LABEL[gender]}
        </h2>
        <p className="font-mono-ui text-[11px] tracking-[0.16em] text-muted">
          {rows.length} 人
        </p>
      </div>
      {rows.length === 0 ? (
        <p className="bg-dark-gray p-6 text-sm text-muted">目前沒有符合的成績。</p>
      ) : (
        <>
          {hasPodium ? (
            <ol className="grid grid-cols-1 items-end gap-2 md:grid-cols-3">
              {first ? (
                <li className="md:order-2">
                  <PodiumCard entry={first} featured />
                </li>
              ) : null}
              {second ? (
                <li className="md:order-1 md:pt-8">
                  <PodiumCard entry={second} />
                </li>
              ) : (
                <li className="hidden md:order-1 md:block" aria-hidden />
              )}
              {third ? (
                <li className="md:order-3 md:pt-12">
                  <PodiumCard entry={third} />
                </li>
              ) : (
                <li className="hidden md:order-3 md:block" aria-hidden />
              )}
            </ol>
          ) : null}
          {rest.length > 0 ? (
            <ol className="mt-4 divide-y divide-white/10 border border-white/12 bg-charcoal">
              {rest.map((row) => (
                <li key={row.id}>
                  <RankRow entry={row} />
                </li>
              ))}
            </ol>
          ) : null}
        </>
      )}
    </section>
  );
}

function PodiumCard({
  entry,
  featured = false,
}: {
  entry: RankedPunchEntry;
  featured?: boolean;
}) {
  const place = entry.rank === 1 || entry.rank === 2 || entry.rank === 3 ? entry.rank : 3;
  const meta = PODIUM_META[place];
  return (
    <article className={cn("border-2 p-4 md:p-5", meta.panel)}>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "px-2 py-1 font-mono-ui text-[11px] font-bold tracking-[0.16em]",
            meta.accent,
            place === 1 ? "bg-ink text-brand-yellow" : "",
          )}
        >
          {meta.title}
        </span>
        <span className="font-num text-2xl font-bold leading-none opacity-70">
          {String(entry.rank).padStart(2, "0")}
        </span>
      </div>
      <p
        className={cn(
          "font-num mt-4 leading-none font-bold",
          featured
            ? "text-[clamp(44px,8vw,72px)]"
            : "text-[clamp(32px,6vw,48px)]",
          meta.score,
        )}
      >
        {formatScore(entry.score)}
      </p>
      <p className={cn("mt-4 truncate text-lg font-black md:text-xl", featured && "md:text-2xl")}>
        {entry.name}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <SchoolChip school={entry.school} />
        {entry.department ? (
          <span className="truncate text-xs opacity-80">{entry.department}</span>
        ) : null}
      </div>
    </article>
  );
}

function RankRow({ entry }: { entry: RankedPunchEntry }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3.5 md:px-4">
      <span className="font-num w-9 shrink-0 text-xl font-bold text-brand-yellow">
        {String(entry.rank).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-black">{entry.name}</p>
        <div className="mt-1 flex min-w-0 items-center gap-2">
          <SchoolChip school={entry.school} />
          {entry.department ? (
            <span className="truncate text-xs text-muted">{entry.department}</span>
          ) : null}
        </div>
      </div>
      <span className="font-num shrink-0 text-[22px] font-bold leading-none">
        {formatScore(entry.score)}
      </span>
    </div>
  );
}

function SchoolChip({ school }: { school: PunchSchool }) {
  return (
    <span
      className={cn(
        "shrink-0 px-1.5 py-0.5 font-mono-ui text-[10px] font-bold tracking-widest text-white",
        school === "NTHU" && "bg-nthu",
        school === "NYCU" && "bg-nycu",
        school === "OTHER" && "bg-dark-gray text-muted ring-1 ring-white/25",
      )}
    >
      {PUNCH_SCHOOL_LABEL[school]}
    </span>
  );
}
