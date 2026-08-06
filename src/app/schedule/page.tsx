import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { activities } from "@/data/activities";
import { formatDate, getCalendarUrl, withBasePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "賽程",
  description: "2026 丙午竹梅賽完整賽程表，含日期、時間、地點與報名狀態。",
};

export default function SchedulePage() {
  const sorted = [...activities].sort(
    (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  );

  return (
    <div className="grid-bg py-12">
      <div className="container-main">
        <SectionHeader title="賽程" subtitle="全部活動時間表" />

        <div className="space-y-4">
          {sorted.map((activity) => (
            <article key={activity.id} className="card p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <time
                    dateTime={activity.startAt}
                    className="text-sm font-bold text-[var(--color-brand-blue)]"
                  >
                    {formatDate(activity.startAt)}
                  </time>
                  <h2 className="mt-1 text-xl font-black">
                    <Link
                      href={withBasePath(`/activities/${activity.slug}`)}
                      className="hover:text-[var(--color-brand-blue)]"
                    >
                      {activity.title}
                    </Link>
                  </h2>
                  <p className="text-sm">{activity.venue.name}</p>
                  <StatusBadge status={activity.status} className="mt-2" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={getCalendarUrl(
                      activity.title,
                      activity.startAt,
                      activity.venue.name,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline text-sm"
                  >
                    加入行事曆
                  </a>
                  {activity.venue.mapUrl && (
                    <a
                      href={activity.venue.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline text-sm"
                    >
                      地圖
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
