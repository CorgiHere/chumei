import type { Activity, ActivityStatus } from "@/types";

const OPEN_STATUSES: ActivityStatus[] = [
  "registration_open",
  "registration_closing",
  "waitlist",
];

export type ActivityFilterId =
  | "all"
  | "registration"
  | "upcoming"
  | "ongoing"
  | "finished"
  | "disrupted"
  | "scored"
  | "unscored"
  | "individual"
  | "team"
  | "online"
  | "offline";

export function matchesActivityFilter(
  activity: Activity,
  filter: ActivityFilterId,
): boolean {
  switch (filter) {
    case "all":
      return true;
    case "registration":
      return OPEN_STATUSES.includes(activity.status);
    case "upcoming":
      return (
        activity.status === "upcoming" ||
        activity.status === "announced" ||
        (activity.status === "registration_open" &&
          new Date(activity.startAt) > new Date())
      );
    case "ongoing":
      return activity.status === "ongoing";
    case "finished":
      return activity.status === "finished";
    case "disrupted":
      return (
        activity.status === "postponed" || activity.status === "cancelled"
      );
    case "scored":
      return activity.isScored;
    case "unscored":
      return !activity.isScored;
    case "individual":
      return activity.format === "individual";
    case "team":
      return activity.format === "team";
    case "online":
      return activity.categories.includes("線上活動") || activity.venue.id === "online";
    case "offline":
      return (
        activity.categories.includes("實體活動") || activity.venue.id !== "online"
      );
    default:
      return true;
  }
}

export function searchActivities(
  activities: Activity[],
  query: string,
): Activity[] {
  const q = query.trim().toLowerCase();
  if (!q) return activities;
  return activities.filter((a) => {
    const hay = [
      a.title,
      a.subtitle,
      a.tagline,
      a.description,
      a.venue.name,
      ...a.categories,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function isSameDay(iso: string, date = new Date()): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
  );
}

export function isThisWeek(iso: string, date = new Date()): boolean {
  const d = new Date(iso);
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + mondayOffset);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return d >= start && d < end;
}
