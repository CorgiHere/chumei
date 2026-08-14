import Link from "next/link";
import type { NewsPost } from "@/types";
import { getNewsCategoryLabel, formatDate, appPath } from "@/lib/utils";

type NewsCardProps = {
  post: NewsPost;
};

export function NewsCard({ post }: NewsCardProps) {
  return (
    <article className="card p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-brand-yellow px-2 py-0.5 font-mono-ui text-[11px] font-semibold text-ink">
          {getNewsCategoryLabel(post.category)}
        </span>
        {post.pinned && (
          <span className="rounded-full bg-black px-2 py-0.5 text-xs font-bold text-white">
            置頂
          </span>
        )}
      </div>
      <h3 className="text-lg font-black">
        <Link
          href={appPath(`/news/${post.slug}`)}
          className="hover:text-brand-yellow"
        >
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-muted">{post.summary}</p>
      <time
        dateTime={post.publishedAt}
        className="mt-3 block text-xs text-muted"
      >
        {formatDate(post.publishedAt)}
      </time>
    </article>
  );
}
