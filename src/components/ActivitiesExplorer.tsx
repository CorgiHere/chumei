"use client";

import { useMemo, useState } from "react";
import type { Activity } from "@/types";
import { ActivityCard } from "@/components/ActivityCard";
import { FilterChips } from "@/components/FilterChips";
import {
  matchesActivityFilter,
  searchActivities,
  type ActivityFilterId,
} from "@/lib/activity-filters";

const FILTERS: { id: ActivityFilterId; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "registration", label: "報名中" },
  { id: "upcoming", label: "即將開始" },
  { id: "ongoing", label: "進行中" },
  { id: "finished", label: "已結束" },
  { id: "disrupted", label: "延期或取消" },
  { id: "scored", label: "計分項目" },
  { id: "unscored", label: "非計分項目" },
  { id: "individual", label: "個人賽" },
  { id: "team", label: "團體賽" },
  { id: "online", label: "線上活動" },
  { id: "offline", label: "實體活動" },
];

type ActivitiesExplorerProps = {
  activities: Activity[];
};

export function ActivitiesExplorer({ activities }: ActivitiesExplorerProps) {
  const [filter, setFilter] = useState<ActivityFilterId>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const byFilter = activities.filter((a) => matchesActivityFilter(a, filter));
    return searchActivities(byFilter, query).sort(
      (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
    );
  }, [activities, filter, query]);

  return (
    <div>
      <div className="card mb-8 space-y-4 p-5">
        <label className="block">
          <span className="mb-2 block text-sm font-bold">搜尋活動</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="活動名稱、地點、關鍵字…"
            className="w-full border-2 border-ink bg-white px-4 py-3 text-base text-ink outline-none focus:border-brand-yellow"
          />
        </label>
        <FilterChips
          label="篩選"
          options={FILTERS}
          value={filter}
          onChange={(id) => setFilter(id as ActivityFilterId)}
        />
      </div>

      <p className="mb-4 text-sm font-bold text-muted">
        共 {filtered.length} 場活動
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-muted bg-white p-10 text-center">
          <p className="font-bold">找不到符合條件的活動。</p>
          <p className="mt-2 text-sm text-muted">
            試著清空搜尋或改選「全部」。
          </p>
          <button
            type="button"
            className="btn-outline mt-4 text-sm"
            onClick={() => {
              setFilter("all");
              setQuery("");
            }}
          >
            重設篩選
          </button>
        </div>
      ) : (
        <div className="grid gap-0.5">
          {filtered.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}
