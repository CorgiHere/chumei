"use client";

import { useMemo, useState } from "react";
import type { NewsCategory, NewsPost } from "@/types";
import { FilterChips } from "@/components/FilterChips";
import { NewsCard } from "@/components/NewsCard";

const CATEGORIES: { id: "all" | NewsCategory; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "important", label: "重要公告" },
  { id: "registration", label: "報名" },
  { id: "rules", label: "規則" },
  { id: "change", label: "活動異動" },
  { id: "result", label: "結果" },
  { id: "pickup", label: "物資領取" },
  { id: "partner", label: "合作" },
  { id: "behind_the_scenes", label: "幕後" },
];

type NewsExplorerProps = {
  posts: NewsPost[];
};

export function NewsExplorer({ posts }: NewsExplorerProps) {
  const [category, setCategory] = useState<"all" | NewsCategory>("all");

  const sorted = useMemo(() => {
    return [...posts]
      .filter((p) => category === "all" || p.category === category)
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return (
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
        );
      });
  }, [posts, category]);

  const pinned = sorted.filter((p) => p.pinned);
  const showPinBanner = pinned.length > 0 && category === "all";
  const listPosts = showPinBanner ? sorted.filter((p) => !p.pinned) : sorted;

  return (
    <div>
      {showPinBanner && (
        <section className="mb-10 overflow-hidden rounded-lg border-4 border-black bg-black">
          <div className="hazard-stripe-animated h-2" aria-hidden />
          <div className="p-6">
            <p className="mb-3 text-sm font-bold text-brand-yellow">
              重要公告
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {pinned.map((post) => (
                <NewsCard key={`pin-${post.id}`} post={post} />
              ))}
            </div>
          </div>
          <div className="hazard-stripe-animated h-2" aria-hidden />
        </section>
      )}

      <div className="mb-8">
        <FilterChips
          label="分類"
          options={CATEGORIES}
          value={category}
          onChange={(id) => setCategory(id as "all" | NewsCategory)}
        />
      </div>

      <p className="mb-4 text-sm font-bold text-muted">
        共 {sorted.length} 則消息
      </p>

      {listPosts.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-muted bg-white p-10 text-center">
          <p className="font-bold">這個分類目前沒有消息。</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {listPosts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
