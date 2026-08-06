import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/Hero";
import { NextActivity } from "@/components/NextActivity";
import { RegistrationPanel } from "@/components/RegistrationPanel";
import { Scoreboard } from "@/components/Scoreboard";
import { ActivityCard } from "@/components/ActivityCard";
import { NewsCard } from "@/components/NewsCard";
import { SectionHeader } from "@/components/SectionHeader";
import {
  activities,
  getNextActivity,
  getOpenRegistrationActivities,
  getRecentResults,
} from "@/data/activities";
import { newsPosts } from "@/data/news";
import { partners, galleryItems } from "@/data/history";
import { siteConfig } from "@/data/site";
import { withBasePath } from "@/lib/utils";

export default function HomePage() {
  const nextActivity = getNextActivity();
  const openRegistration = getOpenRegistrationActivities();
  const recentResults = getRecentResults();
  const latestNews = [...newsPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime(),
    )
    .slice(0, 3);

  return (
    <>
      <Hero />

      <div className="grid-bg">
        {nextActivity && (
          <section className="container-main py-12">
            <NextActivity activity={nextActivity} />
          </section>
        )}

        <section className="container-main py-12">
          <SectionHeader
            title="目前開放報名"
            subtitle="只顯示尚可採取行動的活動"
          />
          <RegistrationPanel activities={openRegistration} />
        </section>

        <section className="container-main py-12">
          <SectionHeader title="總錦標" />
          <Scoreboard className="max-w-xl mx-auto" />
          <div className="mt-4 text-center">
            <Link href={withBasePath("/scoreboard")} className="btn-outline text-sm">
              查看完整結果
            </Link>
          </div>
        </section>

        <section className="container-main py-12">
          <SectionHeader
            title={`${siteConfig.year} 活動總覽`}
            subtitle="荒謬競技，一本正經"
          />
          <div className="grid gap-6">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href={withBasePath("/activities")} className="btn-primary">
              查看全部活動
            </Link>
          </div>
        </section>

        <section className="container-main py-12">
          <SectionHeader title="最新公告" />
          <div className="grid gap-4 md:grid-cols-3">
            {latestNews.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href={withBasePath("/news")} className="btn-outline text-sm">
              全部消息
            </Link>
          </div>
        </section>

        {recentResults.length > 0 && (
          <section className="bg-[var(--color-charcoal)] py-12 text-white">
            <div className="container-main">
              <SectionHeader title="最近結果" />
              <div className="grid gap-4 md:grid-cols-2">
                {recentResults.map((activity) => (
                  <div key={activity.id} className="rounded-[var(--radius-lg)] border-2 border-[var(--color-brand-yellow)] p-5">
                    <p className="text-sm text-[var(--color-brand-yellow)]">
                      {activity.result?.summary}
                    </p>
                    <h3 className="mt-2 text-xl font-black">{activity.title}</h3>
                    <Link
                      href={withBasePath(`/activities/${activity.slug}#results`)}
                      className="btn-primary mt-4 inline-flex text-sm"
                    >
                      查看結果
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="container-main py-12">
          <SectionHeader title="精選回顧" subtitle="追蹤 Instagram 獲取更多" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item) => (
              <a
                key={item.id}
                href={item.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="card group overflow-hidden"
              >
                <div className="relative aspect-video">
                  <Image
                    src={item.imageUrl}
                    alt={item.alt}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <p className="p-3 text-sm font-bold">{item.title}</p>
              </a>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              @chumei2026 on Instagram
            </a>
          </div>
        </section>

        <section className="container-main py-12">
          <SectionHeader title="合作夥伴" />
          <div className="flex flex-wrap justify-center gap-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="rounded-[var(--radius-md)] border-2 border-black px-6 py-4 font-bold"
              >
                {partner.name}
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href={withBasePath("/partners")} className="btn-outline text-sm">
              了解更多
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
