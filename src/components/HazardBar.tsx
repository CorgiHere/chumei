type HazardBarProps = {
  animated?: boolean;
  className?: string;
};

export function HazardBar({ animated = true, className = "" }: HazardBarProps) {
  return (
    <div
      className={`${animated ? "hazard-stripe-animated" : "hazard-stripe"} h-[14px] ${className}`}
      aria-hidden
    />
  );
}
