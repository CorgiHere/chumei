"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteFlags } from "@/components/SiteFlags";
import { appPath, cn, withBasePath } from "@/lib/utils";

function onRankPage(pathname: string) {
  const p = pathname.replace(/\/$/, "");
  return p === "/punchboard" || p.startsWith("/punchboard/");
}

export function OpenFlatFloat() {
  const pathname = usePathname();
  const { ready, joinFab } = useSiteFlags();
  if (onRankPage(pathname)) return null;
  const lift = !ready || joinFab;

  return (
    <Link
      href={appPath("/punchboard")}
      aria-label="前往排行榜：詐騙來電，Whoscall 開扁"
      className={cn(
        "openflat-float fixed right-3 z-62 no-underline sm:right-4",
        lift
          ? "bottom-[max(7.5rem,calc(env(safe-area-inset-bottom)+6.5rem))]"
          : "bottom-[max(1rem,env(safe-area-inset-bottom))]",
      )}
    >
      <img
        src={withBasePath("/images/punchboard/openflat-float.png")}
        alt=""
      />
    </Link>
  );
}
