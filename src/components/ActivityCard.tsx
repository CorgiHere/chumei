import Link from "next/link";
import type { Activity } from "@/types";
import { formatDateOnly, withBasePath, cn, appPath } from "@/lib/utils";

type ActivityCardProps = {
  activity: Activity;
  variant?: "featured" | "grid" | "list";
  reverse?: boolean;
  indexOverride?: number;
};

const PRIZES: Record<string, string> = {
  "dinosaur-race": "恐龍裝、小徑T",
  "alcohol-calculus": "現金、微積分課本",
  "office-chair-racing": "冠軍：I-ROCKS T02 PLUS 辦公椅（市售 9,999 元）",
  "japanese-mahjong": "冠軍：全新日本麻將（榮和 SMART）／前四名：小徑T",
  "taiwan-mahjong": "首獎：電動麻將桌",
  "barcode-racing": "前八名：小徑T／第一名「最佳員工獎」：八小時基本時薪",
  "two-school-rps": "東京單程機票",
};

const GHOST: Record<string, string> = {
  "dinosaur-race": "報名額滿",
  "alcohol-calculus": "預計續辦",
  "japanese-mahjong": "免報名費",
};

function feeLabel(activity: Activity) {
  if (activity.registrationFee === 0) return "免報名費";
  if (activity.registrationFee == null) return "待補";
  return `${activity.registrationFee} 元／人`;
}

function winnerLabel(activity: Activity) {
  if (activity.result?.winner === "NTHU") return "清華 勝";
  if (activity.result?.winner === "NYCU") return "交通 勝";
  return null;
}

function Photo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="absolute inset-4 bg-[#F2F0EA] p-2 md:inset-[26px]">
      <img
        src={withBasePath(src)}
        alt={alt}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export function ActivityCard({
  activity,
  variant = "list",
  reverse = false,
  indexOverride,
}: ActivityCardProps) {
  const no = indexOverride ?? activity.index;
  const winner = winnerLabel(activity);
  const ghost = GHOST[activity.slug];
  const prize = PRIZES[activity.slug];
  const sub = [activity.tagline, activity.subtitle].filter(Boolean).join("　／　");
  const fee = feeLabel(activity);
  const feePending = activity.registrationFee == null;
  const src = activity.cardImage ?? activity.heroImage;

  if (variant === "grid") {
    return (
      <article className="flex h-full flex-col bg-dark-gray text-chalk">
        <div className="relative aspect-square">
          <Photo src={src} alt={`${activity.title}主視覺`} />
        </div>
        <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
          {activity.index != null && (
            <p className="mb-1 font-mono-ui text-xs tracking-[0.14em] text-muted">
              {String(activity.index).padStart(2, "0")}
            </p>
          )}
          <h3 className="text-xl font-black">{activity.title}</h3>
          <p className="mt-2 text-sm text-[#cfccc4]">{formatDateOnly(activity.startAt)}</p>
          <Link
            href={appPath(`/activities/${activity.slug}`)}
            className="text-link mt-auto pt-4"
          >
            查看詳情 →
          </Link>
        </div>
      </article>
    );
  }

  return (
    <Link
      href={appPath(`/activities/${activity.slug}`)}
      className="grid bg-dark-gray text-chalk no-underline md:grid-cols-[1.05fr_1fr]"
    >
      <div
        className={cn(
          "relative aspect-video md:aspect-auto md:min-h-full",
          reverse && "md:order-2",
        )}
      >
        <Photo src={src} alt={`${activity.title}主視覺`} />
      </div>
      <div className="p-6 md:p-[30px]">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          {no != null && (
            <span className="font-mono-ui text-xs tracking-[0.14em] text-muted">
              {String(no).padStart(2, "0")}
            </span>
          )}
          {winner && (
            <span className="bg-brand-yellow px-2.5 py-0.5 font-mono-ui text-[11px] font-semibold tracking-[0.1em] text-ink">
              {winner}
            </span>
          )}
          {ghost && (
            <span className="border border-brand-yellow px-2.5 py-0.5 font-mono-ui text-[11px] font-semibold tracking-[0.1em] text-brand-yellow">
              {ghost}
            </span>
          )}
        </div>
        <h3 className="mb-1.5 text-[clamp(23px,2.7vw,32px)] font-black leading-snug">
          {activity.title}
        </h3>
        {sub && (
          <p className="mb-[18px] font-mono-ui text-xs tracking-[0.04em] text-muted">
            {sub}
          </p>
        )}
        <dl className="mt-0 grid grid-cols-[64px_1fr] gap-x-3.5 gap-y-1.5 border-t border-white/15 pt-4 text-sm">
          <dt className="pt-0.5 font-mono-ui text-[11px] tracking-[0.1em] text-muted">
            日期
          </dt>
          <dd className="m-0 text-[#cfccc4]">{formatDateOnly(activity.startAt)}</dd>
          <dt className="pt-0.5 font-mono-ui text-[11px] tracking-[0.1em] text-muted">
            地點
          </dt>
          <dd className="m-0 text-[#cfccc4]">{activity.venue.name}</dd>
          <dt className="pt-0.5 font-mono-ui text-[11px] tracking-[0.1em] text-muted">
            費用
          </dt>
          <dd className={cn("m-0", feePending ? "font-mono-ui text-xs text-brand-yellow" : "text-[#cfccc4]")}>
            {fee}
          </dd>
          {prize && (
            <>
              <dt className="pt-0.5 font-mono-ui text-[11px] tracking-[0.1em] text-muted">
                獎品
              </dt>
              <dd className="m-0 text-[#cfccc4]">{prize}</dd>
            </>
          )}
        </dl>
      </div>
    </Link>
  );
}
