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

export function formatDate(iso: string, short = false): string {
  const date = new Date(iso);
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const wd = weekdays[date.getDay()];

  if (short) {
    return `${m}/${d}（${wd}）${h}:${min}`;
  }
  return `${y} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日（${wd}）${h}:${min}`;
}

export function formatDateOnly(iso: string): string {
  const date = new Date(iso);
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${m}/${d}（${weekdays[date.getDay()]}）`;
}

export function getCampusLabel(campus: "NTHU" | "NYCU" | "OTHER"): string {
  switch (campus) {
    case "NTHU":
      return "清華";
    case "NYCU":
      return "陽明交大";
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
    details: "2026 丙午竹梅賽官方活動",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

export function withBasePath(path: string): string {
  const base = getBasePath();
  if (!base) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
