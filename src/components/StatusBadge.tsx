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
  finished: "border-ink text-ink bg-transparent",
  upcoming: "border-ink text-ink bg-transparent",
  ongoing: "bg-brand-yellow text-ink border-brand-yellow",
  postponed: "bg-brand-yellow text-ink border-brand-yellow",
  cancelled: "bg-danger text-white border-danger",
  announced: "border-ink/30 text-ink bg-transparent",
  waitlist: "border-ink/30 text-ink bg-transparent",
  full: "bg-dark-gray text-chalk border-muted",
};

export function StatusBadge({
  status,
  showFun = true,
  className,
}: StatusBadgeProps) {
  const label = getStatusLabel(status);
  const colorClass =
    statusColors[status] ?? "bg-light-gray text-black border-black";

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
