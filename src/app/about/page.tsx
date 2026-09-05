import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { siteConfig } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";
import { appPath } from "@/lib/utils";
import {
  FacebookIcon,
  InstagramIcon,
  JoinIcon,
  LinktreeIcon,
  MailIcon,
} from "@/components/BrandIcons";

export const metadata: Metadata = buildPageMetadata({
  title: "關於竹梅賽",
  description:
    "竹梅賽致力於在清交大搞一些蝦趴事，為無聊的新竹帶來最好玩的活動。學生自發組成，與梅竹沒有任何關係。",
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
    <div className="bg-ink section-space text-chalk">
      <div className="container-main max-w-3xl">
        <PageIntro
          eyebrow={siteConfig.yearName}
          title="關於竹梅"
          subtitle="正式錦標賽的架子，完全不正經的項目——這就是竹梅賽。"
          dark
        />

        <div className="space-y-10 text-base md:text-lg">
          <section>
            <h2 className="text-xl font-black">竹梅賽是什麼？</h2>
            <p className="mt-3">
              竹梅賽致力於在清交大搞一些蝦趴事，為無聊的新竹帶來最好玩的活動，籌備恐龍賽跑開始、大草坪大尖叫、酒精微積分、辦公椅競速、刷條碼競速到猜拳送機票等。
            </p>
            <p className="mt-3 text-muted">
              竹梅籌備委員會是清大與交大學生自發組成的團體，目標是做一些好玩的事。我們不隸屬於任何學校單位，也與梅竹沒有任何關係。竹梅賽全部由學生組成，也將永遠以學生為核心。
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-black">與梅竹賽的差異</h2>
            <div className="overflow-hidden border-2 border-white/20 bg-dark-gray">
              <table className="w-full text-left text-sm md:text-base">
                <thead>
                  <tr className="border-b-2 border-brand-yellow bg-brand-yellow text-ink">
                    <th className="px-4 py-3">面向</th>
                    <th className="px-4 py-3">梅竹賽</th>
                    <th className="px-4 py-3">竹梅賽</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/15">
                    <td className="px-4 py-3 font-bold">性質</td>
                    <td className="px-4 py-3">正式校際體育賽</td>
                    <td className="px-4 py-3">學生自辦趣味對抗</td>
                  </tr>
                  <tr className="border-b border-white/15">
                    <td className="px-4 py-3 font-bold">項目</td>
                    <td className="px-4 py-3">球類、棋藝等正式項目</td>
                    <td className="px-4 py-3">恐龍賽跑、辦公椅、猜拳…</td>
                  </tr>
                  <tr className="border-b border-white/15">
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
                  className="border-2 border-white/20 bg-dark-gray px-3 py-1 text-sm font-bold"
                >
                  {s}
                </span>
              ))}
            </div>
            <p className="mt-4">
              為無聊的新竹帶來最好玩的活動。全部由學生組成，也將永遠以學生為核心。
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
                className="text-link font-bold"
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
                className="text-link font-bold"
              >
                {siteConfig.contactEmail}
              </a>
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary h-12 w-12 p-0"
                aria-label="Instagram"
                title="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark-outline h-12 w-12 p-0"
                aria-label="Facebook"
                title="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href={siteConfig.linktreeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-dark-outline h-12 w-12 p-0"
                aria-label="Linktree"
                title="Linktree"
              >
                <LinktreeIcon className="h-5 w-5" />
              </a>
              <Link
                href={appPath("/contact")}
                className="btn-dark-outline h-12 w-12 p-0"
                aria-label="聯絡我們"
                title="聯絡我們"
              >
                <MailIcon className="h-5 w-5" />
              </Link>
              <Link
                href={appPath("/join")}
                className="btn-dark-outline h-12 w-12 p-0"
                aria-label="加入竹梅"
                title="加入竹梅"
              >
                <JoinIcon className="h-5 w-5" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
