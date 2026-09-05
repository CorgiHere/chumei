import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { NewsExplorer } from "@/components/NewsExplorer";
import { newsPosts } from "@/data/news";
import { siteConfig } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "最新消息｜清交竹梅賽公告賽果與報名",
  description:
    "2026 竹梅賽最新公告：清華大學、交通大學／陽明交通大學（清大／交大、NTHU／NYCU／NCTU）清交活動報名、規則更新、總錦標賽果與物資領取通知。",
  path: "/news",
});

export default function NewsPage() {
  return (
    <div className="bg-ink section-space text-chalk">
      <div className="container-main">
        <PageIntro
          eyebrow={siteConfig.yearName}
          title="最新消息"
          subtitle="報名公告、規則更新、場地異動、結果與物資領取——正式資訊以本站為準，IG 有更多現場花絮。"
          dark
        />
        <NewsExplorer posts={newsPosts} dark />
        <p className="mt-10 text-center text-sm text-muted">
          想看即時花絮？{" "}
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link font-bold"
          >
            Instagram @chumei2026
          </a>
          {" · "}
          <a
            href={siteConfig.linktreeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link font-bold"
          >
            Linktree
          </a>
        </p>
      </div>
    </div>
  );
}
