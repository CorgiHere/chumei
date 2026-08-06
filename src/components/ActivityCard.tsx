import Link from "next/link";
import Image from "next/image";
import type { Activity } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { formatDateOnly, withBasePath, cn } from "@/lib/utils";

type ActivityCardProps = {
  activity: Activity;
  variant?: "featured" | "grid" | "list";
};

export function ActivityCard({
  activity,
  variant = "list",
}: ActivityCardProps) {
  const isOnline = activity.categories.includes("線上活動");
  const isRegistrationOpen =
    activity.status === "registration_open" ||
    activity.status === "registration_closing";

  if (variant === "featured") {
    return (
      <article className="group card overflow-hidden border-brand-yellow border-4">
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative aspect-video overflow-hidden bg-light-gray md:aspect-auto md:min-h-[280px]">
            <Image
              src={withBasePath(activity.cardImage ?? activity.heroImage)}
              alt={`${activity.title}主視覺`}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
          <div className="flex flex-col justify-between p-6 md:p-8">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                {activity.index != null && (
                  <span
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-blue text-lg font-black text-white"
                    aria-hidden
                  >
                    {String(activity.index).padStart(2, "0")}
                  </span>
                )}
                <StatusBadge status={activity.status} />
              </div>
              <h3 className="display-title text-3xl font-black md:text-4xl">
                {activity.title}
              </h3>
              {activity.tagline && (
                <p className="mt-2 text-base font-bold text-muted">
                  {activity.tagline}
                </p>
              )}
              <p className="mt-4 text-sm font-bold">
                {formatDateOnly(activity.startAt)} · {activity.venue.name}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Tag scored={activity.isScored} />
                <span className="rounded-pill bg-light-gray px-2.5 py-1 text-xs font-bold">
                  {activity.format === "team" ? "團體賽" : "個人賽"}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href={`/activities/${activity.slug}`}
                className="btn-primary text-sm"
              >
                查看詳情 →
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === "grid") {
    return (
      <article className="group card flex h-full flex-col overflow-hidden">
        <div className="relative aspect-4/3 overflow-hidden bg-light-gray">
          <Image
            src={withBasePath(activity.cardImage ?? activity.heroImage)}
            alt={`${activity.title}主視覺`}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute left-3 top-3">
            <StatusBadge status={activity.status} showFun={false} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          {activity.index != null && (
            <p className="mb-1 text-sm font-black text-brand-blue">
              {String(activity.index).padStart(2, "0")}
            </p>
          )}
          <h3 className="text-xl font-black">{activity.title}</h3>
          {activity.tagline && (
            <p className="mt-1 line-clamp-2 text-sm text-muted">
              {activity.tagline}
            </p>
          )}
          <p className="mt-3 text-sm font-bold">
            {formatDateOnly(activity.startAt)}
          </p>
          <p className="text-sm text-muted">{activity.venue.name}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Tag scored={activity.isScored} />
            <span className="rounded-pill bg-light-gray px-2.5 py-1 text-xs font-bold">
              {activity.format === "team" ? "團體賽" : "個人賽"}
            </span>
            {isOnline && (
              <span className="rounded-pill bg-brand-blue/15 px-2.5 py-1 text-xs font-bold text-brand-blue">
                線上
              </span>
            )}
          </div>
          <div className="mt-auto pt-5">
            <Link
              href={`/activities/${activity.slug}`}
              className="text-link text-sm"
            >
              查看詳情 →
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="card overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="flex items-start gap-4 p-5 md:w-2/3">
          {activity.index != null && (
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-blue text-xl font-black text-white"
              aria-hidden
            >
              {String(activity.index).padStart(2, "0")}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <StatusBadge status={activity.status} className="mb-2" />
            <h3 className="text-xl font-black">{activity.title}</h3>
            {activity.tagline && (
              <p className="mt-1 text-sm text-muted">{activity.tagline}</p>
            )}
            <p className="mt-2 line-clamp-2 text-sm">{activity.description}</p>
            <p className="mt-3 text-sm font-medium">
              {formatDateOnly(activity.startAt)} · {activity.venue.name}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Tag scored={activity.isScored} />
              <span className="rounded-pill bg-light-gray px-2 py-0.5 text-xs font-bold">
                {activity.format === "team" ? "團體賽" : "個人賽"}
              </span>
              {isOnline && (
                <span className="rounded-pill bg-brand-blue/15 px-2 py-0.5 text-xs font-bold text-brand-blue">
                  線上
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/activities/${activity.slug}`}
                className="btn-outline text-sm"
              >
                查看詳情
              </Link>
              {isRegistrationOpen && activity.registrationUrl && (
                <a
                  href={activity.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                >
                  立即報名
                </a>
              )}
              {activity.status === "ongoing" && activity.registrationUrl && (
                <a
                  href={activity.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                >
                  立即遊玩
                </a>
              )}
              {activity.status === "finished" && (
                <Link
                  href={`/activities/${activity.slug}#results`}
                  className="btn-secondary text-sm"
                >
                  查看結果
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="relative aspect-4/3 bg-light-gray md:w-1/3">
          <Image
            src={withBasePath(activity.cardImage ?? activity.heroImage)}
            alt={`${activity.title}主視覺`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </div>
    </article>
  );
}

function Tag({ scored }: { scored: boolean }) {
  return (
    <span
      className={cn(
        "rounded-pill border px-2.5 py-1 text-xs font-bold",
        scored ? "border-black" : "border-dashed border-muted text-muted",
      )}
    >
      {scored ? "計分項目" : "非計分項目"}
    </span>
  );
}
