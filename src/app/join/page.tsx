import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { siteConfig } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "加入竹梅",
  description:
    "加入竹梅籌備團隊、提案新活動、志工招募、週邊預購與贊助合作。清交學生一起一本正經地胡鬧。",
  path: "/join",
});

const joinOptions = [
  {
    title: "加入籌備團隊",
    desc: "參與活動規劃、宣傳與現場執行，一起胡鬧也要一本正經。",
    href: siteConfig.linktreeUrl,
    cta: "前往 Linktree",
  },
  {
    title: "小徑 T 預購",
    desc: "竹梅週邊小徑 T 預購表單開放中，尺寸與領取方式見表單說明。",
    href: siteConfig.merchFormUrl,
    cta: "立即預購",
  },
  {
    title: "提案新活動",
    desc: "有荒謬但可行的點子？歡迎提案，我們認真評估（真的）。",
    href: siteConfig.instagramUrl,
    cta: "到 IG 留言／私訊",
  },
  {
    title: "志工招募",
    desc: "活動日現場支援、攝影、裁判助理等。最新招募請追蹤社群公告。",
    href: siteConfig.instagramUrl,
    cta: "追蹤最新招募",
  },
  {
    title: "贊助合作",
    desc: "提供資源或曝光合作，詳見合作夥伴頁面。",
    href: "/partners",
    cta: "查看合作資訊",
    internal: true,
  },
];

export default function JoinPage() {
  return (
    <div className="grid-bg py-12">
      <div className="container-main max-w-3xl">
        <SectionHeader title="加入竹梅" subtitle="一起辦荒謬的事" />

        <div className="space-y-4">
          {joinOptions.map((opt) => (
            <div key={opt.title} className="card p-5">
              <h2 className="text-lg font-black">{opt.title}</h2>
              <p className="mt-2 text-sm text-muted">{opt.desc}</p>
              {"internal" in opt && opt.internal ? (
                <Link
                  href={opt.href}
                  className="btn-outline mt-4 inline-flex text-sm"
                >
                  {opt.cta}
                </Link>
              ) : (
                <a
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-4 inline-flex text-sm"
                >
                  {opt.cta}
                </a>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted">
            或直接{" "}
            <Link
              href="/contact"
              className="font-bold text-brand-blue"
            >
              聯絡我們
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
