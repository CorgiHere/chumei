"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Press_Start_2P } from "next/font/google";
import localFont from "next/font/local";
import {
  emptyPunchboard,
  getPunchboardEndpoint,
  matchesQuery,
  personKey,
  punchSchoolDisplay,
  PUNCHBOARD_START_AT,
  uniqueByPerson,
  type PunchboardPayload,
  type PunchGender,
  type PunchSchool,
  type RankedPunchEntry,
} from "@/lib/punchboard";
import { cn, withBasePath } from "@/lib/utils";
import { ArcadeCabinet, PunchBrandLockup } from "./ArcadeCabinet";
import { PunchBattleHud } from "./PunchBattleHud";
import { useSchoolSides } from "./SchoolOrder";

const BOARD_SLOTS = 10;
const SCHOOL_TAGS: Array<{ id: PunchSchool; label: string }> = [
  { id: "NTHU", label: "清大" },
  { id: "NYCU", label: "交大" },
  { id: "OTHER", label: "其他" },
];

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
        schoolOther: String(item.schoolOther ?? ""),
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
    male: rankGender(asRanked(data.male, "male")),
    female: rankGender(asRanked(data.female, "female")),
  };
}

function rankGender(rows: RankedPunchEntry[]): RankedPunchEntry[] {
  return uniqueByPerson(rows)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.updatedAt.localeCompare(b.updatedAt);
    })
    .slice(0, BOARD_SLOTS)
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

function topTen(rows: RankedPunchEntry[]) {
  return rows.slice(0, BOARD_SLOTS);
}

function findArrival(prev: RankedPunchEntry[], next: RankedPunchEntry[]) {
  const before = new Map(prev.map((row) => [personKey(row.name, row.gender), row]));
  let best: RankedPunchEntry | null = null;
  for (const row of next) {
    const old = before.get(personKey(row.name, row.gender));
    const isNew = !old;
    const climbed = Boolean(old && (row.score > old.score || row.rank < old.rank));
    if (!isNew && !climbed) continue;
    if (!best || row.rank < best.rank) best = row;
  }
  return best;
}

function formatScore(n: number) {
  return n.toLocaleString("en-US");
}

function rankLabel(n: number) {
  return `第${n}名`;
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

function boardSlots(rows: RankedPunchEntry[]) {
  const visible = uniqueByPerson(rows)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.updatedAt.localeCompare(b.updatedAt);
    })
    .slice(0, BOARD_SLOTS);
  return Array.from({ length: BOARD_SLOTS }, (_, index) => visible[index] ?? null);
}

function punchArt(file: string) {
  return withBasePath(`/images/punchboard/${file}`);
}

function PunchArt({
  file,
  className,
}: {
  file: string;
  className?: string;
}) {
  return (
    <img
      src={punchArt(file)}
      alt=""
      aria-hidden
      className={className}
      style={{ imageRendering: "pixelated" }}
    />
  );
}

function punchSub(entry: RankedPunchEntry) {
  const school = punchSchoolDisplay(entry);
  const dept = entry.department.trim();
  return dept ? `${school} · ${dept}` : school;
}

function PixelPanel({
  tone,
  className,
  children,
}: {
  tone: "gold" | "cyan";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn("relative flex h-full min-h-0 flex-col px-4 pb-4 pt-8", className)}
      style={{
        border: "16px solid transparent",
        borderImageSource: `url(${punchArt(tone === "gold" ? "panel-gold.svg" : "panel-cyan.svg")})`,
        borderImageSlice: "22 fill",
        borderImageRepeat: "stretch",
        backgroundColor: "#061535",
      }}
    >
      {children}
    </section>
  );
}

function AwardPodium({
  slots,
  risingId,
  arcade,
  seeking,
  hitIds,
  onSelect,
}: {
  slots: Array<RankedPunchEntry | null>;
  risingId?: string;
  arcade: string;
  seeking: boolean;
  hitIds: Set<string>;
  onSelect: (entry: RankedPunchEntry) => void;
}) {
  const places = [
    { place: 2 as const, entry: slots[1] ?? null },
    { place: 1 as const, entry: slots[0] ?? null },
    { place: 3 as const, entry: slots[2] ?? null },
  ];
  return (
    <div className="relative z-1 grid grid-cols-[1fr_1.1fr_1fr] items-end gap-1.5 sm:gap-2">
      {places.map(({ place, entry }) => (
        <PodiumPlace
          key={place}
          place={place}
          entry={entry}
          arcade={arcade}
          rising={entry?.id === risingId}
          hit={Boolean(entry && seeking && hitIds.has(entry.id))}
          dim={Boolean(entry && seeking && !hitIds.has(entry.id))}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function PodiumPlace({
  place,
  entry,
  arcade,
  rising,
  hit,
  dim,
  onSelect,
}: {
  place: 1 | 2 | 3;
  entry: RankedPunchEntry | null;
  arcade: string;
  rising?: boolean;
  hit?: boolean;
  dim?: boolean;
  onSelect: (entry: RankedPunchEntry) => void;
}) {
  const look =
    place === 1
      ? {
          art: "podium-gold.svg",
          name: "[font-size:clamp(12px,12cqi,20px)]",
          school: "text-[13px] sm:text-[14px]",
          score: "text-[18px] sm:text-[20px]",
        }
      : {
          art: place === 2 ? "podium-silver.svg" : "podium-bronze.svg",
          name: "[font-size:clamp(11px,11cqi,17px)]",
          school: "text-[12px] sm:text-[13px]",
          score: "text-[16px]",
        };
  const body = (
    <div className="flex w-full min-w-0 flex-col items-center [container-type:inline-size]">
      <PrizeMark place={place} />
      <p className={cn("w-full px-0.5 text-center leading-none whitespace-nowrap text-white", look.name)}>
        {entry ? entry.name : "尚未有紀錄"}
      </p>
      <p className={cn("mb-2 h-5 w-full truncate px-1 text-center leading-tight text-white/55", look.school)}>
        {entry ? punchSub(entry) : "—"}
      </p>
      <div className={cn("relative mx-auto w-[74%]", place === 1 && "w-[82%] punch-glow-gold")}>
        <PunchArt file={look.art} className="block h-auto w-full" />
        <span
          className={cn(
            "absolute inset-x-0 bottom-[14%] text-center font-semibold leading-none text-[#10203a]",
            look.score,
          )}
        >
          {entry ? formatScore(entry.score) : "—"}
        </span>
      </div>
    </div>
  );
  const wrapClass = cn(
    "min-w-0",
    rising && "punch-row-in",
    hit && "punch-hit",
    dim && "punch-dim",
  );
  if (!entry) {
    return <div className={wrapClass}>{body}</div>;
  }
  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className={cn(wrapClass, "cursor-pointer hover:brightness-110")}
    >
      {body}
    </button>
  );
}

function PrizeMark({ place }: { place: 1 | 2 | 3 }) {
  const delay = place === 1 ? "0s" : place === 2 ? "1.8s" : "3.4s";
  return (
    <span className="punch-prize mb-1" style={{ animationDelay: delay }}>
      {place === 1 ? (
        <PunchArt file="trophy.svg" className="h-9 w-auto sm:h-11" />
      ) : (
        <PixelMedal tone={place === 2 ? "silver" : "bronze"} />
      )}
      <PunchArt file="spark-yellow.svg" className="punch-prize-spark" />
    </span>
  );
}

function PixelMedal({ tone }: { tone: "silver" | "bronze" }) {
  const fill = tone === "silver" ? "#d5dee8" : "#e0863a";
  const rim = tone === "silver" ? "#8b9db4" : "#a4531c";
  const hi = tone === "silver" ? "#ffffff" : "#ffd7a3";
  const ribbonL = tone === "silver" ? "#4f7aae" : "#d13c24";
  const ribbonR = tone === "silver" ? "#355781" : "#8e2414";
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-8 w-8 sm:h-9 sm:w-9"
      aria-hidden
      shapeRendering="crispEdges"
    >
      <rect x="4" y="0" width="2" height="5" fill={ribbonL} />
      <rect x="10" y="0" width="2" height="5" fill={ribbonR} />
      <rect x="4" y="4" width="4" height="2" fill={ribbonL} />
      <rect x="8" y="4" width="4" height="2" fill={ribbonR} />
      <rect x="5" y="6" width="6" height="1" fill={rim} />
      <rect x="4" y="7" width="8" height="1" fill={rim} />
      <rect x="3" y="8" width="10" height="5" fill={rim} />
      <rect x="4" y="13" width="8" height="1" fill={rim} />
      <rect x="5" y="14" width="6" height="1" fill={rim} />
      <rect x="5" y="7" width="6" height="6" fill={fill} />
      <rect x="4" y="8" width="8" height="4" fill={fill} />
      <rect x="5" y="8" width="2" height="2" fill={hi} />
    </svg>
  );
}

function GenderList({
  className,
  label,
  tone,
  rows,
  risingId,
  arcade,
  seeking,
  hitIds,
  onSelect,
}: {
  className?: string;
  label: string;
  tone: "gold" | "cyan";
  rows: RankedPunchEntry[];
  risingId?: string;
  arcade: string;
  seeking: boolean;
  hitIds: Set<string>;
  onSelect: (entry: RankedPunchEntry) => void;
}) {
  const slots = boardSlots(rows);
  const rest = slots.slice(3);
  return (
    <PixelPanel tone={tone} className={className}>
      <div className="punch-tag">
        <PunchArt
          file={tone === "gold" ? "tag-gold.svg" : "tag-cyan.svg"}
          className="absolute inset-0 h-full w-full"
        />
        <h2 className="relative z-1 flex h-full items-center justify-center text-[18px] leading-none text-[#10203a]">
          {label}
        </h2>
      </div>
      <div className="punch-stage">
        <span className="punch-spot punch-spot--left" />
        <span className="punch-spot punch-spot--right" />
        <PunchArt
          file={tone === "gold" ? "spark-yellow.svg" : "spark-cyan.svg"}
          className="pointer-events-none absolute right-3 top-1 h-6 w-6"
        />
        <AwardPodium
          slots={slots}
          risingId={risingId}
          arcade={arcade}
          seeking={seeking}
          hitIds={hitIds}
          onSelect={onSelect}
        />
      </div>
      <ol className="mt-2 flex-1">
        {rest.map((row, index) => (
          <li key={row?.id ?? `empty-${index + 3}`}>
            {row ? (
              <RankRow
                entry={row}
                rank={index + 4}
                tone={tone}
                arcade={arcade}
                rising={row.id === risingId}
                hit={seeking && hitIds.has(row.id)}
                dim={seeking && !hitIds.has(row.id)}
                onSelect={onSelect}
              />
            ) : (
              <EmptyRow rank={index + 4} tone={tone} arcade={arcade} />
            )}
          </li>
        ))}
      </ol>
    </PixelPanel>
  );
}

function EmptyRow({
  rank,
  tone,
  arcade,
}: {
  rank: number;
  tone: "gold" | "cyan";
  arcade: string;
}) {
  return (
    <div className={cn("punch-hud-row text-white/35", tone === "gold" && "punch-hud-row--gold")}>
      <span className={cn(arcade, "text-center text-[10px] leading-none")}>{rank}</span>
      <p className="truncate text-[15px]">尚未有紀錄</p>
      <span className="truncate text-[13px]">—</span>
      <span className={cn(arcade, "text-right text-[10px]")}>—</span>
    </div>
  );
}

function RankRow({
  entry,
  rank,
  tone,
  arcade,
  rising,
  hit,
  dim,
  onSelect,
}: {
  entry: RankedPunchEntry;
  rank: number;
  tone: "gold" | "cyan";
  arcade: string;
  rising?: boolean;
  hit?: boolean;
  dim?: boolean;
  onSelect: (entry: RankedPunchEntry) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className={cn(
        "punch-hud-row w-full cursor-pointer text-left hover:bg-white/5",
        tone === "gold" && "punch-hud-row--gold",
        rising && "punch-row-in",
        hit && "punch-hit",
        dim && "punch-dim",
      )}
    >
      <span className={cn(arcade, "text-center text-[10px] leading-none text-[#ffd54a]")}>{rank}</span>
      <p className="whitespace-nowrap text-[16px] leading-tight text-white">{entry.name}</p>
      <p className="truncate text-[13px] leading-tight text-white/50">{punchSchoolDisplay(entry)}</p>
      <span className={cn(arcade, "text-right text-[11px] leading-none text-white")}>
        {formatScore(entry.score)}
      </span>
    </button>
  );
}

function TeamBattle({
  male,
  female,
  arcade,
}: {
  male: RankedPunchEntry[];
  female: RankedPunchEntry[];
  arcade: string;
}) {
  const [left, right] = useSchoolSides(
    {
      label: "清華大學",
      male: schoolTotal(male, "NTHU"),
      female: schoolTotal(female, "NTHU"),
      tone: "nthu" as const,
    },
    {
      label: "交通大學",
      male: schoolTotal(male, "NYCU"),
      female: schoolTotal(female, "NYCU"),
      tone: "nycu" as const,
    },
  );
  return <PunchBattleHud arcade={arcade} left={left} right={right} />;
}

export function Punchboard({ headingLevel = "h1" }: { headingLevel?: "h1" | "h2" }) {
  const [board, setBoard] = useState<PunchboardPayload>(emptyPunchboard);
  const [query, setQuery] = useState("");
  const [school, setSchool] = useState<PunchSchool | null>(null);
  const [tab, setTab] = useState<PunchGender>("male");
  const [arrival, setArrival] = useState<RankedPunchEntry | null>(null);
  const [diploma, setDiploma] = useState<RankedPunchEntry | null>(null);
  const seenRef = useRef(false);
  const prevRef = useRef<{ male: RankedPunchEntry[]; female: RankedPunchEntry[] }>({
    male: [],
    female: [],
  });
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
        const male = topTen(next.male);
        const female = topTen(next.female);
        let incoming: RankedPunchEntry | null = null;
        if (seenRef.current) {
          incoming =
            findArrival(prevRef.current.male, male) ??
            findArrival(prevRef.current.female, female);
          if (incoming) setArrival(incoming);
        }
        seenRef.current = true;
        prevRef.current = { male, female };
        if (incoming) setTab(incoming.gender);
        setBoard({ ...next, male, female });
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

  const seeking = query.trim().length > 0 || school !== null;
  const hitIds = useMemo(() => {
    const ids = new Set<string>();
    if (!seeking) return ids;
    for (const row of [...board.male, ...board.female]) {
      if (school && row.school !== school) continue;
      if (!matchesQuery(row, query)) continue;
      ids.add(row.id);
    }
    return ids;
  }, [board.female, board.male, query, school, seeking]);
  const arcade = pressStart.className;

  return (
    <>
    <ArcadeCabinet
      keepOrder
      className="max-w-[390px] sm:max-w-[420px] md:max-w-[736px] lg:max-w-[1240px]"
      innerClassName={cn(fusionPixel.className, "px-4 pb-8 pt-4 lg:px-8")}
    >
        <div
          className="pointer-events-none absolute inset-3 z-0"
          style={{
            backgroundImage: `url(${punchArt("background-grid.svg")})`,
            backgroundSize: "cover",
            imageRendering: "pixelated",
            opacity: 0.35,
          }}
        />
        <div className="relative z-[1]">
        <div className="relative mb-2 flex items-center justify-center">
          <PunchBrandLockup />
        </div>
        {arrival ? (
          <ArrivalBurst
            entry={arrival}
            arcade={arcade}
            onDone={() => setArrival(null)}
          />
        ) : null}

        <div className="relative mt-2">
          <Heading className="sr-only">詐騙來電，Whoscall 開扁</Heading>
          <img
            src={withBasePath("/images/punchboard/event-banner.png")}
            alt="詐騙來電，Whoscall 開扁"
            className="relative z-1 mx-auto block h-auto w-full"
          />
          <div className="relative z-1 mt-2 flex flex-wrap items-center justify-center gap-2 text-[14px] text-white/75">
            <span className={cn(arcade, "text-[8px] leading-none text-[#ffd54a] sm:text-[10px]")}>
              HIGH SCORE
            </span>
            <span>11/17</span>
            <span>{countdown.clock}</span>
            <span
              className={cn(
                arcade,
                "inline-flex items-center border-2 border-[#19e36a] bg-[#07331a] px-2 py-0.5 text-[8px] text-[#19e36a]",
              )}
            >
              {countdown.phase === "ended" ? "FINAL" : "LIVE"}
            </span>
          </div>
        </div>

        <div className="relative z-4 mt-5 grid grid-cols-2 gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setTab("male")}
            className={cn(
              "min-h-12 cursor-pointer border-4 px-2 text-[16px]",
              tab === "male"
                ? "border-[#c9a000] bg-[#ffd54a] text-[#071028]"
                : "border-[#8a7000] bg-[#071028] text-[#ffd54a]",
            )}
          >
            男生組
          </button>
          <button
            type="button"
            onClick={() => setTab("female")}
            className={cn(
              "min-h-12 cursor-pointer border-4 px-2 text-[16px]",
              tab === "female"
                ? "border-[#148f88] bg-[#22e0f0] text-[#071028]"
                : "border-[#1a6a72] bg-[#071028] text-[#9ad4ff]",
            )}
          >
            女生組
          </button>
        </div>

        <div className="relative z-1 mx-auto mt-4 flex w-full max-w-[360px] flex-col items-center gap-2">
          <div className="flex w-[min(100%,280px)] items-stretch border-4 border-[#15DCE8] bg-[#07132D] focus-within:border-[#ffd54a]">
            <span
              className={cn(
                arcade,
                "flex shrink-0 items-center bg-[#15DCE8] px-2 text-[8px] leading-none text-[#071028]",
              )}
              aria-hidden
            >
              FIND
            </span>
            <label className="sr-only" htmlFor="punch-search">
              查詢姓名／學校／系所
            </label>
            <input
              id="punch-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="姓名／學校／系所"
              className="min-w-0 flex-1 bg-transparent px-2 py-2 text-[14px] leading-none text-white outline-none placeholder:text-[#A8BEDD]"
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {SCHOOL_TAGS.map((tag) => {
              const on = school === tag.id;
              return (
                <button
                  key={tag.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSchool(on ? null : tag.id)}
                  className={cn(
                    "min-h-8 cursor-pointer border-4 px-3 text-[14px] leading-none",
                    on
                      ? "border-[#c9a000] bg-[#ffd54a] text-[#071028]"
                      : "border-[#15DCE8] bg-[#07132D] text-[#A8BEDD]",
                  )}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mt-8 grid items-stretch gap-8 lg:grid-cols-2 lg:gap-4">
          <GenderList
            className={tab === "male" ? "flex" : "hidden lg:flex"}
            label="男生組"
            tone="gold"
            rows={board.male}
            risingId={arrival?.id}
            arcade={arcade}
            seeking={seeking}
            hitIds={hitIds}
            onSelect={setDiploma}
          />
          <GenderList
            className={tab === "female" ? "flex" : "hidden lg:flex"}
            label="女生組"
            tone="cyan"
            rows={board.female}
            risingId={arrival?.id}
            arcade={arcade}
            seeking={seeking}
            hitIds={hitIds}
            onSelect={setDiploma}
          />
        </div>

        <TeamBattle male={board.male} female={board.female} arcade={arcade} />

        {board.ready ? null : (
          <p className="mt-3 text-center font-mono-ui text-[11px] tracking-widest text-[#5ef0ea]">
            連線中
          </p>
        )}
        </div>
    </ArcadeCabinet>
    {diploma ? (
      <ScoreDiploma
        entry={diploma}
        arcade={arcade}
        fusion={fusionPixel.className}
        onClose={() => setDiploma(null)}
      />
    ) : null}
    </>
  );
}

function ScoreDiploma({
  entry,
  arcade,
  fusion,
  onClose,
}: {
  entry: RankedPunchEntry;
  arcade: string;
  fusion: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  const ribbon =
    entry.rank === 1 ? "冠軍" : entry.rank === 2 ? "亞軍" : entry.rank === 3 ? "季軍" : "";
  const male = entry.gender === "male";
  const schoolLine = entry.department.trim()
    ? `${punchSchoolDisplay(entry)} | ${entry.department.trim()}`
    : punchSchoolDisplay(entry);
  return (
    <div
      className={cn(
        fusion,
        "fixed inset-0 z-[200] flex items-center justify-center bg-black/92 p-3",
      )}
      role="dialog"
      aria-modal="true"
      aria-label={`${entry.name}的獎狀`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[min(480px,94vw)]"
        onClick={(event) => event.stopPropagation()}
        style={{ WebkitFontSmoothing: "none" }}
      >
        <div className="relative">
          <img
            src={withBasePath("/images/activities/punch-diploma-bg.png")}
            alt=""
            className="block h-auto w-full"
          />
          <div className="absolute inset-0 text-white">
            <DiplomaField
              className={cn(arcade, "text-[clamp(40px,9.2vw,68px)] leading-none tracking-tight")}
              top="26.6%"
              height="15.2%"
              left="18%"
              right="18%"
            >
              <span className="punch-diploma-score">{formatScore(entry.score)}</span>
            </DiplomaField>
            <DiplomaField
              className={cn(
                arcade,
                "punch-diploma-rank text-[clamp(22px,5.4vw,36px)] leading-none",
              )}
              top="52.2%"
              height="5.6%"
              left="36%"
              right="36%"
            >
              #{entry.rank}
            </DiplomaField>
            {ribbon ? (
              <DiplomaField
                className="text-[13px] leading-none text-[#3a2200] sm:text-[15px]"
                top="59.3%"
                height="4.6%"
                left="36%"
                right="36%"
              >
                {ribbon}
              </DiplomaField>
            ) : null}
            <DiplomaField
              className="px-1 text-center text-[15px] leading-none sm:text-[17px]"
              top="67.7%"
              height="3.5%"
              left="32%"
              right="10%"
            >
              <span className="max-w-full break-words">{entry.name}</span>
            </DiplomaField>
            <DiplomaField
              className="px-1 text-center text-[13px] leading-none sm:text-[15px]"
              top="74.5%"
              height="3.2%"
              left="32%"
              right="10%"
            >
              <span className="max-w-full truncate">{schoolLine}</span>
            </DiplomaField>
            <DiplomaField
              className="text-[15px] leading-none sm:text-[17px]"
              top="81.4%"
              height="5.0%"
              left="45.5%"
              right="32%"
              style={{ color: "#1a1400" }}
            >
              {male ? "男生組" : "女生組"}
            </DiplomaField>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mx-auto mt-4 block cursor-pointer border-4 border-white/40 bg-black px-4 py-2 text-[14px] text-white"
        >
          關閉
        </button>
      </div>
    </div>
  );
}

function DiplomaField({
  top,
  height,
  left,
  right,
  className,
  style,
  children,
}: {
  top: string;
  height: string;
  left: string;
  right: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("absolute flex items-center justify-center overflow-visible", className)}
      style={{ top, height, left, right, ...style }}
    >
      {children}
    </div>
  );
}

function ArrivalBurst({
  entry,
  arcade,
  onDone,
}: {
  entry: RankedPunchEntry;
  arcade: string;
  onDone: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 2600);
    return () => window.clearTimeout(timer);
  }, [entry.id, entry.score, onDone]);
  const pixels = Array.from({ length: 18 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div className="punch-flash absolute inset-0 bg-[#ffd54a]" />
      {pixels.map((i) => (
        <span
          key={i}
          className="punch-pixel-up"
          style={{
            left: `${5 + ((i * 13) % 90)}%`,
            animationDelay: `${i * 55}ms`,
            background: i % 3 === 0 ? "#ff4f9a" : i % 2 === 0 ? "#ffd54a" : "#2ee0d6",
          }}
        />
      ))}
      <div className="punch-challenger-up absolute inset-x-0 bottom-0 flex justify-center px-4">
        <div className="border-4 border-[#ffd54a] bg-[#07133f] px-5 py-4 text-center shadow-[8px_8px_0_#8a6a00]">
          <p className={cn(arcade, "text-[10px] leading-relaxed text-[#ffd54a]")}>
            ▲ 上榜 ▲
          </p>
          <div className="mx-auto mt-3 grid w-8 grid-cols-4 gap-px" aria-hidden>
            {[
              0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0,
            ].map((on, i) => (
              <span
                key={i}
                className={cn("size-2", on ? "bg-[#ffd54a]" : "bg-transparent")}
              />
            ))}
          </div>
          <p className="mt-3 text-[18px] leading-tight">{entry.name}</p>
          <p className="mt-2 text-[14px] text-white">
            {rankLabel(entry.rank)}　
            <span className={arcade}>{formatScore(entry.score)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

