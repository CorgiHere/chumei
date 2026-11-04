"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useSiteFlags } from "@/components/SiteFlags";
import { appPath, cn, withBasePath } from "@/lib/utils";

function onTargetPage(pathname: string) {
  const p = pathname.replace(/\/$/, "");
  return (
    p === "/punchboard" ||
    p.startsWith("/punchboard/") ||
    p === "/activities/punchboard"
  );
}

function nextShineDelay() {
  return 3800 + Math.random() * 7200;
}

export function OpenFlatFloat() {
  const pathname = usePathname();
  const { ready, joinFab } = useSiteFlags();
  const rootRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (onTargetPage(pathname)) return;
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer = 0;
    const sweep = () => {
      el.classList.remove("is-shining");
      void el.offsetWidth;
      el.classList.add("is-shining");
      timer = window.setTimeout(sweep, nextShineDelay());
    };
    timer = window.setTimeout(sweep, 900 + Math.random() * 1600);
    return () => {
      window.clearTimeout(timer);
      el.classList.remove("is-shining");
    };
  }, [pathname]);

  if (onTargetPage(pathname)) return null;
  const lift = !ready || joinFab;

  return (
    <Link
      ref={rootRef}
      href={appPath("/activities/punchboard")}
      aria-label="前往活動頁面：詐騙來電，Whoscall 開扁"
      className={cn(
        "openflat-float fixed right-3 z-62 no-underline sm:right-4",
        lift
          ? "bottom-[max(7.5rem,calc(env(safe-area-inset-bottom)+6.5rem))]"
          : "bottom-[max(1rem,env(safe-area-inset-bottom))]",
      )}
    >
      <img
        src={withBasePath("/images/punchboard/openflat-float.webp")}
        alt=""
        width={720}
        height={354}
        decoding="async"
        className="h-auto w-full"
      />
    </Link>
  );
}
