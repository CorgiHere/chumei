import type { Metadata } from "next";
import { NewsCard } from "@/components/NewsCard";
import { SectionHeader } from "@/components/SectionHeader";
import { newsPosts } from "@/data/news";

export const metadata: Metadata = {
  title: "最新消息",
  description: "2026 丙午竹梅賽最新公告、報名資訊、規則更新與結果。",
};

export default function NewsPage() {
  const sorted = [...newsPosts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });

  return (
    <div className="grid-bg py-12">
      <div className="container-main">
        <SectionHeader title="最新消息" />
        <div className="grid gap-4 md:grid-cols-2">
          {sorted.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
