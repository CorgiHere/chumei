import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { JsonLd } from "@/components/JsonLd";
import { activities, getActivityBySlug } from "@/data/activities";
import { partners } from "@/data/history";
import { siteConfig } from "@/data/site";
import {
  formatDate,
  getCalendarUrl,
  getCampusLabel,
} from "@/lib/utils";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  eventJsonLd,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return activities.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  if (!activity) return { title: "活動不存在", robots: { index: false } };

  const title = `${siteConfig.yearName}${activity.title}｜報名、規則與結果`;
  return buildPageMetadata({
    title,
    description: `2026 竹梅賽「${activity.title}」：清華大學（清大／NTHU）與交通大學／陽明交通大學（交大／NYCU／NCTU）清交活動。日期、地點、參賽資格、比賽規則、報名資訊與最新結果——跟梅竹賽無關。`,
    path: `/activities/${activity.slug}`,
    image: activity.cardImage ?? activity.heroImage,
    absoluteTitle: true,
  });
}

export default async function ActivityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);
  if (!activity) notFound();

  const isRegistrationOpen =
    activity.status === "registration_open" ||
    activity.status === "registration_closing";
  const isPlayable =
    activity.status === "ongoing" && Boolean(activity.registrationUrl);
  const primaryCtaLabel = isPlayable ? "立即遊玩" : "立即報名";
  const showPrimaryCta =
    (isRegistrationOpen || isPlayable) && activity.registrationUrl;
  const activityPartners = (activity.partnerIds ?? [])
    .map((id) => partners.find((p) => p.id === id))
    .filter((p): p is (typeof partners)[number] => Boolean(p));
  const isOnline = activity.categories.includes("線上活動");

  return (
    <div className="pb-12">
      <JsonLd
        data={[
          eventJsonLd({
            name: activity.title,
            description: activity.description,
            startDate: activity.startAt,
            endDate: activity.endAt,
            path: `/activities/${activity.slug}`,
            image: activity.cardImage ?? activity.heroImage,
            locationName: activity.venue.name,
            locationAddress: activity.venue.address,
            isOnline,
            status: activity.status,
          }),
          breadcrumbJsonLd([
            { name: "首頁", path: "/" },
            { name: "活動總覽", path: "/activities" },
            { name: activity.title, path: `/activities/${activity.slug}` },
          ]),
        ]}
      />
      <section className="bg-black py-12 text-white">
        <div className="container-main">
          <StatusBadge status={activity.status} className="mb-4" />
          <h1 className="display-title text-h1 font-black">
            {activity.title}
          </h1>
          {activity.subtitle && (
            <p className="mt-2 text-lg text-gray-300">{activity.subtitle}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            <span>{formatDate(activity.startAt)}</span>
            <span>{activity.venue.name}</span>
            {activity.isScored && (
              <span className="rounded-full bg-brand-yellow px-2 py-0.5 font-bold text-black">
                計入總錦標
              </span>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {showPrimaryCta && (
              <a
                href={activity.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                {primaryCtaLabel}
              </a>
            )}
            <a
              href={getCalendarUrl(
                activity.title,
                activity.startAt,
                activity.venue.name,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-white! text-white!"
            >
              加入行事曆
            </a>
          </div>
        </div>
      </section>

      <div className="container-main bg-ink py-12 text-chalk">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <SectionHeader title="活動介紹" dark />
              <p className="text-lg">{activity.description}</p>
            </section>

            {activityPartners.length > 0 && (
              <section className="card p-6">
                <SectionHeader title="合作單位" dark />
                <ul className="space-y-2">
                  {activityPartners.map((p) => (
                    <li key={p.id}>
                      <p className="font-black">{p.name}</p>
                      {p.note && (
                        <p className="text-sm text-muted">{p.note}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(isRegistrationOpen || activity.registrationEndAt) && (
              <section className="card p-6">
                <SectionHeader title="報名資訊" dark />
                <dl className="grid gap-3 text-sm">
                  <div>
                    <dt className="font-bold">報名狀態</dt>
                    <dd>
                      <StatusBadge status={activity.status} />
                    </dd>
                  </div>
                  {activity.registrationEndAt && (
                    <div>
                      <dt className="font-bold">報名截止</dt>
                      <dd>{formatDate(activity.registrationEndAt)}</dd>
                    </div>
                  )}
                  {activity.participantLimit && (
                    <div>
                      <dt className="font-bold">名額上限</dt>
                      <dd>{activity.participantLimit} 人</dd>
                    </div>
                  )}
                  {activity.teamSizeMin && (
                    <div>
                      <dt className="font-bold">隊伍人數</dt>
                      <dd>
                        {activity.teamSizeMin}
                        {activity.teamSizeMax &&
                          activity.teamSizeMax !== activity.teamSizeMin &&
                          `–${activity.teamSizeMax}`}{" "}
                        人
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="font-bold">報名費</dt>
                    <dd>
                      {activity.registrationFee
                        ? `NT$ ${activity.registrationFee}`
                        : "免費"}
                    </dd>
                  </div>
                </dl>
              </section>
            )}

            <section>
              <SectionHeader title="比賽規則" dark />
              <div className="space-y-4">
                {activity.rules.map((rule) => (
                  <div key={rule.title} className="card p-5">
                    <h3 className="font-black">{rule.title}</h3>
                    <p className="mt-2 text-sm">{rule.content}</p>
                  </div>
                ))}
              </div>
            </section>

            {activity.result?.status === "official" && (
              <section id="results">
                <SectionHeader title="比賽結果" dark />
                <div className="card p-6">
                  {activity.result.summary && (
                    <p className="mb-4">{activity.result.summary}</p>
                  )}
                  {activity.result.rankings && (
                    <ol className="space-y-2">
                      {activity.result.rankings.map((r) => (
                        <li
                          key={r.rank}
                          className="flex items-center justify-between border-b border-white/15 py-2"
                        >
                          <span>
                            第 {r.rank} 名 · {r.teamName}（
                            {getCampusLabel(r.school)}）
                          </span>
                          {r.score && (
                            <span className="font-bold">{r.score}</span>
                          )}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <section className="card p-5">
              <h2 className="font-black">場地資訊</h2>
              <p className="mt-2 font-bold">{activity.venue.name}</p>
              <p className="text-sm text-muted">
                {getCampusLabel(activity.venue.campus)}
              </p>
              {activity.venue.meetingPoint && (
                <p className="mt-2 text-sm">
                  集合點：{activity.venue.meetingPoint}
                </p>
              )}
              {activity.venue.mapUrl && (
                <a
                  href={activity.venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-dark-outline mt-4 w-full text-sm"
                >
                  開啟地圖
                </a>
              )}
              {activity.categories.includes("線上活動") &&
                activity.registrationUrl && (
                  <a
                    href={activity.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-4 w-full text-sm"
                  >
                    立即遊玩
                  </a>
                )}
            </section>

            {activity.safetyNotes && (
              <section className="card p-5">
                <h2 className="font-black">注意事項</h2>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {activity.safetyNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>

        <div className="mt-10">
          <Link href="/activities" className="btn-dark-outline text-sm">
            ← 返回活動總覽
          </Link>
        </div>
      </div>
    </div>
  );
}
