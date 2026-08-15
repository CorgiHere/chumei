import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { LiveStatusStrip } from "@/components/LiveStatusStrip";
import { KeepPlaying } from "@/components/KeepPlaying";
import { SideExtras } from "@/components/SideExtras";
import { AboutBand } from "@/components/AboutBand";
import { JoinBand } from "@/components/JoinBand";
import { Scoreboard } from "@/components/Scoreboard";
import { ActivityCard } from "@/components/ActivityCard";
import { SectionHeader } from "@/components/SectionHeader";
import { HazardBar } from "@/components/HazardBar";
import { JsonLd } from "@/components/JsonLd";
import { activities, getRecentResults } from "@/data/activities";
import { newsPosts } from "@/data/news";
import { galleryItems } from "@/data/history";
import { siteConfig } from "@/data/site";
import { formatDateOnly, getNewsCategoryLabel, withBasePath, appPath } from "@/lib/utils";
import {
  buildPageMetadata,
  organizationJsonLd,
  websiteJsonLd,
  gamesEventJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "竹梅賽｜2026 清大 × 交大官方網站",
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  const recentResults = getRecentResults().slice(0, 3);
  const sortedNews = [...newsPosts].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  const featuredNews =
    sortedNews.find((n) => n.pinned || n.category === "important") ??
    sortedNews[0];
  const sideNews = sortedNews
    .filter((n) => n.id !== featuredNews?.id)
    .slice(0, 2);

  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd(), gamesEventJsonLd()]} />
      <Hero />
      <LiveStatusStrip />
      <KeepPlaying />

      <section className="section-space bg-charcoal">
        <div className="container-main">
          <SectionHeader
            index="02"
            title="總錦標"
            highlight="錦標"
            subtitle="七場計分項目，交大以一分之差拿下。"
            href="/scoreboard"
            actionLabel="完整比分"
            dark
          />
          <Scoreboard showBreakdown />
        </div>
      </section>

      <SideExtras />

      <section className="section-space bg-ink">
        <div className="container-main">
          <SectionHeader
            index="04"
            title="七場對抗"
            highlight="對抗"
            subtitle="每一場的規則、獎品、當天發生了什麼，以及照片。對象皆為兩校全體教職員生。"
            href="/activities"
            actionLabel={`全部 ${activities.length} 項`}
            dark
          />

          <div className="flex flex-col gap-0.5">
            {activities
              .filter((a) => a.isScored)
              .sort(
                (a, b) =>
                  new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
              )
              .map((activity, i) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  reverse={i % 2 === 1}
                  indexOverride={i + 1}
                />
              ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-ink">
        <div className="container-main">
          <SectionHeader
            index="05"
            title="最新公告"
            highlight="公告"
            href="/news"
            actionLabel="全部消息"
            dark
          />
          <div className="grid gap-0.5 lg:grid-cols-[1.4fr_1fr]">
            {featuredNews && (
              <article className="bg-dark-gray p-6 text-chalk md:p-8">
                <HazardBar animated={false} />
                <p className="mt-4 font-mono-ui text-xs tracking-[0.12em] text-brand-yellow">
                  {getNewsCategoryLabel(featuredNews.category)}
                </p>
                <h3 className="display-title mt-3 text-3xl font-black md:text-4xl">
                  {featuredNews.title}
                </h3>
                <p className="mt-3 text-sm text-muted">{featuredNews.summary}</p>
                <p className="mt-4 font-mono-ui text-xs text-brand-yellow">
                  {formatDateOnly(featuredNews.publishedAt)}
                </p>
                <Link
                  href={appPath(`/news/${featuredNews.slug}`)}
                  className="btn-primary mt-6 inline-flex text-sm"
                >
                  查看公告
                </Link>
              </article>
            )}
            <div className="grid gap-0.5">
              {sideNews.map((post) => (
                <article key={post.id} className="bg-dark-gray p-5">
                  <p className="font-mono-ui text-[11px] tracking-[0.12em] text-brand-yellow">
                    {getNewsCategoryLabel(post.category)}
                  </p>
                  <h3 className="mt-2 text-xl font-black">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{post.summary}</p>
                  <Link href={appPath(`/news/${post.slug}`)} className="text-link mt-4 inline-block">
                    閱讀 →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {recentResults.length > 0 && (
        <section className="section-space grid-bg">
          <div className="container-main">
            <SectionHeader
              index="06"
              title="最近結果"
              highlight="結果"
              href="/scoreboard"
              actionLabel="完整比分"
            />
            <div className="grid gap-0.5 md:grid-cols-3">
              {recentResults.map((activity) => {
                const winner = activity.result?.winner;
                const badge =
                  winner === "NTHU" ? "清華勝" : winner === "NYCU" ? "交大勝" : "結果";
                return (
                  <article key={activity.id} className="bg-white p-5">
                    <span className="bg-ink px-2 py-0.5 font-mono-ui text-[11px] tracking-[0.1em] text-chalk">
                      {badge}
                    </span>
                    <h3 className="mt-3 text-xl font-black text-ink">{activity.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#3f3d38]">
                      {activity.result?.summary}
                    </p>
                    <Link
                      href={appPath(`/activities/${activity.slug}#results`)}
                      className="mt-5 inline-flex font-mono-ui text-[13px] font-semibold tracking-[0.08em] text-ink underline decoration-brand-yellow decoration-2 underline-offset-4 hover:decoration-ink"
                    >
                      查看結果 →
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="section-space bg-ink">
        <div className="container-main">
          <SectionHeader
            index="07"
            title="精選回顧"
            highlight="回顧"
            subtitle="活動影像整理中 · 更多花絮見 Instagram"
            href="/gallery"
            actionLabel="前往圖庫"
            dark
          />
          <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4">
            {galleryItems.slice(0, 10).map((item, i) => (
              <a
                key={item.id}
                href={item.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative overflow-hidden ${(i === 0 || i === 5) ? "col-span-2 aspect-2/1" : "aspect-square"}`}
              >
                <div className="photo-frame absolute inset-0">
                  <img
                    src={withBasePath(item.imageUrl)}
                    alt={item.alt}
                    className="h-full w-full object-cover"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <AboutBand />

      <JoinBand />
    </>
  );
}
