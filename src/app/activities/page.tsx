import type { Metadata } from "next";
import Link from "next/link";
import { ActivitiesExplorer } from "@/components/ActivitiesExplorer";
import { PageIntro } from "@/components/PageIntro";
import { activities } from "@/data/activities";
import { siteConfig } from "@/data/site";
import { appPath } from "@/lib/utils";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "活動總覽｜清大交大清交竹梅賽全部賽事",
  description:
    "搜尋、篩選 2026 竹梅賽（Chu Mei）全部活動：清華大學（清大／NTHU）與交通大學、陽明交通大學（交大／NYCU／NCTU）清交荒謬競技。恐龍賽跑、酒精微積分、辦公椅、麻將、刷條碼、兩校憑拳等報名狀態與詳情一次找齊。",
  path: "/activities",
});

export default function ActivitiesPage() {
  return (
    <div className="bg-ink section-space text-chalk">
      <div className="container-main">
        <PageIntro
          eyebrow={`${siteConfig.yearName}`}
          title="活動總覽"
          subtitle="搜尋、篩選全部當屆活動。計分與非計分、線上與實體一次找齊。"
          dark
        />
        <p className="mb-8 -mt-4 text-sm text-muted">
          要對日期與地圖，請看{" "}
          <Link href={appPath("/schedule")} className="text-link">
            賽程
          </Link>
          。
        </p>
        <ActivitiesExplorer activities={activities} dark />
      </div>
    </div>
  );
}
