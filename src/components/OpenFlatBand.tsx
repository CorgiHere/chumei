import Link from "next/link";
import { getActivityBySlug } from "@/data/activities";
import { siteConfig } from "@/data/site";
import { appPath, withBasePath } from "@/lib/utils";

function PixelCal() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" aria-hidden>
      <rect x="1" y="3" width="14" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="3" width="14" height="3" fill="currentColor" />
      <rect x="4" y="1" width="1.5" height="3" fill="currentColor" />
      <rect x="10.5" y="1" width="1.5" height="3" fill="currentColor" />
      <rect x="4" y="9" width="2" height="2" fill="currentColor" />
      <rect x="7" y="9" width="2" height="2" fill="currentColor" />
      <rect x="10" y="9" width="2" height="2" fill="currentColor" />
    </svg>
  );
}

function PixelPad() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" aria-hidden>
      <rect x="1" y="4" width="14" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <rect x="4" y="6.5" width="2" height="3" fill="currentColor" />
      <rect x="3" y="7.5" width="4" height="1.2" fill="currentColor" />
      <circle cx="11" cy="7" r="1.1" fill="currentColor" />
      <circle cx="12.6" cy="9" r="1.1" fill="currentColor" />
    </svg>
  );
}

function PixelRank() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" aria-hidden>
      <rect x="2" y="9" width="3" height="5" fill="currentColor" />
      <rect x="6.5" y="4" width="3" height="10" fill="currentColor" />
      <rect x="11" y="7" width="3" height="7" fill="currentColor" />
    </svg>
  );
}

export function OpenFlatBand() {
  const activity = getActivityBySlug("punchboard");
  if (!activity) return null;

  return (
    <section
      id="openflat"
      className="scroll-mt-24 bg-ink py-8 text-chalk sm:py-10 lg:py-12"
      aria-labelledby="openflat-heading"
    >
      <div className="container-main">
        <article className="openflat-card relative overflow-hidden px-6 pb-8 pt-14 sm:px-9 sm:pb-10 sm:pt-16 lg:px-12 lg:pb-12 lg:pt-[4.5rem]">
          <img
            src={withBasePath("/images/punchboard/openflat-chunk-bg.jpg")}
            alt=""
            className="openflat-card__bg"
          />
          <p className="openflat-card__badge">11/17 × Whoscall 合作活動</p>
          <div className="relative z-1 grid items-center gap-8 pb-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6">
            <div>
              <h2
                id="openflat-heading"
                className="mt-4 text-[clamp(1.55rem,3.4vw,2.45rem)] font-black leading-[1.18]"
              >
                詐騙來電，Whoscall{" "}
                <span className="text-brand-yellow">開扁</span>
              </h2>
              <p className="mt-3 max-w-[38em] text-[15px] leading-relaxed text-muted">
                竹梅賽與 Whoscall 合作的個人實戰挑戰，現場打榜，男女生組即時排名在官網公開！
              </p>

              <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-brand-yellow">
                    <PixelCal />
                  </span>
                  <div>
                    <dt className="font-mono-ui text-[11px] tracking-[0.14em] text-brand-yellow">
                      日期
                    </dt>
                    <dd className="m-0 mt-0.5 font-semibold">2026 / 11 / 17</dd>
                  </div>
                </div>
                <div
                  className="hidden h-10 w-px self-center bg-white/20 sm:block"
                  aria-hidden
                />
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 text-brand-yellow">
                    <PixelPad />
                  </span>
                  <div>
                    <dt className="font-mono-ui text-[11px] tracking-[0.14em] text-brand-yellow">
                      形式
                    </dt>
                    <dd className="m-0 mt-0.5 font-semibold">個人賽拳擊機</dd>
                  </div>
                </div>
              </dl>

              <p className="mt-4 flex items-center gap-2 font-mono-ui text-[12px] font-semibold tracking-wide text-brand-yellow">
                <PixelRank />
                免費報名 · 現場打榜 · 即時排名
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={appPath("/activities/punchboard")} className="btn-primary">
                  前往活動頁面 →
                </Link>
                <a
                  href={siteConfig.punchFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-dark-outline"
                >
                  立即報名
                </a>
              </div>
            </div>

            <img
              src={withBasePath("/images/activities/whoscall-openflat.png")}
              alt="詐騙來電，Whoscall 開扁"
              className="relative z-1 mx-auto w-full max-w-md drop-shadow-[0_8px_0_#050b18] lg:max-w-none"
            />
          </div>
        </article>
      </div>
    </section>
  );
}
