import Link from "next/link";
import { siteConfig } from "@/data/site";
import { appPath } from "@/lib/utils";

export function AboutBand() {
  return (
    <section className="section-space bg-ink text-chalk" id="about-band">
      <div className="container-main">
        <h2 className="section-title mb-9">
          我們是<span className="mark">誰</span>
        </h2>
        <p className="mb-11 max-w-[46em] border-l-[5px] border-brand-yellow py-1 pl-6 text-[clamp(17px,2vw,21px)] leading-[1.85]">
          竹梅籌備委員會是清大與交大學生自發組成的團體，目標是做一些好玩的事。我們不隸屬於任何學校單位，也與梅竹沒有任何關係。竹梅賽全部由學生組成，也將永遠以學生為核心。
        </p>
        <div className="mb-11 grid gap-8 md:grid-cols-2">
          <div>
            <h4 className="mb-2.5 font-mono-ui text-xs font-medium tracking-[0.14em] text-brand-yellow">
              你們是梅竹賽嗎
            </h4>
            <p className="m-0 text-[15px] text-muted" data-keep-order>
              不是，我們只是在網路上打嘴炮的關係。
            </p>
          </div>
          <div>
            <h4 className="mb-2.5 font-mono-ui text-xs font-medium tracking-[0.14em] text-brand-yellow">
              怎麼加入
            </h4>
            <p className="m-0 text-[15px] text-muted">
              私訊我們的{" "}
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link"
              >
                IG
              </a>
              ，只要你有搞事的心，想要夥伴、資源或者想法，任何時間都可以聯絡我們。
            </p>
          </div>
        </div>
        <p className="display-title m-0 text-[clamp(26px,4.4vw,46px)] leading-snug">
          一徑各表
          <br />
          <span className="mark">沒有共識</span>
        </p>
        <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          <Link href={appPath("/about")} className="text-link">
            關於竹梅 →
          </Link>
          <Link href={appPath("/history")} className="text-link">
            歷屆紀錄 →
          </Link>
          <Link href={appPath("/join")} className="text-link">
            加入籌備 →
          </Link>
        </p>
      </div>
    </section>
  );
}
