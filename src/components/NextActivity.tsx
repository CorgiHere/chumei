import Link from "next/link";
import type { Activity } from "@/types";
import { StatusBadge } from "./StatusBadge";
import {
  formatDate,
  getCalendarUrl,
} from "@/lib/utils";

type NextActivityProps = {
  activity: Activity;
};

export function NextActivity({ activity }: NextActivityProps) {
  return (
    <section className="card p-6">
      <p className="mb-2 text-sm font-bold text-brand-blue">
        下一場活動
      </p>
      <h2 className="text-2xl font-black">{activity.title}</h2>
      {activity.tagline && (
        <p className="mt-1 text-muted">{activity.tagline}</p>
      )}
      <div className="mt-4 space-y-2 text-sm">
        <p>
          <span className="font-bold">日期：</span>
          {formatDate(activity.startAt)}
        </p>
        <p>
          <span className="font-bold">地點：</span>
          {activity.venue.name}
        </p>
        <StatusBadge status={activity.status} />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/activities/${activity.slug}`}
          className="btn-primary text-sm"
        >
          查看活動
        </Link>
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
            開啟地圖
          </a>
        )}
        {activity.categories.includes("線上活動") &&
          activity.registrationUrl && (
            <a
              href={activity.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm"
            >
              立即遊玩
            </a>
          )}
      </div>
    </section>
  );
}
