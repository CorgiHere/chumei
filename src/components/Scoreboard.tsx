import { siteConfig } from "@/data/site";
import { activities } from "@/data/activities";
import { cn } from "@/lib/utils";

type ScoreboardProps = {
  compact?: boolean;
  className?: string;
};

export function Scoreboard({ compact = false, className }: ScoreboardProps) {
  const scoredActivities = activities.filter((a) => a.isScored);
  const nextScored = scoredActivities.find(
    (a) => a.status !== "finished" && a.status !== "cancelled",
  );

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border-4 border-black bg-[var(--color-charcoal)] p-6 text-white",
        className,
      )}
    >
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--color-brand-yellow)]">
        總錦標
      </p>
      <div
        className={cn(
          "flex items-center justify-center gap-4",
          compact ? "text-3xl" : "text-5xl md:text-6xl",
        )}
      >
        <div className="text-center">
          <p
            className="mb-1 rounded-full px-3 py-0.5 text-sm font-bold text-white"
            style={{ background: "var(--color-nthu)" }}
          >
            清華
          </p>
          <p className="display-title font-black">{siteConfig.nthuScore}</p>
        </div>
        <span className="text-[var(--color-brand-yellow)]">：</span>
        <div className="text-center">
          <p
            className="mb-1 rounded-full px-3 py-0.5 text-sm font-bold text-white"
            style={{ background: "var(--color-nycu)" }}
          >
            陽明交大
          </p>
          <p className="display-title font-black">{siteConfig.nycuScore}</p>
        </div>
      </div>
      {!compact && nextScored && (
        <p className="mt-4 text-center text-sm text-gray-300">
          下一個計分項目：
          <span className="font-bold text-white"> {nextScored.title}</span>
        </p>
      )}
    </div>
  );
}
