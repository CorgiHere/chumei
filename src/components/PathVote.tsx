"use client";

import { useEffect, useRef, useState } from "react";
import {
  clearStoredChoice,
  emptyCounts,
  getOrCreateVoterId,
  getVoteEndpoint,
  readStoredChoice,
  storeChoice,
  type PathChoice,
  type PathVoteCounts,
} from "@/lib/path-vote";
import { cn, withBasePath } from "@/lib/utils";
import { useSchoolOrder } from "./SchoolOrder";

const CARD_ART = {
  qingjiao: {
    src: "/images/path-vote/nthu-gate.avif",
    position: "18% 78%",
  },
  jiaoqing: {
    src: "/images/path-vote/nycu-tower.avif",
    position: "88% 72%",
  },
} as const;

const TICKER = [
  "一徑各表，沒有共識",
  "清交人限定投票",
  "即時票數公開",
  "隨時可改票",
];

const TICKER_LOOP = Array.from({ length: TICKER.length * 3 }, (_, i) => ({
  id: `ticker-${i}`,
  label: TICKER[i % TICKER.length],
}));

async function fetchCounts(): Promise<PathVoteCounts | null> {
  try {
    const res = await fetch(getVoteEndpoint(), { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<PathVoteCounts>;
    if (data.ready === false) return null;
    if (typeof data.qingjiao !== "number" || typeof data.jiaoqing !== "number") {
      return null;
    }
    return {
      qingjiao: data.qingjiao,
      jiaoqing: data.jiaoqing,
      ready: true,
    };
  } catch {
    return null;
  }
}

async function submitVote(choice: PathChoice): Promise<PathVoteCounts | null> {
  try {
    const res = await fetch(getVoteEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choice, voter: getOrCreateVoterId() }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<PathVoteCounts>;
    if (data.ready === false) return null;
    if (typeof data.qingjiao !== "number" || typeof data.jiaoqing !== "number") {
      return null;
    }
    return {
      qingjiao: data.qingjiao,
      jiaoqing: data.jiaoqing,
      ready: true,
    };
  } catch {
    return null;
  }
}

function formatVotes(n: number) {
  return n.toLocaleString("en-US");
}

export function PathVote({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const { setOrder } = useSchoolOrder();
  const [counts, setCounts] = useState<PathVoteCounts>(emptyCounts());
  const [choice, setChoice] = useState<PathChoice | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [voting, setVoting] = useState(false);
  const votingRef = useRef(false);

  useEffect(() => {
    const stored = readStoredChoice();
    setChoice(stored);
    if (stored) setOrder(stored);
    setHydrated(true);

    let cancelled = false;

    const refresh = async () => {
      if (votingRef.current || document.visibilityState === "hidden") return;
      const live = await fetchCounts();
      if (cancelled || votingRef.current || !live) return;
      setCounts(live);
    };

    refresh();
    const timer = window.setInterval(refresh, 2500);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [setOrder]);

  const total = counts.qingjiao + counts.jiaoqing;
  const qingShare = total === 0 ? 50 : (counts.qingjiao / total) * 100;
  const Heading = headingLevel;

  async function vote(next: PathChoice) {
    if (voting || !hydrated || choice === next) return;
    const previous = choice;
    votingRef.current = true;
    setVoting(true);
    storeChoice(next);
    setChoice(next);
    setOrder(next);
    setCounts((prev) => ({
      ...prev,
      ...(previous
        ? { [previous]: Math.max(0, prev[previous] - 1) }
        : {}),
      [next]: prev[next] + 1,
    }));

    const live = await submitVote(next);
    if (live) {
      setCounts(live);
    } else if (previous) {
      storeChoice(previous);
      setChoice(previous);
      setOrder(previous);
      const latest = await fetchCounts();
      if (latest) setCounts(latest);
    } else {
      clearStoredChoice();
      setChoice(null);
      const latest = await fetchCounts();
      if (latest) setCounts(latest);
    }
    votingRef.current = false;
    setVoting(false);
  }

  return (
    <div data-keep-order>
      <div className="container-main">
        <Heading className="display-title text-[clamp(28px,5vw,56px)] leading-[1.15]">
          一徑各表 <span className="mark">沒有共識</span>
        </Heading>
      </div>

      <div className="container-main mt-8 md:mt-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]">
          <ChoiceCard
            side="qingjiao"
            selected={choice === "qingjiao"}
            busy={!hydrated || voting}
            onVote={() => vote("qingjiao")}
          />
          <Versus />
          <ChoiceCard
            side="jiaoqing"
            selected={choice === "jiaoqing"}
            busy={!hydrated || voting}
            onVote={() => vote("jiaoqing")}
          />
        </div>

        <div className="mt-5 flex items-center gap-4 md:mt-6 md:gap-5">
          <p className="font-num w-8 shrink-0 text-center text-[clamp(24px,3.6vw,34px)] leading-none font-bold text-nthu md:w-10">
            {formatVotes(counts.qingjiao)}
            <span className="sr-only"> 清交票數</span>
          </p>
          <div
            className="relative flex h-3.5 min-w-0 flex-1 overflow-hidden rounded-[999px] border border-white md:h-4"
            role="img"
            aria-label={
              total === 0
                ? "尚無票數"
                : `清交 ${formatVotes(counts.qingjiao)} 票，交大 ${formatVotes(counts.jiaoqing)} 票`
            }
          >
            <span
              className="bg-nthu transition-[flex-grow] duration-500"
              style={{ flexGrow: Math.max(qingShare, 0.01) }}
            />
            <span
              aria-hidden
              className="relative z-10 w-0.5 shrink-0 bg-white"
            />
            <span
              className="bg-nycu transition-[flex-grow] duration-500"
              style={{ flexGrow: Math.max(100 - qingShare, 0.01) }}
            />
          </div>
          <p className="font-num w-8 shrink-0 text-center text-[clamp(24px,3.6vw,34px)] leading-none font-bold text-nycu md:w-10">
            {formatVotes(counts.jiaoqing)}
            <span className="sr-only"> 交大票數</span>
          </p>
        </div>
      </div>

      <div
        className="mt-6 overflow-hidden bg-brand-yellow text-ink md:mt-8"
        aria-hidden
      >
        <div className="ticker-track text-ink">
          {TICKER_LOOP.map((item) => (
            <span
              key={item.id}
              className="inline-flex items-center whitespace-nowrap"
            >
              <span className="px-5">✦</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Versus() {
  return (
    <div
      className="relative flex items-center justify-center py-3 md:w-12 md:py-0"
      aria-hidden
    >
      <span className="absolute inset-x-12 top-1/2 h-px bg-white/20 md:inset-x-auto md:inset-y-5 md:left-1/2 md:h-auto md:w-px" />
      <span className="relative bg-ink px-2.5 font-num text-[13px] font-bold tracking-[0.16em] text-brand-yellow">
        vs
      </span>
    </div>
  );
}

function ChoiceCard({
  side,
  selected,
  busy,
  onVote,
}: {
  side: PathChoice;
  selected: boolean;
  busy: boolean;
  onVote: () => void;
}) {
  const isQing = side === "qingjiao";
  const prefix = isQing ? "清交" : "交清";
  const art = CARD_ART[side];

  return (
    <button
      type="button"
      onClick={onVote}
      disabled={busy || selected}
      aria-pressed={selected}
      aria-label={selected ? `已投${prefix}小徑` : `投給${prefix}小徑`}
      className={cn(
        "relative isolate flex min-h-[176px] items-center justify-center overflow-hidden rounded-[20px] border px-8 py-12 text-white transition-colors md:min-h-[220px]",
        selected
          ? isQing
            ? "border-nthu bg-nthu"
            : "border-nycu bg-nycu"
          : "border-white/25 bg-[#161616] hover:border-white/40",
      )}
    >
      <img
        src={withBasePath(art.src)}
        alt=""
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full object-cover transition-[opacity,filter] duration-300",
          selected ? "opacity-70" : "opacity-40 grayscale",
        )}
        style={{ objectPosition: art.position }}
        loading="lazy"
        decoding="async"
      />
      <span className="display-title relative z-10 text-[clamp(28px,4vw,44px)] [font-synthesis:weight]">
        {prefix}小徑
      </span>
      {selected && (
        <span className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 rounded-[8px] bg-brand-yellow px-2.5 py-1.5 font-sans text-[12px] font-bold tracking-[0.04em] text-ink">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <path
              d="M1.8 6.2 4.6 9 10.2 3"
              stroke="currentColor"
              strokeWidth="1.8"
              fill="none"
            />
          </svg>
          已投
        </span>
      )}
    </button>
  );
}
