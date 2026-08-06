import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { siteConfig } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "關於竹梅",
  description:
    "竹梅賽是什麼？與梅竹賽的差異、竹梅精神與活動理念。清交學生自主籌辦的荒謬校際競技。",
  path: "/about",
});

const spirits = [
  "一本正經地胡鬧",
  "校園迷因",
  "荒謬競技",
  "清交共同文化",
  "高參與感",
  "學生自辦",
];

export default function AboutPage() {
  return (
    <div className="grid-bg py-12">
      <div className="container-main max-w-3xl">
        <PageIntro
          eyebrow={siteConfig.yearName}
          title="關於竹梅"
          subtitle="正式錦標賽的架子，完全不正經的項目——這就是竹梅賽。"
        />

        <div className="space-y-10 text-base md:text-lg">
          <section>
            <h2 className="text-xl font-black">竹梅賽是什麼？</h2>
            <p className="mt-3">
              竹梅賽是一個以正式校際競賽形式，舉辦荒謬、創意且高度參與式校園活動的學生文化平台。由清交學生自主籌辦，看起來像正式大型錦標賽，但比賽項目完全不正常。
            </p>
            <p className="mt-3 text-muted">
              官網負責報名、規則、賽程與結果；Instagram @chumei2026
              負責現場花絮與迷因。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-black">與梅竹賽的差異</h2>
            <div className="overflow-hidden rounded-lg border-2 border-black bg-white">
              <table className="w-full text-left text-sm md:text-base">
                <thead>
                  <tr className="border-b-2 border-black bg-brand-yellow">
                    <th className="px-4 py-3">面向</th>
                    <th className="px-4 py-3">梅竹賽</th>
                    <th className="px-4 py-3">竹梅賽</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-light-gray">
                    <td className="px-4 py-3 font-bold">性質</td>
                    <td className="px-4 py-3">正式校際體育賽</td>
                    <td className="px-4 py-3">學生自辦趣味對抗</td>
                  </tr>
                  <tr className="border-b border-light-gray">
                    <td className="px-4 py-3 font-bold">項目</td>
                    <td className="px-4 py-3">球類、棋藝等正式項目</td>
                    <td className="px-4 py-3">恐龍賽跑、辦公椅、猜拳…</td>
                  </tr>
                  <tr className="border-b border-light-gray">
                    <td className="px-4 py-3 font-bold">資訊風格</td>
                    <td className="px-4 py-3">正式賽事資訊</td>
                    <td className="px-4 py-3">正式資訊 × 荒謬文案</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-bold">關係</td>
                    <td className="px-4 py-3" colSpan={2}>
                      互補，不互相取代——共同構成清交校園文化
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black">竹梅精神</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {spirits.map((s) => (
                <span
                  key={s}
                  className="rounded-full border-2 border-black bg-white px-3 py-1 text-sm font-bold"
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-4">
              最重要的品牌反差是：看起來像正式大型錦標賽，但比賽項目完全不正常。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black">本屆與紀錄</h2>
            <p className="mt-3">
              目前官網收錄的是{" "}
              <strong>{siteConfig.yearName}</strong>
              。活動、比分與消息會隨賽事進度更新；更完整的年度回顧見{" "}
              <Link
                href="/history"
                className="font-bold text-brand-blue underline"
              >
                歷屆竹梅
              </Link>
              。
            </p>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-black">籌備團隊</h2>
            <p className="mt-3 font-bold">竹梅籌備委員會</p>
            <p className="mt-2 text-sm text-muted">
              只要是清交人就絕對不能錯過的竹梅！
            </p>
            <p className="mt-3 text-sm">
              Email：{" "}
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-bold text-brand-blue"
              >
                {siteConfig.contactEmail}
              </a>
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm"
              >
                Instagram
              </a>
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-sm"
              >
                Facebook
              </a>
              <a
                href={siteConfig.linktreeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-sm"
              >
                Linktree
              </a>
              <Link
                href="/contact"
                className="btn-outline text-sm"
              >
                聯絡我們
              </Link>
              <Link href="/join" className="btn-outline text-sm">
                加入竹梅
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
