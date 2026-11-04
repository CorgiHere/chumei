import { siteConfig } from "@/data/site";
import { cn, withBasePath } from "@/lib/utils";

export function WhoscallMark({ className }: { className?: string }) {
  return (
    <img
      src={withBasePath("/images/partners/whoscall-app-icon.webp")}
      alt=""
      width={128}
      height={128}
      decoding="async"
      className={cn("rounded-[18%]", className)}
    />
  );
}

const downloadHref = {
  href: siteConfig.whoscallDownloadUrl,
  target: "_blank" as const,
  rel: "noopener noreferrer",
};

export function DownloadWhoscall({
  variant,
  className,
}: {
  variant: "pill" | "banner" | "fab";
  className?: string;
}) {
  if (variant === "fab") {
    return (
      <a
        {...downloadHref}
        aria-label="下載 Whoscall"
        className={cn(
          "fixed right-4 z-61 flex flex-col items-center gap-1 no-underline lg:hidden",
          "bottom-[max(5.75rem,calc(env(safe-area-inset-bottom)+4.75rem))]",
          className,
        )}
      >
        <WhoscallMark className="h-12 w-12" />
        <span className="text-[11px] leading-none text-[#7dff9a]">下載</span>
      </a>
    );
  }
  if (variant === "banner") {
    return (
      <a
        {...downloadHref}
        className={cn("punch-dl-banner", className)}
        aria-label="下載 Whoscall"
      >
        <img
          src={withBasePath("/images/punchboard/download-sky.webp")}
          alt=""
          width={1018}
          height={113}
          decoding="async"
          loading="lazy"
          className="punch-dl-banner__sky"
        />
        <span className="punch-dl-banner__mark">
          <WhoscallMark className="h-10 w-10 sm:h-11 sm:w-11" />
        </span>
        <span className="punch-dl-banner__copy">
          開扁詐騙來電前，先把
          <span className="punch-dl-banner__name">Whoscall</span>
          裝好。
        </span>
        <span className="punch-dl-banner__btn">
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
            <path
              fill="currentColor"
              d="M7 1h2v8h3L8 14 4 9h3V1zm-5 13h12v2H2v-2z"
            />
          </svg>
          下載
        </span>
      </a>
    );
  }
  return (
    <a {...downloadHref} className={cn("punch-dl-cta mx-auto", className)}>
      <span className="punch-dl-cta__mark">
        <WhoscallMark className="h-9 w-9" />
      </span>
      <span className="punch-dl-cta__label">
        下載 <span>Whoscall</span>
      </span>
      <span className="punch-dl-cta__arrow" aria-hidden>
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M11 2h2v11h4l-5 8-5-8h4V2zm-7 19h14v2H4v-2z"
          />
        </svg>
      </span>
    </a>
  );
}

export function PunchBrandLockup() {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      <img
        src={withBasePath("/images/partners/whoscall-logo-green.webp")}
        alt="Whoscall"
        width={243}
        height={56}
        decoding="async"
        className="h-11 w-auto sm:h-14"
      />
      <span className="text-xl text-white/70 sm:text-3xl">×</span>
      <img
        src={withBasePath("/images/brand/chumei-logo.webp")}
        alt="Chu Mei"
        width={64}
        height={64}
        decoding="async"
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
