import Link from "next/link";
import { siteConfig } from "@/data/site";
import { withBasePath } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

export function KeepPlaying() {
  return (
    <section className="section-space grid-bg">
      <div className="container-main">
        <SectionHeader
          index="01"
          eyebrow="賽季後仍可參與"
          title="還能繼續胡鬧"
          subtitle="正賽已結束，線上體驗與物資資訊持續開放。"
        />
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-xl border-4 border-black bg-black p-6 text-white md:p-8">
            <p className="mb-2 text-xs font-bold text-brand-yellow">線上持續開放</p>
            <h3 className="display-title text-3xl font-black">攻略校長旮拉給木</h3>
            <p className="mt-3 text-sm text-white/70">
              經典街機魂 × 校園迷因。打開瀏覽器就能挑戰。
            </p>
            <a
              href={siteConfig.galagaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-6 inline-flex text-sm"
            >
              立即遊玩 →
            </a>
          </article>
          <article className="rounded-xl border-4 border-brand-yellow bg-white p-6 md:p-8">
            <p className="mb-2 text-xs font-bold text-brand-blue">物資／表單</p>
            <h3 className="display-title text-3xl font-black">小徑 T</h3>
            <p className="mt-3 text-sm text-muted">
              領取與預購資訊整理在官方 Linktree，有問題可私訊 IG。
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={siteConfig.linktreeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-sm"
              >
                查看 Linktree →
              </a>
              <Link href={withBasePath("/news/merch-tee-pickup")} className="btn-outline text-sm">
                領取公告
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
