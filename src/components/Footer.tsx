import Link from "next/link";
import { siteConfig } from "@/data/site";
import { withBasePath } from "@/lib/utils";

export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--color-black)] text-white">
      <div className="hazard-stripe h-3" aria-hidden />
      <div className="container-main py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="display-title mb-2 text-2xl font-black">
              {siteConfig.yearName}
            </p>
            <p className="text-sm text-gray-300">{siteConfig.tagline}</p>
            <p className="mt-4 text-sm text-gray-400">
              清交學生自主籌辦的荒謬校際競技平台
            </p>
          </div>

          <div>
            <p className="mb-3 font-bold">快速連結</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={withBasePath("/activities")} className="hover:text-[var(--color-brand-yellow)]">
                  活動總覽
                </Link>
              </li>
              <li>
                <Link href={withBasePath("/schedule")} className="hover:text-[var(--color-brand-yellow)]">
                  賽程
                </Link>
              </li>
              <li>
                <Link href={withBasePath("/scoreboard")} className="hover:text-[var(--color-brand-yellow)]">
                  比分與結果
                </Link>
              </li>
              <li>
                <Link href={withBasePath("/join")} className="hover:text-[var(--color-brand-yellow)]">
                  加入竹梅
                </Link>
              </li>
              <li>
                <Link href={withBasePath("/contact")} className="hover:text-[var(--color-brand-yellow)]">
                  聯絡我們
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-bold">社群</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-brand-yellow)]"
                >
                  Instagram @chumei2026
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.linktreeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-brand-yellow)]"
                >
                  Linktree
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
          <p>© {siteConfig.year} 竹梅籌備委員會 · 清交學生自主籌辦</p>
        </div>
      </div>
    </footer>
  );
}
