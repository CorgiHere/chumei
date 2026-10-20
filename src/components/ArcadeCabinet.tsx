import { cn } from "@/lib/utils";

export function ArcadeCabinet({
  children,
  className,
  innerClassName,
  keepOrder,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  keepOrder?: boolean;
}) {
  return (
    <div
      {...(keepOrder ? { "data-keep-order": true } : {})}
      className="relative bg-ink text-white"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 78% 88% at 50% 38%, rgba(12,32,92,0.78) 0%, rgba(7,19,63,0.28) 46%, #0a0a0a 74%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-8 left-0 hidden w-24 lg:block"
        style={{
          background: "linear-gradient(to right, #0a0a0a, rgba(7,19,63,0.35), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-8 right-0 hidden w-24 lg:block"
        style={{
          background: "linear-gradient(to left, #0a0a0a, rgba(7,19,63,0.35), transparent)",
        }}
      />
      <div className="relative mx-auto w-full lg:px-8 lg:py-8">
        <div
          className={cn(
            "relative mx-auto w-full overflow-hidden bg-[#07133f]",
            "lg:border-y-4 lg:border-[#12306e]",
            "lg:shadow-[12px_0_0_#050814,-12px_0_0_#050814,0_0_0_4px_#0d1a44,0_0_72px_rgba(46,224,214,0.1)]",
            className,
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 z-1 opacity-[0.16]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0,0,0,0.35) 2px, rgba(0,0,0,0.35) 4px)",
            }}
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-2 hidden h-1 bg-linear-to-r from-[#ffd54a] via-[#2ee0d6] to-[#ffd54a] lg:block" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-2 hidden h-1 bg-linear-to-r from-[#2ee0d6] via-[#ffd54a] to-[#2ee0d6] lg:block" />
          <span className="pointer-events-none absolute left-0 top-0 z-2 hidden size-3 bg-[#ffd54a] lg:block" />
          <span className="pointer-events-none absolute right-0 top-0 z-2 hidden size-3 bg-[#2ee0d6] lg:block" />
          <span className="pointer-events-none absolute bottom-0 left-0 z-2 hidden size-3 bg-[#2ee0d6] lg:block" />
          <span className="pointer-events-none absolute bottom-0 right-0 z-2 hidden size-3 bg-[#ffd54a] lg:block" />
          <div className={cn("relative z-3", innerClassName)}>{children}</div>
        </div>
      </div>
    </div>
  );
}
