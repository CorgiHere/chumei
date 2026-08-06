import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { siteConfig } from "@/data/site";
import { withBasePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "加入竹梅",
  description: "加入竹梅籌備團隊、提案新活動、志工招募與贊助合作。",
};

const joinOptions = [
  {
    title: "加入籌備團隊",
    desc: "參與活動規劃、宣傳與現場執行，一起胡鬧也要一本正經。",
  },
  {
    title: "提案新活動",
    desc: "有荒謬但可行的點子？歡迎提案，我們認真評估（真的）。",
  },
  {
    title: "志工招募",
    desc: "活動日現場支援、攝影、裁判助理等。",
  },
  {
    title: "贊助合作",
    desc: "提供資源或曝光合作，詳見合作夥伴頁面。",
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
              <p className="mt-2 text-sm text-[var(--color-gray)]">{opt.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={siteConfig.linktreeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            前往 Linktree 了解更多
          </a>
          <p className="mt-4">
            或直接{" "}
            <Link
              href={withBasePath("/contact")}
              className="font-bold text-[var(--color-brand-blue)]"
            >
              聯絡我們
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
