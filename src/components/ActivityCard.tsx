import Link from "next/link";
import Image from "next/image";
import type { Activity } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { formatDateOnly, withBasePath } from "@/lib/utils";

type ActivityCardProps = {
  activity: Activity;
};

export function ActivityCard({ activity }: ActivityCardProps) {
  const isRegistrationOpen =
    activity.status === "registration_open" ||
    activity.status === "registration_closing";

  return (
    <article className="card overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="flex items-start gap-4 p-5 md:w-2/3">
          {activity.index && (
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-blue)] text-xl font-black text-white"
              aria-hidden
            >
              {String(activity.index).padStart(2, "0")}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <StatusBadge status={activity.status} className="mb-2" />
            <h3 className="text-xl font-black">{activity.title}</h3>
            {activity.tagline && (
              <p className="mt-1 text-sm text-[var(--color-gray)]">
                {activity.tagline}
              </p>
            )}
            <p className="mt-3 text-sm font-medium">
              {formatDateOnly(activity.startAt)} · {activity.venue.name}
            </p>
            {activity.isScored && (
              <span className="mt-2 inline-block rounded-full border border-black px-2 py-0.5 text-xs font-bold">
                計分項目
              </span>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={withBasePath(`/activities/${activity.slug}`)}
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
                  href={withBasePath(`/activities/${activity.slug}#results`)}
                  className="btn-secondary text-sm"
                >
                  查看結果
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/3] bg-[var(--color-light-gray)] md:w-1/3">
          <Image
            src={activity.cardImage ?? activity.heroImage}
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
