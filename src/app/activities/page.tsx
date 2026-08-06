import type { Metadata } from "next";
import { ActivityCard } from "@/components/ActivityCard";
import { SectionHeader } from "@/components/SectionHeader";
import { activities } from "@/data/activities";

export const metadata: Metadata = {
  title: "活動總覽",
  description: "查看 2026 丙午竹梅賽全部活動、報名狀態與詳細資訊。",
};

export default function ActivitiesPage() {
  const sorted = [...activities].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );

  return (
    <div className="grid-bg py-12">
      <div className="container-main">
        <SectionHeader
          title="活動總覽"
          subtitle="所有當屆活動，依日期排序"
        />
        <div className="grid gap-6">
          {sorted.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
}
