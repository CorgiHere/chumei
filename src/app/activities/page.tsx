import type { Metadata } from "next";
import { ActivitiesExplorer } from "@/components/ActivitiesExplorer";
import { PageIntro } from "@/components/PageIntro";
import { activities } from "@/data/activities";
import { siteConfig } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "活動總覽｜清大交大清交竹梅賽全部賽事",
  description:
    "搜尋、篩選 2026 竹梅賽（Chu Mei）全部活動：清華大學（清大／NTHU）與交通大學、陽明交通大學（交大／NYCU／NCTU）清交荒謬競技。恐龍賽跑、酒精微積分、辦公椅、麻將、刷條碼、兩校憑拳等報名狀態與詳情一次找齊。",
  path: "/activities",
});

export default function ActivitiesPage() {
  return (
    <div className="grid-bg py-12">
      <div className="container-main">
        <PageIntro
          eyebrow={`${siteConfig.yearName}`}
          title="活動總覽"
          subtitle="搜尋、篩選並查看全部當屆活動。報名中、計分項目、線上實體一次找齊。"
        />
        <ActivitiesExplorer activities={activities} />
      </div>
    </div>
  );
}
