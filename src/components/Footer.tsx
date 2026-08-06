import Link from "next/link";
import { siteConfig } from "@/data/site";
import { withBasePath } from "@/lib/utils";
import { HazardBar } from "./HazardBar";

export function Footer() {
  return (
    <footer className="mt-auto bg-black text-white">
      <HazardBar />
      <div className="container-main py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="display-title-skew mb-2 text-2xl font-black text-brand-yellow">
              {siteConfig.yearName}
            </p>
            <p className="text-sm leading-relaxed text-white/70">
              看起來像正式大型錦標賽，但比賽項目完全不正常。清交學生自主籌辦。
            </p>
          </div>

          <div>
            <p className="mb-3 font-bold text-brand-yellow">快速連結</p>
            <ul className="space-y-2 text-sm font-bold">
              <li>
                <Link href={withBasePath("/activities")} className="hover:text-brand-yellow">
                  活動總覽
                </Link>
              </li>
              <li>
                <Link href={withBasePath("/schedule")} className="hover:text-brand-yellow">
                  賽程
                </Link>
              </li>
              <li>
                <Link href={withBasePath("/scoreboard")} className="hover:text-brand-yellow">
                  比分與結果
                </Link>
              </li>
              <li>
                <Link href={withBasePath("/news")} className="hover:text-brand-yellow">
                  最新消息
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-bold text-brand-yellow">參與</p>
            <ul className="space-y-2 text-sm font-bold">
              <li>
                <Link href={withBasePath("/join")} className="hover:text-brand-yellow">
                  加入竹梅
                </Link>
              </li>
              <li>
                <Link href={withBasePath("/partners")} className="hover:text-brand-yellow">
                  合作提案
                </Link>
              </li>
              <li>
                <Link href={withBasePath("/contact")} className="hover:text-brand-yellow">
                  聯絡我們
                </Link>
              </li>
              <li>
                <Link href={withBasePath("/gallery")} className="hover:text-brand-yellow">
                  圖庫
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-bold text-brand-yellow">社群</p>
            <ul className="space-y-2 text-sm font-bold">
              <li>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-yellow"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.threadsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-yellow"
                >
                  Threads
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-yellow"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.linktreeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-yellow"
                >
                  Linktree
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6 text-center text-xs text-white/50">
          <p>© {siteConfig.year} 竹梅籌備委員會 · 清交學生自主籌辦</p>
        </div>
      </div>
    </footer>
  );
}
