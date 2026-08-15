import Link from "next/link";
import { siteConfig } from "@/data/site";
import { activities } from "@/data/activities";
import { cn, formatDateOnly, appPath } from "@/lib/utils";

type ScoreboardProps = {
  compact?: boolean;
  className?: string;
  showBreakdown?: boolean;
};

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
      <div className={cn("border-2 border-brand-yellow bg-charcoal", className)}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3.5 bg-brand-yellow px-4 py-6 text-ink md:px-5">
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="display-title text-[clamp(19px,3.2vw,32px)] leading-tight text-nthu">
              清大
            </p>
            <p className="font-num text-[clamp(38px,7vw,68px)] leading-none font-bold">
              {siteConfig.nthuScore}
            </p>
          </div>
          <p className="font-num text-[15px] tracking-[0.16em] opacity-65">VS</p>
          <div className="flex min-w-0 flex-col items-end gap-0.5 text-right">
            <p className="display-title text-[clamp(19px,3.2vw,32px)] leading-tight text-nycu">
              交大
            </p>
            <p className="font-num text-[clamp(38px,7vw,68px)] leading-none font-bold">
              {siteConfig.nycuScore}
            </p>
            <span className="mt-1 bg-ink px-2 py-0.5 font-mono-ui text-[11px] tracking-[0.2em] text-brand-yellow">
              獲勝
            </span>
          </div>
        </div>
        <div className="py-1.5">
          {scored.map((a) => {
            const nthuWin = a.result?.winner === "NTHU";
            const nycuWin = a.result?.winner === "NYCU";
            return (
              <div
                key={a.id}
                className="grid grid-cols-[52px_1fr_52px] items-center gap-2.5 border-b border-white/15 px-3.5 py-3 last:border-b-0 md:grid-cols-[64px_1fr_64px] md:px-5"
              >
                <span
                  className={cn(
                    "py-0.5 text-center font-mono-ui text-[11px] tracking-widest",
                    nthuWin
                      ? "bg-nthu font-semibold text-white"
                      : "text-[#4A4842]",
                  )}
                >
                  {nthuWin ? "勝" : "—"}
                </span>
                <Link href={appPath(`/activities/${a.slug}`)} className="text-center no-underline">
                  <span className="block text-[15px] font-medium">{a.title}</span>
                  <small className="mt-0.5 block font-mono-ui text-[11px] tracking-[0.04em] text-muted">
                    {formatDateOnly(a.startAt)}
                  </small>
                </Link>
                <span
                  className={cn(
                    "py-0.5 text-center font-mono-ui text-[11px] tracking-widest",
                    nycuWin
                      ? "bg-nycu font-semibold text-white"
                      : "text-[#4A4842]",
                  )}
                >
                  {nycuWin ? "勝" : "—"}
                </span>
              </div>
            );
          })}
        </div>
        <p className="m-0 border-t border-white/15 px-5 py-3.5 font-mono-ui text-[11px] tracking-[0.06em] text-muted">
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
