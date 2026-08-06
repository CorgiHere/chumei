import Link from "next/link";
import { siteConfig } from "@/data/site";
import { getNextActivity } from "@/data/activities";
import { Scoreboard } from "./Scoreboard";
import { formatDateOnly, withBasePath } from "@/lib/utils";

export function Hero() {
  const nextActivity = getNextActivity();

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="hazard-stripe-animated h-2.5" aria-hidden />
      <div className="speed-lines" aria-hidden />
      <div className="container-main relative py-14 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="reveal-up">
            <p className="mb-3 inline-block rounded-pill border border-brand-yellow px-3 py-1 text-xs font-bold tracking-wide text-brand-yellow">
              {siteConfig.yearName}
            </p>
            <h1 className="display-title text-display-lg font-black leading-[0.95]">
              竹梅賽
            </h1>
            <p className="mt-3 text-2xl font-black text-brand-yellow md:text-3xl">
              {siteConfig.tagline}
            </p>
            <p className="mt-5 max-w-xl text-base text-gray-300 md:text-lg">
              {siteConfig.description}
            </p>
            {nextActivity && (
              <p className="mt-5 max-w-xl rounded-md bg-brand-yellow px-4 py-3 text-sm font-bold text-black">
                下一場：{nextActivity.title}
                <span className="mx-2 opacity-50">·</span>
                {formatDateOnly(nextActivity.startAt)}
                <span className="mx-2 opacity-50">·</span>
                {nextActivity.venue.name}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {nextActivity && (
                <Link
                  href={withBasePath(`/activities/${nextActivity.slug}`)}
                  className="btn-primary"
                >
                  {nextActivity.status === "registration_open"
                    ? "前往報名"
                    : nextActivity.status === "ongoing"
                      ? "立即挑戰"
                      : "查看活動"}
                </Link>
              )}
              <Link
                href={withBasePath("/schedule")}
                className="btn-outline border-white! text-white! hover:bg-white/10!"
              >
                全部賽程
              </Link>
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline border-white/40! text-white/90! hover:bg-white/10!"
              >
                Instagram
              </a>
            </div>
          </div>
          <div className="reveal-up-delay score-pulse">
            <Scoreboard />
          </div>
        </div>
      </div>
      <div className="hazard-stripe-animated h-2.5" aria-hidden />
    </section>
  );
}
