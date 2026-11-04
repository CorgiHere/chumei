"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSiteFlags } from "@/components/SiteFlags";
import { appPath, cn, withBasePath } from "@/lib/utils";

export function OpenFlatFloat() {
  const pathname = usePathname();
  const { ready, joinFab } = useSiteFlags();
  if (pathname.includes("/activities/punchboard")) return null;
  const lift = !ready || joinFab;

  return (
    <Link
      href={appPath("/activities/punchboard")}
      aria-label="11/17 看活動：詐騙來電，Whoscall 開扁"
      className={cn(
        "fixed right-3 z-[62] flex w-[6.75rem] flex-col items-center no-underline sm:right-4 sm:w-[8.25rem]",
        lift
          ? "bottom-[max(6.75rem,calc(env(safe-area-inset-bottom)+5.75rem))]"
          : "bottom-[max(1rem,env(safe-area-inset-bottom))]",
      )}
    >
      <img
        src={withBasePath("/images/punchboard/event-title.png")}
        alt=""
        className="w-full drop-shadow-[0_6px_0_#050b18]"
      />
      <span className="mt-1 bg-brand-yellow px-1.5 py-0.5 text-center text-[12px] font-black leading-tight text-ink">
        11/17 看活動
      </span>
    </Link>
  );
}
