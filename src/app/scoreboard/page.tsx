import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Scoreboard } from "@/components/Scoreboard";
import { StatusBadge } from "@/components/StatusBadge";
import { activities } from "@/data/activities";
import { historyYears } from "@/data/history";
import { siteConfig } from "@/data/site";
import { formatDateOnly } from "@/lib/utils";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "比分與結果｜清華大學 vs 交通大學總錦標",
  description: `2026 竹梅賽總錦標：國立清華大學（清大／NTHU）${siteConfig.nthuScore}：${siteConfig.nycuScore} 國立交通大學／陽明交通大學（交大／NYCU／NCTU）。查看七場計分項目與完整賽果——恐龍賽跑、酒精微積分、辦公椅、麻將、刷條碼、兩校憑拳。`,
  path: "/scoreboard",
});

export default function ScoreboardPage() {
  const scored = [...activities]
    .filter((a) => a.isScored)
    .sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
    );
  const unscored = activities.filter((a) => !a.isScored);
  const finished = scored.filter((a) => a.status === "finished");
  const pending = scored.filter((a) => a.status !== "finished");
  const pastYears = historyYears.filter((y) => y.year < siteConfig.year);

  return (
    <div>
      <section className="bg-black py-12 text-white">
        <div className="hazard-stripe-animated h-2" aria-hidden />
        <div className="container-main py-10">
          <PageIntro
            dark
            eyebrow={siteConfig.yearName}
            title="比分與結果"
            highlight="結果"
            subtitle="總錦標以 4/22 官方公告為準：交通大學 4：3 獲勝。"
          />
          <Scoreboard className="mx-auto max-w-2xl" />
          <p className="mt-6 text-center text-white/70">
            已完成計分 {finished.length}／{scored.length} 場 · 清華{" "}
            {siteConfig.nthuScore}：{siteConfig.nycuScore} 交大
          </p>
        </div>
        <div className="hazard-stripe-animated h-2" aria-hidden />
      </section>

      <div className="grid-bg py-12">
        <div className="container-main space-y-14">
          <section>
            <h2 className="section-title display-title mb-2">計分項目</h2>
            <p className="mb-6 text-muted">
              以下七場計分項目皆依 4/22
              <a
                href="https://www.instagram.com/p/DXbxyXpEvby/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-brand-blue"
              >
                總錦標公告
              </a>
              （交大 4：3）登錄。
            </p>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse overflow-hidden rounded-lg border-2 border-black bg-white">
                <thead>
                  <tr className="border-b-2 border-black bg-brand-yellow text-left">
                    <th className="px-4 py-3">活動</th>
                    <th className="px-4 py-3">清華</th>
                    <th className="px-4 py-3">交大</th>
                    <th className="px-4 py-3">勝方</th>
                    <th className="px-4 py-3">狀態</th>
                    <th className="px-4 py-3">日期</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {scored.map((a) => (
                    <tr
                      key={a.id}
                      className="border-b border-light-gray last:border-0"
                    >
                      <td className="px-4 py-3 font-bold">{a.title}</td>
                      <td className="px-4 py-3 font-black text-nthu">
                        {a.result?.nthuScore ?? "—"}
                      </td>
                      <td className="px-4 py-3 font-black text-nycu">
                        {a.result?.nycuScore ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold">
                        {winnerLabel(a.result?.winner)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={a.status} showFun={false} />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {formatDateOnly(a.startAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={
                            a.result
                              ? `/activities/${a.slug}#results`
                              : `/activities/${a.slug}`
                          }
                          className="text-sm font-bold text-brand-blue"
                        >
                          {a.result ? "查看結果" : "活動詳情"}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 md:hidden">
              {scored.map((a) => (
                <div key={a.id} className="card p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-black">{a.title}</h3>
                    <StatusBadge status={a.status} showFun={false} />
                  </div>
                  <div className="mt-3 flex gap-4 text-lg font-black">
                    <span className="text-nthu">
                      清華 {a.result?.nthuScore ?? "—"}
                    </span>
                    <span className="text-nycu">
                      交大 {a.result?.nycuScore ?? "—"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted">
                    {formatDateOnly(a.startAt)} · {winnerLabel(a.result?.winner)}
                  </p>
                  <Link
                    href={`/activities/${a.slug}`}
                    className="btn-outline mt-3 inline-flex text-sm"
                  >
                    查看詳情
                  </Link>
                </div>
              ))}
            </div>

            {pending.length > 0 && (
              <p className="mt-4 text-sm text-muted">
                尚待計分：{pending.map((a) => a.title).join("、")}
              </p>
            )}
          </section>

          <section>
            <h2 className="section-title display-title mb-2">非計分項目</h2>
            <p className="mb-6 text-muted">
              好玩、荒謬、值得來，但不影響總錦標。
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {unscored.map((a) => (
                <Link
                  key={a.id}
                  href={`/activities/${a.slug}`}
                  className="card block p-5 transition hover:-translate-y-0.5"
                >
                  <p className="text-xs font-bold text-muted">
                    非計分項目 · {formatDateOnly(a.startAt)}
                  </p>
                  <h3 className="mt-1 text-lg font-black">{a.title}</h3>
                  {a.tagline && (
                    <p className="mt-1 text-sm text-muted">
                      {a.tagline}
                    </p>
                  )}
                  <StatusBadge status={a.status} className="mt-3" />
                </Link>
              ))}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-black">計分規則摘要</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm md:text-base">
              <li>標示為「計分項目」的活動納入總錦標。</li>
              <li>每場勝負以官方結果為準；勝方學校 +1 分。</li>
              <li>非計分項目僅供參與與紀錄，不影響總比分。</li>
              <li>結果公告後若有更正，以最新消息與活動頁為準。</li>
            </ul>
          </section>

          {pastYears.length > 0 && (
            <section>
              <h2 className="section-title display-title mb-6">歷屆總比分</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {pastYears.map((year) => (
                  <div key={year.year} className="card p-5">
                    <p className="text-sm font-bold text-brand-blue">
                      {year.name}
                    </p>
                    <p className="mt-2 text-3xl font-black">
                      <span className="text-nthu">
                        {year.nthuScore}
                      </span>
                      <span className="mx-2 text-muted">：</span>
                      <span className="text-nycu">
                        {year.nycuScore}
                      </span>
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      清華 · 交大
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/history" className="btn-outline text-sm">
                  查看歷屆竹梅
                </Link>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function winnerLabel(
  winner?: "NTHU" | "NYCU" | "DRAW" | "NONE",
): string {
  switch (winner) {
    case "NTHU":
      return "清華勝";
    case "NYCU":
      return "交大勝";
    case "DRAW":
      return "平手";
    case "NONE":
      return "無勝負";
    default:
      return "尚未公布";
  }
}
