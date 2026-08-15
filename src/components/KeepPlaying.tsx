import Link from "next/link";
import { siteConfig } from "@/data/site";
import { appPath } from "@/lib/utils";

export function KeepPlaying() {
  return (
    <section className="section-space bg-charcoal">
      <div className="container-main">
        <p className="mb-2.5 font-mono-ui text-xs tracking-[0.2em] text-brand-yellow">01</p>
        <h2 className="section-title mb-3">
          還能繼續<span className="mark">胡鬧</span>
        </h2>
        <p className="mb-9 max-w-[44em] text-[15px] text-muted">
          正賽已結束，線上體驗與物資資訊持續開放。
        </p>
        <div className="grid gap-0.5 md:grid-cols-2">
          <article className="flex flex-col gap-2.5 bg-dark-gray p-6">
            <p className="font-mono-ui text-[11px] tracking-widest text-brand-yellow">線上持續開放</p>
            <h3 className="m-0 text-xl font-black">攻略校長旮拉給木</h3>
            <p className="m-0 text-sm text-muted">經典街機魂 × 校園迷因。打開瀏覽器就能挑戰。</p>
            <a
              href={siteConfig.galagaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-dark-outline mt-3 inline-flex self-start text-sm"
            >
              立即遊玩
            </a>
          </article>
          <article className="flex flex-col gap-2.5 bg-dark-gray p-6">
            <p className="font-mono-ui text-[11px] tracking-widest text-brand-yellow">物資／表單</p>
            <h3 className="m-0 text-xl font-black">小徑 T</h3>
            <p className="m-0 text-sm text-muted">領取與預購資訊整理在官方 Linktree。</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={siteConfig.linktreeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark-outline text-sm"
              >
                Linktree
              </a>
              <Link href={appPath("/news/merch-tee-pickup")} className="btn-dark-outline text-sm">
                領取公告
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
