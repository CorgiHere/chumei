import type { ActivityStatus, NewsCategory } from "@/types";

const STATUS_LABELS: Record<
  ActivityStatus,
  { formal: string; fun?: string }
> = {
  draft: { formal: "籌備中" },
  announced: { formal: "已公告", fun: "快來了快來了" },
  registration_open: { formal: "報名中", fun: "還來得及" },
  registration_closing: { formal: "即將截止", fun: "最後召集" },
  waitlist: { formal: "候補中", fun: "還有一線生機" },
  full: { formal: "已額滿", fun: "恐龍已全數孵化" },
  upcoming: { formal: "即將開始", fun: "倒數中" },
  ongoing: { formal: "進行中", fun: "正在胡鬧" },
  finished: { formal: "已結束", fun: "本場荒謬完賽" },
  postponed: { formal: "延期", fun: "時間改了別白跑" },
  cancelled: { formal: "取消", fun: "今年先放過大家" },
};

const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  important: "重要公告",
  registration: "報名",
  rules: "規則",
  change: "活動異動",
  result: "結果",
  pickup: "物資領取",
  partner: "合作",
  behind_the_scenes: "幕後",
};

export function getStatusLabel(status: ActivityStatus): {
  formal: string;
  fun?: string;
} {
  return STATUS_LABELS[status];
}

export function getNewsCategoryLabel(category: NewsCategory): string {
  return NEWS_CATEGORY_LABELS[category];
}

const WEEKDAY_EN: Record<string, string> = {
  Sun: "日",
  Mon: "一",
  Tue: "二",
  Wed: "三",
  Thu: "四",
  Fri: "五",
  Sat: "六",
};

function taipeiParts(iso: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  let hour = get("hour");
  if (hour === "24") hour = "00";
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour,
    minute: get("minute"),
    weekday: WEEKDAY_EN[get("weekday")] ?? get("weekday"),
  };
}

export function formatDate(iso: string, short = false): string {
  const t = taipeiParts(iso);
  const hideTime = t.hour === "00" && t.minute === "00";
  if (short) {
    const dateLabel = `${t.month}/${t.day}（${t.weekday}）`;
    return hideTime ? dateLabel : `${dateLabel}${t.hour}:${t.minute}`;
  }
  const dateLabel = `${t.year} 年 ${Number(t.month)} 月 ${Number(t.day)} 日（${t.weekday}）`;
  return hideTime ? dateLabel : `${dateLabel}${t.hour}:${t.minute}`;
}

export function formatDateOnly(iso: string): string {
  const t = taipeiParts(iso);
  return `${t.month}/${t.day}（${t.weekday}）`;
}

export function getCampusLabel(campus: "NTHU" | "NYCU" | "OTHER"): string {
  switch (campus) {
    case "NTHU":
      return "清大";
    case "NYCU":
      return "交大";
    default:
      return "其他";
  }
}

export function getCalendarUrl(
  title: string,
  startAt: string,
  location: string,
): string {
  const start = new Date(startAt);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    location,
    details: "2026 竹梅賽官方活動",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

/** Prefix static asset URLs (Image/img). Do NOT use on next/link href — Next already applies basePath. */
export function withBasePath(path: string): string {
  const base = getBasePath();
  if (!base) return path;
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("//")) {
    return path;
  }
  // Avoid double-prefix if already applied
  if (path === base || path.startsWith(`${base}/`)) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Internal app hrefs with trailing slash (required by next.config trailingSlash). */
export function appPath(path: string): string {
  if (!path.startsWith("/")) return path;
  const [pathname, hash] = path.split("#");
  const slashed =
    pathname === "/" || pathname.endsWith("/") ? pathname : `${pathname}/`;
  return hash ? `${slashed}#${hash}` : slashed;
}
