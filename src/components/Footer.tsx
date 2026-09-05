import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { withBasePath, appPath } from "@/lib/utils";
import { HazardBar } from "./HazardBar";

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-chalk">
      <HazardBar animated={false} />
      <div className="container-main py-14">
        <div className="mb-8 flex flex-wrap justify-between gap-8">
          <div className="max-w-sm">
            <div className="mb-3 flex items-center gap-3">
              <Image
                src={withBasePath(siteConfig.logoUrl)}
                alt="竹梅賽"
                width={42}
                height={42}
                className="h-10.5 w-10.5 rounded-[9px]"
              />
              <p className="text-lg font-black">{siteConfig.yearName}</p>
            </div>
            <p className="text-[13px] leading-relaxed text-muted">
              竹梅賽致力於在清交大搞一些蝦趴事，為無聊的新竹帶來最好玩的活動。全部由學生組成，也將永遠以學生為核心。
            </p>
          </div>
          <div>
            <h5 className="mb-2.5 font-mono-ui text-[11px] font-medium tracking-[0.18em] text-brand-yellow">
              賽事
            </h5>
            <Link href={appPath("/")} className="block py-0.5 font-mono-ui text-[13px] text-muted no-underline hover:text-brand-yellow">
              首頁
            </Link>
            <Link href={appPath("/activities")} className="block py-0.5 font-mono-ui text-[13px] text-muted no-underline hover:text-brand-yellow">
              活動總覽
            </Link>
            <Link href={appPath("/schedule")} className="block py-0.5 font-mono-ui text-[13px] text-muted no-underline hover:text-brand-yellow">
              賽程
            </Link>
            <Link href={appPath("/scoreboard")} className="block py-0.5 font-mono-ui text-[13px] text-muted no-underline hover:text-brand-yellow">
              總錦標
            </Link>
            <Link href={appPath("/history")} className="block py-0.5 font-mono-ui text-[13px] text-muted no-underline hover:text-brand-yellow">
              歷屆
            </Link>
          </div>
          <div>
            <h5 className="mb-2.5 font-mono-ui text-[11px] font-medium tracking-[0.18em] text-brand-yellow">
              參與
            </h5>
            <Link href={appPath("/join")} className="block py-0.5 font-mono-ui text-[13px] text-muted no-underline hover:text-brand-yellow">
              加入我們
            </Link>
            <Link href={appPath("/partners")} className="block py-0.5 font-mono-ui text-[13px] text-muted no-underline hover:text-brand-yellow">
              合作提案
            </Link>
            <Link href={appPath("/contact")} className="block py-0.5 font-mono-ui text-[13px] text-muted no-underline hover:text-brand-yellow">
              聯絡
            </Link>
          </div>
          <div>
            <h5 className="mb-2.5 font-mono-ui text-[11px] font-medium tracking-[0.18em] text-brand-yellow">
              社群
            </h5>
            <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="block py-0.5 font-mono-ui text-[13px] text-muted no-underline hover:text-brand-yellow">
              Instagram
            </a>
            <a href={siteConfig.facebookUrl} target="_blank" rel="noopener noreferrer" className="block py-0.5 font-mono-ui text-[13px] text-muted no-underline hover:text-brand-yellow">
              Facebook
            </a>
            <a href={siteConfig.linktreeUrl} target="_blank" rel="noopener noreferrer" className="block py-0.5 font-mono-ui text-[13px] text-muted no-underline hover:text-brand-yellow">
              Linktree
            </a>
          </div>
        </div>
        <p className="border-t border-white/15 pt-5 text-[13px] leading-relaxed text-muted">
          竹梅籌備委員會為學生自發團體，非學校組織。本站資訊以籌委會公告為準。
        </p>
        <p className="mt-4 font-mono-ui text-[11px] tracking-[0.06em] text-[#6e6c66]">
          © {siteConfig.year} 竹梅籌備委員會
        </p>
      </div>
    </footer>
  );
}
