import Link from "next/link";
import { siteConfig } from "@/data/site";
import { withBasePath, appPath } from "@/lib/utils";

const items = [
  {
    tag: "周邊",
    title: "小徑T",
    body: "黑衣黃印，清交小徑 NTHU 與交清小徑 NCTU 兩個版本。背面印著「一徑各表 沒有共識」。",
    meta: "領取 5/11 清大野台　5/12 交大二餐",
    image: "/images/side/path-tee.jpg",
    alt: "黑色小徑T正面特寫，黃色警示膠帶框住路牌圖樣",
    href: "/news/merch-tee-pickup",
    internal: true,
    keepOrder: true,
  },
  {
    tag: "獨立活動・第二屆",
    title: "期末週大草坪大尖叫",
    body: "期末週的晚上，到大草坪一起尖叫。不計入總錦標，但參加的人很多。",
    meta: "6/1（一）23:59　清大大草坪",
    image: "/images/side/lawn-scream.jpg",
    alt: "夜間草坪上聚集的人群，中間有大猩猩與恐龍充氣裝",
    href: "/activities/lawn-scream",
    internal: true,
  },
  {
    tag: "獎項",
    title: "卷酥獎",
    body: "勉勵成績最爛的同學。",
    meta: "日期待補",
    image: "/images/side/juan-su.jpg",
    alt: "卷酥獎宣傳圖",
    href: siteConfig.instagramUrl,
    internal: false,
    pending: true,
  },
  {
    tag: "抽獎",
    title: "Sony WH-CH520",
    body: "轉發限動就可以抽。竹梅賽，舉辦最不廢話的抽獎。",
    meta: "日期待補",
    image: "/images/side/sony-draw.jpg",
    alt: "耳機抽獎宣傳圖",
    href: siteConfig.instagramUrl,
    internal: false,
    pending: true,
  },
];

export function SideExtras() {
  return (
    <section className="section-space bg-ink">
      <div className="container-main">
        <p className="mb-2.5 font-mono-ui text-xs tracking-[0.2em] text-brand-yellow">
          03 ／ 周邊與其他
        </p>
        <h2 className="section-title mb-3">
          不算<span className="mark">比賽</span>的部分
        </h2>
        <p className="mb-9 max-w-[44em] text-[15px] text-muted">
          周邊、抽獎，以及一個已經辦到第二屆、但不算在總錦標裡的活動。
        </p>
        <div className="grid gap-0.5 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const media = (
              <div className="photo-frame mb-1 aspect-square">
                <img
                  src={withBasePath(item.image)}
                  alt={item.alt}
                  className="h-full w-full object-cover"
                />
              </div>
            );
            const body = (
              <>
                {media}
                <p className="font-mono-ui text-[11px] tracking-[0.1em] text-brand-yellow">
                  {item.tag}
                </p>
                <h3 className="m-0 text-xl font-black">{item.title}</h3>
                <p
                  className="m-0 text-sm text-muted"
                  {...(item.keepOrder ? { "data-keep-order": "" } : {})}
                >
                  {item.body}
                </p>
                <p
                  className={`m-0 font-mono-ui text-[11px] tracking-[0.08em] ${
                    item.pending ? "text-brand-yellow" : "text-brand-yellow"
                  }`}
                >
                  {item.meta}
                </p>
              </>
            );
            const className =
              "flex flex-col gap-2.5 bg-dark-gray p-6 text-chalk no-underline transition hover:bg-[#242424]";
            return item.internal ? (
              <Link key={item.title} href={appPath(item.href)} className={className}>
                {body}
              </Link>
            ) : (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {body}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
