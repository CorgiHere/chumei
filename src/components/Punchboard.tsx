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
  type RankedPunchEntry,
} from "@/lib/punchboard";
import { cn } from "@/lib/utils";

const POLL_MS = 4000;

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
        <p className="eyebrow">2026 年 11 月 17 日（二）</p>
        <Heading className="display-title text-[clamp(28px,5vw,56px)] leading-[1.15]">
          {board.eventName}
          <span className="mark"> 即時榜</span>
        </Heading>
        <p className="mt-3 max-w-2xl text-[15px] text-muted">
          現場拳擊機分數公開排名。分男性／女性兩榜，分數高到低。電腦與手機都會自動更新。
        </p>

        <div className="mt-8 grid gap-0.5 md:grid-cols-[1.2fr_1fr]">
          <div className="bg-dark-gray p-6">
            <p className="font-mono-ui text-[11px] tracking-widest text-brand-yellow">
              {countdown.ended ? "活動狀態" : "距離結束"}
            </p>
            <p className="font-num mt-2 text-[clamp(36px,8vw,72px)] leading-none font-bold text-brand-yellow">
              {countdown.label}
            </p>
            <p className="mt-3 text-sm text-muted">
              {countdown.ended
                ? "倒數已結束，以下為最終排名。"
                : "現場登錄後約數秒內會出現在榜上。"}
            </p>
          </div>
          <div className="bg-dark-gray p-6">
            <label className="font-mono-ui text-[11px] tracking-widest text-brand-yellow" htmlFor="punch-search">
              查詢姓名／學校／系所
            </label>
            <input
              id="punch-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例如：王小明、清大、電機"
              className="mt-3 w-full border-2 border-white/20 bg-ink px-3 py-3 text-[15px] text-chalk outline-none placeholder:text-muted focus:border-brand-yellow"
            />
            <p className="mt-3 font-mono-ui text-[12px] text-muted">
              男性 {board.male.length} 人　女性 {board.female.length} 人
              {board.ready ? "" : "　（榜尚未連線，稍後自動重試）"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-2 md:hidden">
          {(["male", "female"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setTab(g)}
              className={cn(
                "min-h-12 flex-1 border-2 px-3 font-mono-ui text-sm tracking-widest",
                tab === g
                  ? "border-brand-yellow bg-brand-yellow text-ink"
                  : "border-white/20 text-chalk",
              )}
            >
              {PUNCH_GENDER_LABEL[g]}
            </button>
          ))}
        </div>
      </div>

      <div className="container-main mt-6 grid gap-6 md:grid-cols-2">
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
  const top = rows.filter((r) => r.rank <= 3);
  const rest = rows.filter((r) => r.rank > 3);
  return (
    <section className={className} aria-labelledby={`punch-${gender}`}>
      <h2 id={`punch-${gender}`} className="mb-4 text-2xl font-black">
        {PUNCH_GENDER_LABEL[gender]}
      </h2>
      {rows.length === 0 ? (
        <p className="bg-dark-gray p-6 text-sm text-muted">目前沒有符合的成績。</p>
      ) : (
        <>
          <ol className="grid gap-2">
            {top.map((row) => (
              <li key={row.id}>
                <PodiumCard entry={row} />
              </li>
            ))}
          </ol>
          {rest.length > 0 ? (
            <ol className="mt-3 divide-y divide-white/10 border border-white/10">
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

function PodiumCard({ entry }: { entry: RankedPunchEntry }) {
  const tone =
    entry.rank === 1
      ? "border-brand-yellow bg-[#2a2308]"
      : entry.rank === 2
        ? "border-white/40 bg-dark-gray"
        : "border-[#c47a3a] bg-[#23180f]";
  return (
    <article className={cn("border-2 p-4 md:p-5", tone)}>
      <div className="flex items-end justify-between gap-3">
        <p className="font-num text-[clamp(40px,8vw,64px)] leading-none font-bold text-brand-yellow">
          {entry.rank}
        </p>
        <p className="font-num text-[clamp(28px,6vw,44px)] leading-none font-bold">
          {formatScore(entry.score)}
        </p>
      </div>
      <p className="mt-3 text-xl font-black">{entry.name}</p>
      <p className="mt-1 text-sm text-muted">
        {PUNCH_SCHOOL_LABEL[entry.school]}
        {entry.department ? `　${entry.department}` : ""}
      </p>
    </article>
  );
}

function RankRow({ entry }: { entry: RankedPunchEntry }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3 md:px-4">
      <span className="font-num w-8 shrink-0 text-lg font-bold text-muted">{entry.rank}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-black">{entry.name}</p>
        <p className="truncate text-xs text-muted">
          {PUNCH_SCHOOL_LABEL[entry.school]}
          {entry.department ? `　${entry.department}` : ""}
        </p>
      </div>
      <span className="font-num shrink-0 text-xl font-bold">{formatScore(entry.score)}</span>
    </div>
  );
}
