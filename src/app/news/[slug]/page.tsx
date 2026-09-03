import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { newsPosts, getNewsBySlug } from "@/data/news";
import { siteConfig } from "@/data/site";
import { getNewsCategoryLabel, formatDate } from "@/lib/utils";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  newsArticleJsonLd,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return newsPosts.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post) return { title: "消息不存在", robots: { index: false } };

  return buildPageMetadata({
    title: `${post.title}｜${siteConfig.yearName}`,
    description: post.summary,
    path: `/news/${post.slug}`,
    image: post.coverImage,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? post.publishedAt,
    absoluteTitle: true,
  });
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getNewsBySlug(slug);
  if (!post) notFound();

  return (
    <article className="bg-ink py-12 text-chalk">
      <JsonLd
        data={[
          newsArticleJsonLd({
            title: post.title,
            description: post.summary,
            path: `/news/${post.slug}`,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            image: post.coverImage,
          }),
          breadcrumbJsonLd([
            { name: "首頁", path: "/" },
            { name: "最新消息", path: "/news" },
            { name: post.title, path: `/news/${post.slug}` },
          ]),
        ]}
      />
      <div className="container-main max-w-3xl">
        <span className="rounded-full bg-brand-yellow px-2 py-0.5 text-xs font-bold">
          {getNewsCategoryLabel(post.category)}
        </span>
        <h1 className="display-title mt-4 text-h1 font-black">
          {post.title}
        </h1>
        <time
          dateTime={post.publishedAt}
          className="mt-4 block text-sm text-muted"
        >
          發布：{formatDate(post.publishedAt)}
        </time>
        <div
          className="prose-chumei mt-8 text-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <Link href="/news" className="btn-dark-outline mt-10 text-sm">
          ← 返回消息列表
        </Link>
      </div>
    </article>
  );
}
