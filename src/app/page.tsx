import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { LiveStatusStrip } from "@/components/LiveStatusStrip";
import { KeepPlaying } from "@/components/KeepPlaying";
import { Scoreboard } from "@/components/Scoreboard";
import { ActivityCard } from "@/components/ActivityCard";
import { SectionHeader } from "@/components/SectionHeader";
import { HazardBar } from "@/components/HazardBar";
import { activities, getActivityBySlug, getRecentResults } from "@/data/activities";
import { newsPosts } from "@/data/news";
import { partners, galleryItems } from "@/data/history";
import { siteConfig } from "@/data/site";
import { formatDateOnly, getNewsCategoryLabel, withBasePath } from "@/lib/utils";

const FEATURED_FEATURED = "dinosaur-race";
const FEATURED_MID = ["alcohol-calculus", "office-chair-racing"] as const;
const FEATURED_GRID = [
  "taiwan-mahjong",
  "barcode-racing",
  "two-school-rps",
] as const;

export default function HomePage() {
  const featured = getActivityBySlug(FEATURED_FEATURED);
  const mid = FEATURED_MID.map((s) => getActivityBySlug(s)).filter(Boolean);
  const grid = FEATURED_GRID.map((s) => getActivityBySlug(s)).filter(Boolean);
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
      <Hero />
      <LiveStatusStrip />
      <KeepPlaying />

      <section className="section-space bg-black">
        <div className="container-main">
          <Scoreboard showBreakdown />
        </div>
      </section>

      <section className="section-space grid-bg">
        <div className="container-main">
          <SectionHeader
            index="02"
            eyebrow="正賽精選"
            title={`${siteConfig.year} 活動精選`}
            subtitle="荒謬競技，一本正經"
            href="/activities"
            actionLabel={`查看全部 ${activities.length} 項活動`}
          />

          <div className="space-y-6">
            {featured && (
              <ActivityCard activity={featured} variant="featured" />
            )}
            <div className="grid gap-6 md:grid-cols-2">
              {mid.map(
                (activity) =>
                  activity && (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      variant="grid"
                    />
                  ),
              )}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {grid.map(
                (activity) =>
                  activity && (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      variant="grid"
                    />
                  ),
              )}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/activities" className="btn-primary">
              查看全部 {activities.length} 項活動 →
            </Link>
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-main">
          <SectionHeader
            index="03"
            eyebrow="公告板"
            title="最新公告"
            href="/news"
            actionLabel="全部消息"
          />
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            {featuredNews && (
              <article className="overflow-hidden rounded-xl border-4 border-black bg-black text-white">
                <HazardBar animated={false} />
                <div className="p-6 md:p-8">
                  <p className="text-xs font-bold text-brand-yellow">
                    {getNewsCategoryLabel(featuredNews.category)}
                  </p>
                  <h3 className="display-title mt-3 text-3xl font-black md:text-4xl">
                    {featuredNews.title}
                  </h3>
                  <p className="mt-3 text-sm text-white/70">
                    {featuredNews.summary}
                  </p>
                  <p className="mt-4 text-sm font-bold text-brand-yellow">
                    {formatDateOnly(featuredNews.publishedAt)}
                  </p>
                  <Link
                    href={`/news/${featuredNews.slug}`}
                    className="btn-primary mt-6 inline-flex text-sm"
                  >
                    查看公告 →
                  </Link>
                </div>
              </article>
            )}
            <div className="grid gap-5">
              {sideNews.map((post) => (
                <article
                  key={post.id}
                  className="rounded-xl border-4 border-brand-yellow bg-white p-5"
                >
                  <p className="text-xs font-bold text-brand-blue">
                    {getNewsCategoryLabel(post.category)}
                  </p>
                  <h3 className="mt-2 text-xl font-black">{post.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">
                    {post.summary}
                  </p>
                  <Link
                    href={`/news/${post.slug}`}
                    className="text-link mt-4 inline-block text-sm"
                  >
                    閱讀 →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {recentResults.length > 0 && (
        <section className="section-space bg-charcoal text-white">
          <div className="container-main">
            <SectionHeader
              index="04"
              eyebrow="賽果速覽"
              title="最近結果"
              dark
              href="/scoreboard"
              actionLabel="完整比分"
            />
            <div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
              {recentResults.map((activity) => {
                const winner = activity.result?.winner;
                const badge =
                  winner === "NTHU"
                    ? "清華勝"
                    : winner === "NYCU"
                      ? "交大勝"
                      : "結果";
                const badgeClass =
                  winner === "NTHU"
                    ? "bg-nthu"
                    : winner === "NYCU"
                      ? "bg-nycu"
                      : "bg-brand-yellow text-black";
                return (
                  <article
                    key={activity.id}
                    className="min-w-[260px] shrink-0 rounded-xl border-2 border-brand-yellow p-5 md:min-w-0"
                  >
                    <span
                      className={`inline-block rounded-pill px-2.5 py-1 text-xs font-black text-white ${badgeClass}`}
                    >
                      {badge}
                    </span>
                    <h3 className="mt-3 text-xl font-black">{activity.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/70">
                      {activity.result?.summary}
                    </p>
                    <Link
                      href={`/activities/${activity.slug}#results`}
                      className="btn-primary mt-5 inline-flex text-sm"
                    >
                      查看結果
                    </Link>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="section-space grid-bg">
        <div className="container-main">
          <SectionHeader
            index="05"
            eyebrow="影像"
            title="精選回顧"
            subtitle="活動影像整理中 · 更多花絮見 Instagram"
            href="/gallery"
            actionLabel="前往圖庫"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-video overflow-hidden rounded-xl border-4 border-black bg-light-gray"
            >
              <Image
                src={withBasePath(
                  galleryItems[0]?.imageUrl ?? "/images/gallery/hero-poster.jpg",
                )}
                alt={galleryItems[0]?.alt ?? "活動影像整理中"}
                fill
                className="object-cover transition group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/70 p-4 text-white">
                <p className="text-xs font-bold text-brand-yellow">活動影像整理中</p>
                <p className="font-black">
                  {galleryItems[0]?.title ?? "追蹤 @chumei2026"}
                </p>
              </div>
            </a>
            <div className="grid gap-4">
              {galleryItems.slice(1, 3).map((item) => (
                <a
                  key={item.id}
                  href={item.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-video overflow-hidden rounded-xl border-4 border-black bg-light-gray md:aspect-auto md:min-h-[140px]"
                >
                  <Image
                    src={withBasePath(item.imageUrl)}
                    alt={item.alt}
                    fill
                    className="object-cover transition group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/65 p-3 text-sm font-bold text-white">
                    {item.title}
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 text-center">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              @chumei2026 on Instagram
            </a>
          </div>
        </div>
      </section>

      <section className="section-space bg-white">
        <div className="container-main text-center">
          <SectionHeader
            index="06"
            eyebrow="夥伴"
            title="一起讓荒謬成真"
            className="md:items-center md:text-center [&_.text-link]:hidden"
          />
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            {partners
              .filter((partner) => partner.showOnHome)
              .map((partner) => (
              <div
                key={partner.id}
                className="rounded-xl border-2 border-black bg-light-gray px-6 py-4 font-black text-muted grayscale transition hover:bg-white hover:text-black hover:grayscale-0"
              >
                {partner.name}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/partners" className="btn-outline text-sm">
              合作提案 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
