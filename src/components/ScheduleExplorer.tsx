"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Activity } from "@/types";
import { FilterChips } from "@/components/FilterChips";
import { StatusBadge } from "@/components/StatusBadge";
import { isSameDay, isThisWeek } from "@/lib/activity-filters";
import {
  getCalendarUrl,
  getCampusLabel,
  appPath,
  cn,
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
  dark?: boolean;
};

export function ScheduleExplorer({ activities, dark = false }: ScheduleExplorerProps) {
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
          dark={dark}
        />
      </div>

      {filtered.length === 0 ? (
        <div
          className={cn(
            "border-2 border-dashed p-10 text-center",
            dark
              ? "border-white/20 bg-dark-gray"
              : "border-ink/20 bg-white",
          )}
        >
          <p className="font-bold">這個時段沒有活動。</p>
          <p className="mt-2 text-sm text-muted">
            改看「全部」或「即將到來」試試。
          </p>
        </div>
      ) : mode === "timeline" ? (
        <ol className={cn("relative space-y-0 pl-6", dark ? "border-l-4 border-brand-yellow" : "border-l-4 border-black")}>
          {filtered.map((activity, index) => (
            <li key={activity.id} className="relative pb-10 last:pb-0">
              <span
                className={cn(
                  "absolute left-[-1.9rem] top-1 flex h-6 w-6 items-center justify-center text-xs font-black",
                  dark
                    ? "border-2 border-brand-yellow bg-ink text-brand-yellow"
                    : "rounded-full border-2 border-black bg-brand-yellow",
                )}
                aria-hidden
              >
                {index + 1}
              </span>
              <ScheduleItem activity={activity} dark={dark} />
            </li>
          ))}
        </ol>
      ) : (
        <div className="space-y-4">
          {filtered.map((activity) => (
            <ScheduleItem key={activity.id} activity={activity} dark={dark} />
          ))}
        </div>
      )}
    </div>
  );
}

function ScheduleItem({ activity, dark = false }: { activity: Activity; dark?: boolean }) {
  const campus = activity.venue.campus;
  const rail =
    campus === "NTHU"
      ? "bg-nthu"
      : campus === "NYCU"
        ? "bg-nycu"
        : "bg-brand-yellow";
  const campusTone =
    campus === "NTHU"
      ? "text-nthu"
      : campus === "NYCU"
        ? "text-nycu"
        : "text-muted";
  const start = new Date(activity.startAt);
  const mm = String(start.getMonth() + 1).padStart(2, "0");
  const dd = String(start.getDate()).padStart(2, "0");
  const hh = String(start.getHours()).padStart(2, "0");
  const min = String(start.getMinutes()).padStart(2, "0");
  const wd = ["日", "一", "二", "三", "四", "五", "六"][start.getDay()];
  const place = campus === "OTHER" ? null : getCampusLabel(campus);

  return (
    <article
      className={cn(
        "relative overflow-hidden border",
        dark ? "border-white/15 bg-dark-gray" : "border-ink/10 bg-white",
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-1.5", rail)} aria-hidden />
      <div className="flex flex-col gap-4 py-5 pl-6 pr-5 md:flex-row md:items-stretch md:justify-between md:pl-7">
        <div className="flex min-w-0 flex-1 gap-4 md:gap-5">
          <time
            dateTime={activity.startAt}
            className="flex h-fit shrink-0 flex-col bg-ink px-3 py-2 text-center text-chalk"
          >
            <span className="font-num text-2xl font-bold leading-none text-brand-yellow">
              {mm}.{dd}
            </span>
            <span className="mt-1 font-mono-ui text-[10px] tracking-[0.12em] text-chalk/70">
              （{wd}）{hh}:{min}
            </span>
          </time>
          <div className="min-w-0">
            <h2 className="text-xl font-black leading-snug">
              <Link
                href={appPath(`/activities/${activity.slug}`)}
                className="hover:text-brand-yellow"
              >
                {activity.title}
              </Link>
            </h2>
            {activity.tagline && (
              <p className="mt-1 text-sm text-muted">{activity.tagline}</p>
            )}
            <p className="mt-2 text-sm font-medium">
              {activity.venue.name}
              {place && (
                <span className={cn("ml-1.5 font-mono-ui text-[11px] tracking-[0.12em]", campusTone)}>
                  · {place}
                </span>
              )}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={activity.status} />
              {activity.isScored ? (
                <span className="border border-ink bg-brand-yellow px-2 py-0.5 font-mono-ui text-[11px] font-semibold tracking-[0.08em] text-ink">
                  計分項目
                </span>
              ) : (
                <span className="border border-dashed border-ink/30 px-2 py-0.5 font-mono-ui text-[11px] font-semibold tracking-[0.08em] text-muted">
                  非計分
                </span>
              )}
              {activity.audienceNotes?.[0] && (
                <span className="text-xs text-muted">{activity.audienceNotes[0]}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 md:flex-col md:items-stretch">
          <Link
            href={appPath(`/activities/${activity.slug}`)}
            className="btn-primary px-5 text-sm"
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
            className={cn("px-5 text-sm", dark ? "btn-dark-outline" : "btn-outline")}
          >
            加入行事曆
          </a>
          {activity.venue.mapUrl && (
            <a
              href={activity.venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center border-2 border-nycu px-5 font-mono-ui text-sm font-semibold tracking-widest text-nycu hover:bg-nycu hover:text-white"
            >
              地圖
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
