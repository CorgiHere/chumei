import { siteConfig } from "@/data/site";
import { SideExtras } from "@/components/SideExtras";

export function KeepPlaying() {
  return (
    <section className="section-space bg-ink text-chalk">
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
