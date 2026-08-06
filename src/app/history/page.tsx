import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { activities } from "@/data/activities";
import { historyYears } from "@/data/history";
import { siteConfig } from "@/data/site";
import { formatDateOnly } from "@/lib/utils";

export const metadata: Metadata = {
  title: "歷屆竹梅",
  description: "竹梅賽年度回顧、總比分與經典活動紀錄。",
};

export default function HistoryPage() {
  const years = [...historyYears].sort((a, b) => b.year - a.year);
  const yearTimeline = [...activities].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );

  return (
    <div className="grid-bg py-12">
      <div className="container-main">
        <PageIntro
          eyebrow="Campus Culture Archive"
          title="歷屆竹梅"
          subtitle="保存荒謬項目、經典瞬間與清交共同記憶。目前收錄 2026 竹梅賽。"
        />

        <div className="space-y-6">
          {years.map((year) => {
            const isCurrent = year.year === siteConfig.year;
            const total = year.nthuScore + year.nycuScore || 1;
            const nthuPct = Math.round((year.nthuScore / total) * 100);

            return (
              <article
                key={year.year}
                className={`card overflow-hidden ${isCurrent ? "border-brand-yellow ring-4 ring-brand-yellow/40" : ""}`}
              >
                {isCurrent && (
                  <div className="hazard-stripe-animated h-2" aria-hidden />
                )}
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-brand-blue">
                        {isCurrent ? "本屆進行中" : `${year.year}`}
                      </p>
                      <h2 className="mt-1 text-2xl font-black md:text-3xl">
                        {year.name}
                      </h2>
                      <p className="mt-1 text-muted">
                        {year.tagline}
                      </p>
                    </div>
                    <div className="rounded-md border-2 border-black bg-white px-4 py-2 text-center">
                      <p className="text-xs font-bold text-muted">
                        總比分
                      </p>
                      <p className="text-2xl font-black">
                        <span className="text-nthu">
                          {year.nthuScore}
                        </span>
                        <span className="mx-1">：</span>
                        <span className="text-nycu">
                          {year.nycuScore}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 h-3 overflow-hidden rounded-full border-2 border-black">
                    <div
                      className="h-full bg-nthu"
                      style={{ width: `${nthuPct}%` }}
                      title={`清華 ${year.nthuScore}`}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs font-bold">
                    <span className="text-nthu">清華</span>
                    <span className="text-nycu">陽明交大</span>
                  </div>

                  <p className="mt-5">{year.summary}</p>
                  <p className="mt-2 text-sm text-muted">
                    {year.activityCount} 場活動
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {year.highlights.map((h) => (
                      <span
                        key={h}
                        className="rounded-full border-2 border-black bg-brand-yellow/30 px-3 py-1 text-sm font-bold"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  {isCurrent && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Link
                        href="/activities"
                        className="btn-primary text-sm"
                      >
                        本屆活動
                      </Link>
                      <Link
                        href="/scoreboard"
                        className="btn-outline text-sm"
                      >
                        目前比分
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <section className="mt-14">
          <h2 className="section-title display-title mb-2">2026 活動時間軸</h2>
          <p className="mb-6 text-muted">
            本屆已登場與進行中的項目一覽。
          </p>
          <ol className="relative space-y-8 border-l-4 border-black pl-6">
            {yearTimeline.map((activity) => (
              <li key={activity.id} className="relative">
                <span
                  className="absolute left-[-1.9rem] top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-brand-yellow text-[10px] font-black"
                  aria-hidden
                >
                  {activity.index
                    ? String(activity.index).padStart(2, "0")
                    : "•"}
                </span>
                <p className="text-sm font-bold text-brand-blue">
                  {formatDateOnly(activity.startAt)}
                </p>
                <h3 className="text-xl font-black">
                  <Link
                    href={`/activities/${activity.slug}`}
                    className="hover:text-brand-blue"
                  >
                    {activity.title}
                  </Link>
                </h3>
                {activity.tagline && (
                  <p className="mt-1 text-muted">
                    {activity.tagline}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>

        <p className="mt-10 text-center text-sm text-muted">
          往屆資料將於有正式紀錄後陸續補上。
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/gallery" className="btn-primary">
            查看圖庫
          </Link>
          <Link href="/about" className="btn-outline">
            關於竹梅
          </Link>
        </div>
      </div>
    </div>
  );
}
