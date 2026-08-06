import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { NewsExplorer } from "@/components/NewsExplorer";
import { newsPosts } from "@/data/news";
import { siteConfig } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "最新消息",
  description:
    "2026 竹梅賽最新公告、報名資訊、規則更新、賽果與物資領取通知。",
  path: "/news",
});

export default function NewsPage() {
  return (
    <div className="grid-bg py-12">
      <div className="container-main">
        <PageIntro
          eyebrow={siteConfig.yearName}
          title="最新消息"
          subtitle="報名公告、規則更新、場地異動、結果與物資領取——正式資訊以本站為準，IG 有更多現場花絮。"
        />
        <NewsExplorer posts={newsPosts} />
        <p className="mt-10 text-center text-sm text-muted">
          想看即時花絮？{" "}
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-blue"
          >
            Instagram @chumei2026
          </a>
          {" · "}
          <a
            href={siteConfig.linktreeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-blue"
          >
            Linktree
          </a>
        </p>
      </div>
    </div>
  );
}
