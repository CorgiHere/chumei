import { siteConfig } from "@/data/site";
import { cn, withBasePath } from "@/lib/utils";

export function WhoscallMark({ className }: { className?: string }) {
  return (
    <img
      src={withBasePath("/images/partners/whoscall-logo-green.png")}
      alt=""
      className={className}
    />
  );
}

export function DownloadWhoscall({
  variant,
  className,
}: {
  variant: "logo" | "pill" | "banner" | "fab";
  className?: string;
}) {
  const href = siteConfig.whoscallDownloadUrl;
  if (variant === "logo") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("inline-flex shrink-0", className)}
        aria-label="下載 Whoscall"
      >
        <WhoscallMark className="h-11 w-auto sm:h-14" />
      </a>
    );
  }
  if (variant === "fab") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "fixed right-4 z-[61] flex size-[4.5rem] flex-col items-center justify-center rounded-full bg-[#12b24a] text-center text-[11px] leading-tight text-white no-underline shadow-[0_4px_0_#0a7a32] lg:hidden",
          "bottom-[max(5.75rem,calc(env(safe-area-inset-bottom)+4.75rem))]",
          className,
        )}
      >
        <WhoscallMark className="mb-0.5 h-7 w-auto" />
        下載
        <br />
        Whoscall
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2 bg-[#12b24a] font-semibold text-white no-underline hover:bg-[#15c652]",
        variant === "banner"
          ? "w-full min-h-11 px-4 py-2 text-[16px]"
          : "min-h-10 px-3 py-1.5 text-[14px]",
        className,
      )}
    >
      <WhoscallMark className="h-6 w-auto" />
      下載 Whoscall
    </a>
  );
}

export function PunchBrandLockup() {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      <DownloadWhoscall variant="logo" />
      <span className="text-xl text-white/70 sm:text-3xl">×</span>
      <img
        src={withBasePath("/images/brand/chumei-logo.png")}
        alt="Chu Mei"
        className="h-14 w-auto sm:h-16"
      />
    </div>
  );
}

export function PixelNubs({ tone = "cyan" }: { tone?: "cyan" | "gold" }) {
  return (
    <>
      <span className="punch-pixel-nub" data-tone={tone} data-pos="tl" />
      <span className="punch-pixel-nub" data-tone={tone} data-pos="tr" />
      <span className="punch-pixel-nub" data-tone={tone} data-pos="bl" />
      <span className="punch-pixel-nub" data-tone={tone} data-pos="br" />
    </>
  );
}

export function ArcadeCabinet({
  children,
  className,
  innerClassName,
  keepOrder,
  bare,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  keepOrder?: boolean;
  bare?: boolean;
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
      <div className="relative mx-auto w-full px-3 py-6 lg:px-12 lg:py-10">
        <div
          className={cn(
            "relative mx-auto w-full",
            !bare && "punch-pixel-frame punch-pixel-frame--outer",
            className,
          )}
          style={
            bare
              ? undefined
              : {
                  border: "32px solid transparent",
                  borderImageSource: `url(${withBasePath("/images/punchboard/outer-frame.svg")})`,
                  borderImageSlice: "48 fill",
                  borderImageRepeat: "stretch",
                  backgroundColor: "#061535",
                }
          }
        >
          {bare ? null : (
            <>
              <div className="punch-pixel-grid pointer-events-none absolute inset-8 z-1 opacity-70" />
              <div
                className="pointer-events-none absolute inset-8 z-1 opacity-[0.18]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)",
                }}
              />
            </>
          )}
          <div className={cn("relative z-3", innerClassName)}>{children}</div>
        </div>
      </div>
    </div>
  );
}
