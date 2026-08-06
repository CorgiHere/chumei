import type { ActivityStatus } from "@/types";
import { getStatusLabel, cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: ActivityStatus;
  showFun?: boolean;
  className?: string;
};

const statusColors: Partial<Record<ActivityStatus, string>> = {
  registration_open: "bg-[var(--color-success)] text-white",
  registration_closing: "bg-[var(--color-warning)] text-black",
  finished: "bg-[var(--color-dark-gray)] text-white",
  upcoming: "bg-[var(--color-brand-blue)] text-white",
  cancelled: "bg-[var(--color-danger)] text-white",
  postponed: "bg-[var(--color-danger)] text-white",
};

export function StatusBadge({
  status,
  showFun = true,
  className,
}: StatusBadgeProps) {
  const label = getStatusLabel(status);
  const colorClass =
    statusColors[status] ?? "bg-[var(--color-light-gray)] text-black";

  return (
    <span
      className={cn(
        "inline-flex flex-col items-start rounded-full px-3 py-1 text-xs font-bold",
        colorClass,
        className,
      )}
    >
      {showFun && label.fun && (
        <span className="opacity-80">{label.fun}</span>
      )}
      <span>{label.formal}</span>
    </span>
  );
}
