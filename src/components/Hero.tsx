import Link from "next/link";
import { siteConfig } from "@/data/site";
import { getNextActivity } from "@/data/activities";
import { Scoreboard } from "./Scoreboard";
import { withBasePath } from "@/lib/utils";

export function Hero() {
  const nextActivity = getNextActivity();

  return (
    <section className="relative overflow-hidden bg-[var(--color-black)] text-white">
      <div className="hazard-stripe h-2" aria-hidden />
      <div className="container-main py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold text-[var(--color-brand-yellow)]">
              {siteConfig.yearName}
            </p>
            <h1 className="display-title text-[var(--font-size-display-lg)] font-black leading-none">
              {siteConfig.tagline}
            </h1>
            <p className="mt-6 max-w-lg text-lg text-gray-300">
              {siteConfig.description}
            </p>
            {nextActivity && (
              <p className="mt-4 rounded-[var(--radius-md)] bg-[var(--color-brand-yellow)] px-4 py-2 text-sm font-bold text-black">
                下一場：{nextActivity.title} ·{" "}
                {new Date(nextActivity.startAt).toLocaleDateString("zh-TW", {
                  month: "2-digit",
                  day: "2-digit",
                })}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {nextActivity && (
                <Link
                  href={withBasePath(`/activities/${nextActivity.slug}`)}
                  className="btn-primary"
                >
                  查看活動
                </Link>
              )}
              <Link href={withBasePath("/schedule")} className="btn-outline !text-white !border-white hover:!bg-white/10">
                全部賽程
              </Link>
            </div>
          </div>
          <Scoreboard />
        </div>
      </div>
      <div className="hazard-stripe h-2" aria-hidden />
    </section>
  );
}
