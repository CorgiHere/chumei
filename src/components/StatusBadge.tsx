import type { ActivityStatus } from "@/types";
import { getStatusLabel, cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: ActivityStatus;
  showFun?: boolean;
  className?: string;
};

const statusColors: Partial<Record<ActivityStatus, string>> = {
  registration_open: "bg-brand-yellow text-ink border-brand-yellow",
  registration_closing: "bg-brand-yellow text-ink border-brand-yellow",
  finished: "border-white/30 text-chalk bg-transparent",
  upcoming: "border-white/30 text-chalk bg-transparent",
  ongoing: "bg-brand-yellow text-ink border-brand-yellow",
  postponed: "bg-brand-yellow text-ink border-brand-yellow",
  cancelled: "bg-danger text-chalk border-danger",
  announced: "border-white/20 text-muted bg-transparent",
  waitlist: "border-white/20 text-muted bg-transparent",
  full: "bg-dark-gray text-chalk border-muted",
};

export function StatusBadge({
  status,
  showFun = true,
  className,
}: StatusBadgeProps) {
  const label = getStatusLabel(status);
  const colorClass =
    statusColors[status] ?? "border-white/20 text-chalk bg-transparent";

  return (
    <span
      className={cn(
        "inline-flex flex-col items-start border px-2.5 py-0.5 font-mono-ui text-[11px] font-semibold tracking-widest leading-tight",
        colorClass,
        className,
      )}
    >
      {showFun && label.fun && (
        <span className="opacity-90">[{label.fun}]</span>
      )}
      <span>{label.formal}</span>
    </span>
  );
}
