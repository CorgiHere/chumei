import Link from "next/link";
import { siteConfig } from "@/data/site";
import { SideExtras } from "@/components/SideExtras";
import { appPath } from "@/lib/utils";

export function KeepPlaying() {
  return (
    <section className="section-space scroll-mt-24 bg-ink text-chalk" id="playing">
      <div className="container-main">
        <h2 className="section-title mb-3">
          正在挑戰更<span className="mark">誇張</span>的目標
        </h2>
        <p className="mb-9 max-w-[44em] text-[15px] text-muted">
          2027竹梅錦標對抗賽正在規劃能震驚所有人的雷霆活動，你現在就能加入！
        </p>
        <article className="mb-0.5 flex flex-col gap-2.5 bg-dark-gray p-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono-ui text-[11px] tracking-widest text-brand-yellow">
              11/17 即將開打
            </p>
            <h3 className="m-0 mt-2 text-xl font-black">詐騙來電，Whoscall 開扁</h3>
            <p className="m-0 mt-2 max-w-[40em] text-sm text-muted">
              11 月 17 日清交現場拳擊機，Whoscall 合作。先填表單領 ID，男生組／女生組即時上榜。
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 md:mt-0">
            <a
              href={siteConfig.punchFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex text-sm"
            >
              立即報名
            </a>
            <Link href={appPath("/punchboard")} className="btn-dark-outline inline-flex text-sm">
              看即時榜
            </Link>
          </div>
        </article>
        <article className="mb-0.5 mt-0.5 flex flex-col gap-2.5 bg-dark-gray p-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono-ui text-[11px] tracking-widest text-brand-yellow">
              線上持續開放
            </p>
            <h3 className="m-0 mt-2 text-xl font-black">攻略校長旮拉給木</h3>
            <p className="m-0 mt-2 max-w-[40em] text-sm text-muted">
              經典街機魂 × 校園迷因。打開瀏覽器就能挑戰。
            </p>
          </div>
          <a
            href={siteConfig.galagaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-dark-outline mt-3 inline-flex self-start text-sm md:mt-0"
          >
            立即遊玩
          </a>
        </article>
        <SideExtras />
      </div>
    </section>
  );
}
