import type { Metadata } from "next";
import { ActivitiesExplorer } from "@/components/ActivitiesExplorer";
import { PageIntro } from "@/components/PageIntro";
import { activities } from "@/data/activities";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "活動總覽",
  description: "查看 2026 竹梅賽全部活動、報名狀態與詳細資訊。",
};

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
