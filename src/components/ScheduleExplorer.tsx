"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Activity } from "@/types";
import { FilterChips } from "@/components/FilterChips";
import { StatusBadge } from "@/components/StatusBadge";
import { isSameDay, isThisWeek } from "@/lib/activity-filters";
import {
  formatDate,
  getCalendarUrl,
} from "@/lib/utils";

type ScheduleMode = "all" | "today" | "week" | "upcoming" | "timeline";

const MODES = [
  { id: "all", label: "全部" },
  { id: "today", label: "今日" },
  { id: "week", label: "本週" },
  { id: "upcoming", label: "即將到來" },
  { id: "timeline", label: "時間軸" },
];

type ScheduleExplorerProps = {
  activities: Activity[];
};

export function ScheduleExplorer({ activities }: ScheduleExplorerProps) {
  const [mode, setMode] = useState<ScheduleMode>("all");

  const sorted = useMemo(
    () =>
      [...activities].sort(
        (a, b) =>
          new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
      ),
    [activities],
  );

  const filtered = useMemo(() => {
    const now = new Date();
    switch (mode) {
      case "today":
        return sorted.filter((a) => isSameDay(a.startAt, now));
      case "week":
        return sorted.filter((a) => isThisWeek(a.startAt, now));
      case "upcoming":
        return sorted.filter(
          (a) =>
            new Date(a.startAt) >= now &&
            a.status !== "finished" &&
            a.status !== "cancelled",
        );
      default:
        return sorted;
    }
  }, [sorted, mode]);

  return (
    <div>
      <div className="mb-8">
        <FilterChips
          label="顯示模式"
          options={MODES}
          value={mode}
          onChange={(id) => setMode(id as ScheduleMode)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-muted bg-white p-10 text-center">
          <p className="font-bold">這個時段沒有活動。</p>
          <p className="mt-2 text-sm text-muted">
            改看「全部」或「即將到來」試試。
          </p>
        </div>
      ) : mode === "timeline" ? (
        <ol className="relative space-y-0 border-l-4 border-black pl-6">
          {filtered.map((activity, index) => (
            <li key={activity.id} className="relative pb-10 last:pb-0">
              <span
                className="absolute left-[-1.9rem] top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black bg-brand-yellow text-xs font-black"
                aria-hidden
              >
                {index + 1}
              </span>
              <ScheduleItem activity={activity} />
            </li>
          ))}
        </ol>
      ) : (
        <div className="space-y-4">
          {filtered.map((activity) => (
            <ScheduleItem key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}

function ScheduleItem({ activity }: { activity: Activity }) {
  return (
    <article className="card p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <time
            dateTime={activity.startAt}
            className="text-sm font-bold text-brand-blue"
          >
            {formatDate(activity.startAt)}
          </time>
          <h2 className="mt-1 text-xl font-black">
            <Link
              href={`/activities/${activity.slug}`}
              className="hover:text-brand-blue"
            >
              {activity.title}
            </Link>
          </h2>
          {activity.tagline && (
            <p className="mt-1 text-sm text-muted">
              {activity.tagline}
            </p>
          )}
          <p className="mt-2 text-sm font-medium">
            {activity.venue.name}
            {activity.venue.campus !== "OTHER" && (
              <span className="text-muted">
                {" "}
                · {activity.venue.campus === "NTHU" ? "清華" : activity.venue.campus === "NYCU" ? "交大" : "其他"}
              </span>
            )}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={activity.status} />
            {activity.isScored ? (
              <span className="rounded-full border border-black px-2 py-0.5 text-xs font-bold">
                計分項目
              </span>
            ) : (
              <span className="rounded-full border border-dashed border-muted px-2 py-0.5 text-xs font-bold text-muted">
                非計分
              </span>
            )}
            {activity.audienceNotes?.[0] && (
              <span className="text-xs text-muted">
                {activity.audienceNotes[0]}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/activities/${activity.slug}`}
            className="btn-primary text-sm"
          >
            詳情
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
              地圖
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
