import type { Metadata } from "next";
import { PageIntro } from "@/components/PageIntro";
import { ScheduleExplorer } from "@/components/ScheduleExplorer";
import { activities } from "@/data/activities";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "賽程",
  description: "2026 竹梅賽完整賽程表，含日期、時間、地點與報名狀態。",
};

export default function SchedulePage() {
  return (
    <div className="grid-bg py-12">
      <div className="container-main">
        <PageIntro
          eyebrow={siteConfig.yearName}
          title="賽程"
          subtitle="依今日、本週、即將到來或時間軸瀏覽活動。可加入行事曆、開啟地圖。"
        />
        <ScheduleExplorer activities={activities} />
      </div>
    </div>
  );
}
