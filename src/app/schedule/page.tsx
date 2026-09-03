import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ScheduleExplorer } from "@/components/ScheduleExplorer";
import { activities } from "@/data/activities";
import { siteConfig } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "賽程｜清大交大竹梅賽日期地點時間表",
  description:
    "2026 竹梅賽完整賽程表：清大（NTHU）、交大（NYCU／NCTU）清交活動日期、時間、地點與報名狀態。快速掌握下一場荒謬校際競技。",
  path: "/schedule",
});

export default function SchedulePage() {
  return (
    <div className="bg-ink py-12 text-chalk">
      <div className="container-main">
        <PageIntro
          eyebrow={siteConfig.yearName}
          title="賽程"
          subtitle="正賽已結束。此頁是完整時間軸：日期、校區與地圖。活動規則與賽果請看活動總覽。"
          dark
        />
        <ScheduleExplorer activities={activities} dark />
      </div>
    </div>
  );
}
