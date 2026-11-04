import Link from "next/link";
import { getActivityBySlug } from "@/data/activities";
import { siteConfig } from "@/data/site";
import { appPath, withBasePath } from "@/lib/utils";

export function OpenFlatBand() {
  const activity = getActivityBySlug("punchboard");
  if (!activity) return null;

  return (
    <section
      id="openflat"
      className="scroll-mt-24 border-b border-white/15 bg-ink text-chalk"
      aria-labelledby="openflat-heading"
    >
      <div className="container-main grid items-center gap-8 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
        <div>
          <p className="font-mono-ui text-[11px] tracking-[0.14em] text-brand-yellow">
            11/17 · Whoscall 合作 · 報名中
          </p>
          <h2 id="openflat-heading" className="mt-3 text-3xl font-black md:text-4xl">
            {activity.title}
          </h2>
          <p className="mt-4 max-w-[40em] text-[15px] leading-relaxed text-muted">
            2026 竹梅賽與 Whoscall 合作，11 月 17 日在清大、交大辦現場拳擊機「詐騙來電，Whoscall
            開扁」。先填報名表領 ID，現場打榜；男生組／女生組即時排名在官網公開。
          </p>
          <ul className="mt-4 space-y-1 text-sm text-chalk">
            <li>日期：2026 年 11 月 17 日</li>
            <li>形式：個人賽拳擊機，全報名</li>
            <li>即時榜：chumei.org/punchboard</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={siteConfig.punchFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              立即報名
            </a>
            <Link href={appPath("/punchboard")} className="btn-dark-outline">
              看即時榜
            </Link>
            <Link href={appPath("/activities/punchboard")} className="text-link self-center">
              活動說明 →
            </Link>
          </div>
        </div>
        <Link href={appPath("/punchboard")} className="block no-underline">
          <img
            src={withBasePath("/images/punchboard/event-title.png")}
            alt="詐騙來電，Whoscall 開扁"
            className="mx-auto w-full max-w-lg"
          />
        </Link>
      </div>
    </section>
  );
}
