import Link from "next/link";
import { siteConfig } from "@/data/site";
import { activities } from "@/data/activities";
import { cn, formatDateOnly, appPath } from "@/lib/utils";
import type { Activity } from "@/types";

type ScoreboardProps = {
  compact?: boolean;
  className?: string;
  showBreakdown?: boolean;
};

function WinMark({
  win,
  school,
}: {
  win: boolean;
  school: "nthu" | "nycu";
}) {
  return (
    <span
      className={cn(
        "inline-block min-w-10 py-1 text-center font-mono-ui text-sm font-black tracking-widest",
        win
          ? school === "nthu"
            ? "bg-nthu font-semibold text-white"
            : "bg-nycu font-semibold text-white"
          : "text-chalk/65",
      )}
    >
      {win ? (school === "nthu" ? "清" : "交") : "—"}
    </span>
  );
}

function EventCell({ activity }: { activity: Activity }) {
  return (
    <Link
      href={appPath(`/activities/${activity.slug}`)}
      className="text-center no-underline"
    >
      <span className="block text-base font-bold leading-snug text-chalk md:text-lg">
        {activity.title}
      </span>
      <small className="mt-1 block font-mono-ui text-[13px] tracking-[0.04em] text-chalk/75">
        {formatDateOnly(activity.startAt)}
      </small>
    </Link>
  );
}

export function Scoreboard({
  compact = false,
  className,
  showBreakdown = false,
}: ScoreboardProps) {
  const scored = activities
    .filter((a) => a.isScored)
    .sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
    );

  if (showBreakdown) {
    return (
      <div
        className={cn(
          "mx-auto w-full max-w-[28rem] border-2 border-brand-yellow bg-charcoal md:max-w-5xl",
          className,
        )}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 bg-brand-yellow px-4 py-5 text-ink md:px-6">
          <div className="flex min-w-0 items-center gap-5 md:gap-6">
            <p className="font-sans text-[clamp(28px,4vw,48px)] leading-none font-bold text-[#4A1460] [font-synthesis:weight] [-webkit-text-stroke:0.6px_currentColor]">
              清大
            </p>
            <p className="font-num text-[clamp(28px,4vw,48px)] leading-none font-bold">
              {siteConfig.nthuScore}
            </p>
          </div>
          <p className="font-num text-[15px] tracking-[0.16em] text-ink/70">
            VS
          </p>
          <div className="flex min-w-0 flex-col items-end gap-1">
            <div className="flex items-center gap-5 md:gap-6">
              <p className="font-num text-[clamp(28px,4vw,48px)] leading-none font-bold">
                {siteConfig.nycuScore}
              </p>
              <p className="font-sans text-[clamp(28px,4vw,48px)] leading-none font-bold text-nycu [font-synthesis:weight] [-webkit-text-stroke:0.6px_currentColor]">
                交大
              </p>
            </div>
            <span className="bg-ink px-2 py-0.5 font-mono-ui text-[11px] tracking-[0.2em] text-brand-yellow">
              獲勝
            </span>
          </div>
        </div>

        <div className="py-1.5 md:hidden">
          {scored.map((a) => (
            <div
              key={a.id}
              className="grid grid-cols-[48px_1fr_48px] items-center gap-2 border-b border-white/15 px-3 py-2.5 last:border-b-0"
            >
              <WinMark win={a.result?.winner === "NTHU"} school="nthu" />
              <EventCell activity={a} />
              <WinMark win={a.result?.winner === "NYCU"} school="nycu" />
            </div>
          ))}
        </div>

        <div
          className="hidden gap-x-3 gap-y-4 px-5 py-6 md:grid"
          style={{
            gridTemplateColumns: `repeat(${scored.length}, minmax(0, 1fr))`,
          }}
        >
          {scored.map((a) => (
            <div key={`${a.id}-nthu`} className="flex justify-center">
              <WinMark win={a.result?.winner === "NTHU"} school="nthu" />
            </div>
          ))}
          {scored.map((a) => (
            <EventCell key={`${a.id}-title`} activity={a} />
          ))}
          {scored.map((a) => (
            <div key={`${a.id}-nycu`} className="flex justify-center">
              <WinMark win={a.result?.winner === "NYCU"} school="nycu" />
            </div>
          ))}
        </div>

        <p className="m-0 border-t border-white/15 px-3 py-3 font-mono-ui text-[12px] tracking-[0.04em] text-chalk/75 md:px-5">
          日期與時間如有調整，以 @chumei2026 社群公告為準。
        </p>
      </div>
    );
  }

  return (
    <div className={cn("border-2 border-brand-yellow bg-charcoal p-6 text-chalk", className)}>
      <p className="mb-1 font-mono-ui text-xs tracking-[0.16em] text-brand-yellow">
        總錦標
      </p>
      <div
        className={cn(
          "flex items-center justify-center gap-6",
          compact ? "text-3xl" : "text-5xl md:text-6xl",
        )}
      >
        <div className="text-center">
          <p className="mb-1 font-mono-ui text-xs tracking-[0.12em] text-nthu">清大</p>
          <p className="font-num font-bold text-nthu">{siteConfig.nthuScore}</p>
        </div>
        <span className="font-num text-brand-yellow">:</span>
        <div className="text-center">
          <p className="mb-1 font-mono-ui text-xs tracking-[0.12em] text-nycu">交大</p>
          <p className="font-num font-bold text-nycu">{siteConfig.nycuScore}</p>
        </div>
      </div>
    </div>
  );
}
