import Link from "next/link";
import { appPath } from "@/lib/utils";

export function AboutBand() {
  return (
    <section className="section-space bg-charcoal" id="about-band">
      <div className="container-main">
        <p className="mb-2.5 font-mono-ui text-xs tracking-[0.2em] text-brand-yellow">
          05 ／ 關於
        </p>
        <h2 className="section-title mb-9">
          我們是<span className="mark">誰</span>
        </h2>
        <p className="mb-11 max-w-[46em] border-l-[5px] border-brand-yellow py-1 pl-6 text-[clamp(17px,2vw,21px)] leading-[1.85]">
          竹梅籌備委員會是清大與交大學生自發組成的團體。我們不隸屬於任何學校單位，也與梅竹籌備委員會沒有任何關係。竹梅賽是我們自己辦的一整個賽季，從企劃、經費到獎品都是自己來。
        </p>
        <div className="mb-11 grid gap-8 md:grid-cols-3">
          <div>
            <h4 className="mb-2.5 font-mono-ui text-xs font-medium tracking-[0.14em] text-brand-yellow">
              竹梅賽是什麼
            </h4>
            <p className="m-0 text-[15px] text-[#b6b3ab]">
              清華與交通兩校之間的對抗賽季。項目由我們自己想，2026
              年共七場，從恐龍賽跑到猜拳送機票，最後結算總錦標。
            </p>
          </div>
          <div>
            <h4 className="mb-2.5 font-mono-ui text-xs font-medium tracking-[0.14em] text-brand-yellow">
              為什麼有兩個名字
            </h4>
            <p className="m-0 text-[15px] text-[#b6b3ab]">
              小徑的兩端，清大那頭寫「清交小徑」，交大那頭寫「交清小徑」，各自表述。這個網站也一樣。
            </p>
          </div>
          <div>
            <h4 className="mb-2.5 font-mono-ui text-xs font-medium tracking-[0.14em] text-brand-yellow">
              怎麼運作
            </h4>
            <p className="m-0 text-[15px] text-[#b6b3ab]">
              一群學生。企劃、美術、程式、社群都自己來，場地要借、保險要保、獎品要扛。經費和睡眠都不太夠。
            </p>
          </div>
        </div>
        <p className="display-title m-0 text-[clamp(26px,4.4vw,46px)] leading-snug">
          一徑各表
          <br />
          <span className="mark">沒有共識</span>
        </p>
        <p className="mt-8">
          <Link href={appPath("/about")} className="text-link">
            關於竹梅 →
          </Link>
        </p>
      </div>
    </section>
  );
}
