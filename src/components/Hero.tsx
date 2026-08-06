import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/data/site";
import { withBasePath } from "@/lib/utils";
import { HazardBar } from "./HazardBar";

export function Hero() {
  const nthu = String(siteConfig.nthuScore).padStart(2, "0");
  const nycu = String(siteConfig.nycuScore).padStart(2, "0");

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <HazardBar />
      <div className="speed-lines" aria-hidden />
      <div className="container-main relative flex min-h-[min(820px,calc(100vh-5rem))] flex-col justify-center py-12 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="reveal-up order-1">
            <p className="mb-4 inline-block rounded-pill border border-brand-yellow px-3 py-1 text-xs font-bold tracking-wide text-brand-yellow">
              2026 清交荒謬校際錦標
            </p>
            <h1 className="display-title-skew text-[clamp(3.5rem,12vw,8rem)] font-black text-white">
              竹梅賽
            </h1>
            <p
              className="offset-title mt-2 text-[clamp(2rem,6vw,4rem)] font-black text-brand-yellow"
              data-text="強勢回歸"
            >
              強勢回歸
            </p>
            <p className="mt-6 hidden max-w-xl text-base text-white/75 md:block md:text-lg">
              看起來像正式大型錦標賽，但比賽項目完全不正常。跟梅竹賽沒有任何關係。
            </p>

            <div className="mt-8 hidden flex-wrap gap-3 md:flex">
              <Link href="/scoreboard" className="btn-primary">
                查看完整賽果 →
              </Link>
              <Link
                href="/activities"
                className="btn-dark-outline"
              >
                瀏覽全部活動
              </Link>
            </div>

            <div className="mt-10 hidden border-t border-white/20 pt-6 md:block">
              <p className="display-title text-3xl font-black md:text-4xl">
                <span className="text-nthu">清華 {nthu}</span>
                <span className="mx-3 text-brand-yellow">───</span>
                <span className="text-[#7EB6FF]">{nycu} 交大</span>
              </p>
              <p className="mt-2 text-sm font-bold text-brand-yellow">
                2026 總錦標 · 交大獲勝
              </p>
            </div>
          </div>

          <div className="reveal-up-delay order-2">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div
                className="absolute -right-3 -top-3 h-full w-full rounded-[28px] bg-brand-blue"
                aria-hidden
              />
              <div
                className="absolute -bottom-3 -left-3 h-full w-full rounded-[28px] border-4 border-brand-yellow"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-[28px] border-4 border-white bg-charcoal aspect-4/3 lg:aspect-3/4">
                <Image
                  src={withBasePath("/images/gallery/hero-poster.jpg")}
                  alt="2026 竹梅賽主視覺"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 40vw"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="order-3 md:hidden">
            <p className="mt-2 text-base text-white/75">
              看起來像正式大型錦標賽，但比賽項目完全不正常。
            </p>
            <div className="mt-6 border-y border-white/20 py-5">
              <p className="display-title text-3xl font-black">
                清華 {siteConfig.nthuScore}：{siteConfig.nycuScore} 交大
              </p>
              <p className="mt-1 text-sm font-bold text-brand-yellow">
                總錦標 · 交大獲勝
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              <Link href="/scoreboard" className="btn-primary">
                查看賽果
              </Link>
              <Link
                href="/activities"
                className="btn-dark-outline"
              >
                全部活動
              </Link>
            </div>
          </div>
        </div>
      </div>
      <HazardBar />
    </section>
  );
}
