import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { siteConfig } from "@/data/site";
import { partners } from "@/data/history";
import { withBasePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "關於竹梅",
  description:
    "竹梅賽是什麼？與梅竹賽的差異、竹梅精神與活動理念。",
};

export default function AboutPage() {
  return (
    <div className="grid-bg py-12">
      <div className="container-main max-w-3xl">
        <SectionHeader title="關於竹梅" />

        <div className="space-y-8 text-lg">
          <section>
            <h2 className="text-xl font-black">竹梅賽是什麼？</h2>
            <p className="mt-3">
              竹梅賽是一個以正式校際競賽形式，舉辦荒謬、創意且高度參與式校園活動的學生文化平台。由清交學生自主籌辦，看起來像正式大型錦標賽，但比賽項目完全不正常。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black">與梅竹賽的差異</h2>
            <p className="mt-3">
              梅竹賽是清交兩校正式的年度校際體育競賽，已有半世紀歷史。竹梅賽則是學生自辦的趣味對抗平台——資訊上清楚正式，內容上荒謬幽默。兩者互補，共同構成清交校園文化。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black">竹梅精神</h2>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>一本正經地胡鬧</li>
              <li>校園迷因 × 荒謬競技</li>
              <li>清交共同文化</li>
              <li>高參與感、學生自辦</li>
            </ul>
          </section>

          <section className="card p-6">
            <h2 className="text-xl font-black">籌備團隊</h2>
            <p className="mt-3">竹梅籌備委員會</p>
            <p className="mt-2 text-sm text-[var(--color-gray)]">
              只要是清交人就絕對不能錯過的竹梅！
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm"
              >
                Instagram
              </a>
              <Link href={withBasePath("/contact")} className="btn-outline text-sm">
                聯絡我們
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
