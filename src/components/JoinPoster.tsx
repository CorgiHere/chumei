import { cn } from "@/lib/utils";

type JoinPosterProps = {
  className?: string;
};

export function JoinPoster({ className }: JoinPosterProps) {
  return (
    <span
      className={cn(
        "flex flex-col overflow-hidden border-2 border-chalk bg-ink text-ink shadow-[5px_5px_0_0_#0a0a0a]",
        className,
      )}
    >
      <span className="hazard-stripe-animated block h-2.5" aria-hidden />
      <span className="flex bg-brand-yellow">
        <span className="flex flex-col justify-center px-4 py-2.5 pr-3.5">
          <span className="font-mono-ui text-[10px] font-bold tracking-[0.22em]">
            CAUTION · 2027
          </span>
          <span className="mt-0.5 text-[20px] leading-none font-black tracking-tight">
            加入竹梅
          </span>
        </span>
        <span
          aria-hidden
          className="flex w-11 items-center justify-center border-l-2 border-ink bg-ink font-mono-ui text-xl text-brand-yellow"
        >
          →
        </span>
      </span>
      <span className="hazard-stripe-animated block h-2.5" aria-hidden />
    </span>
  );
}
