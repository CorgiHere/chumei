import Link from "next/link";
import { siteConfig } from "@/data/site";
import { activities } from "@/data/activities";
import { cn } from "@/lib/utils";

type ScoreboardProps = {
  compact?: boolean;
  className?: string;
  showBreakdown?: boolean;
};

const SHORT_LABELS: Record<string, string> = {
  "dinosaur-race": "恐龍",
  "alcohol-calculus": "酒精",
  "office-chair-racing": "辦公椅",
  "japanese-mahjong": "日麻",
  "taiwan-mahjong": "台麻",
  "barcode-racing": "條碼",
  "two-school-rps": "憑拳",
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

  const nthuPad = String(siteConfig.nthuScore).padStart(2, "0");
  const nycuPad = String(siteConfig.nycuScore).padStart(2, "0");
  const total = siteConfig.nthuScore + siteConfig.nycuScore || 1;
  const nthuPct = Math.round((siteConfig.nthuScore / total) * 100);
  const nycuPct = 100 - nthuPct;

  if (showBreakdown) {
    return (
      <div className={cn("text-white", className)}>
        <p className="mb-6 text-center text-sm font-bold uppercase tracking-[0.2em] text-brand-yellow">
          總錦標
        </p>
        <div className="grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <div className="text-center md:text-left">
            <p className="mb-2 inline-block rounded-pill bg-nthu px-3 py-1 text-sm font-bold">
              清華
            </p>
            <p className="display-title text-display-score font-black">
              {nthuPad}
            </p>
            <div className="mx-auto mt-4 h-3 max-w-xs overflow-hidden rounded-pill bg-white/10 md:mx-0">
              <div
                className="h-full bg-nthu"
                style={{ width: `${nthuPct}%` }}
              />
            </div>
          </div>
          <p className="text-center text-5xl font-black text-brand-yellow md:pb-8">
            ：
          </p>
          <div className="text-center md:text-right">
            <p className="mb-2 inline-block rounded-pill bg-nycu px-3 py-1 text-sm font-bold">
              陽明交大
            </p>
            <p className="display-title text-display-score font-black">
              {nycuPad}
            </p>
            <div className="ml-auto mt-4 h-3 max-w-xs overflow-hidden rounded-pill bg-white/10">
              <div
                className="ml-auto h-full bg-nycu"
                style={{ width: `${nycuPct}%` }}
              />
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-lg font-bold md:text-xl">
          交大以一分之差拿下 2026 竹梅總錦標
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {scored.map((a) => {
            const winner = a.result?.winner;
            const color =
              winner === "NTHU"
                ? "border-nthu text-nthu bg-nthu/10"
                : winner === "NYCU"
                  ? "border-nycu text-[#7EB6FF] bg-nycu/20"
                  : "border-white/30 text-white/60";
            return (
              <span
                key={a.id}
                className={cn(
                  "rounded-pill border px-3 py-1.5 text-xs font-bold",
                  color,
                )}
              >
                {SHORT_LABELS[a.slug] ?? a.title}
                {winner === "NTHU" && " · 清華"}
                {winner === "NYCU" && " · 交大"}
              </span>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/scoreboard" className="btn-primary">
            查看七場完整結果 →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border-4 border-black bg-charcoal p-6 text-white",
        className,
      )}
    >
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-yellow">
        總錦標
      </p>
      <div
        className={cn(
          "flex items-center justify-center gap-4",
          compact ? "text-3xl" : "text-5xl md:text-6xl",
        )}
      >
        <div className="text-center">
          <p className="mb-1 rounded-full bg-nthu px-3 py-0.5 text-sm font-bold text-white">
            清華
          </p>
          <p className="display-title font-black">{siteConfig.nthuScore}</p>
        </div>
        <span className="text-brand-yellow">：</span>
        <div className="text-center">
          <p className="mb-1 rounded-full bg-nycu px-3 py-0.5 text-sm font-bold text-white">
            陽明交大
          </p>
          <p className="display-title font-black">{siteConfig.nycuScore}</p>
        </div>
      </div>
    </div>
  );
}
