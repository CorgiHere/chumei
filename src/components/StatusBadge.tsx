import type { ActivityStatus } from "@/types";
import { getStatusLabel, cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: ActivityStatus;
  showFun?: boolean;
  className?: string;
};

const statusColors: Partial<Record<ActivityStatus, string>> = {
  registration_open: "bg-brand-yellow text-black border-black",
  registration_closing:
    "bg-signal-lime text-black border-black hazard-stripe-animated bg-[length:48px_48px]",
  finished: "bg-ink text-white border-ink",
  upcoming: "bg-brand-blue text-white border-brand-blue",
  ongoing: "bg-brand-blue text-white border-brand-blue",
  postponed: "bg-brand-yellow text-black border-black",
  cancelled: "bg-danger text-white border-danger",
  announced: "bg-white text-black border-black",
  waitlist: "bg-white text-black border-black",
  full: "bg-dark-gray text-white border-dark-gray",
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
        "inline-flex flex-col items-start rounded-pill border-2 px-3 py-1 text-xs font-bold leading-tight",
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
