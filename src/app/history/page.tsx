import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "@/components/SectionHeader";
import { historyYears, galleryItems } from "@/data/history";
import { withBasePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "歷屆竹梅",
  description: "竹梅賽歷屆回顧、總比分與經典活動紀錄。",
};

export default function HistoryPage() {
  return (
    <div className="grid-bg py-12">
      <div className="container-main">
        <SectionHeader
          title="歷屆竹梅"
          subtitle="保存校園文化與荒謬活動"
        />

        <div className="space-y-8">
          {historyYears.map((year) => (
            <article key={year.year} className="card p-6">
              <h2 className="text-2xl font-black">{year.name}</h2>
              <p className="mt-1 text-[var(--color-gray)]">{year.tagline}</p>
              <p className="mt-4">
                總比分：清華 {year.nthuScore}：{year.nycuScore} 陽明交大 ·{" "}
                {year.activityCount} 場活動
              </p>
              <p className="mt-2">{year.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {year.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full border-2 border-black px-3 py-1 text-sm font-bold"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <SectionHeader title="歷史時間軸" />
          <ol className="relative space-y-6 border-l-2 border-black pl-6">
            <li>
              <span className="font-bold">2024</span> — 竹梅賽元年，首屆試辦
            </li>
            <li>
              <span className="font-bold">2025</span> — 第二屆，Instagram
              粉絲破千
            </li>
            <li>
              <span className="font-bold">2026</span> — 丙午竹梅賽，荒謬競技強勢回歸
            </li>
          </ol>
        </div>

        <div className="mt-10 text-center">
          <Link href={withBasePath("/gallery")} className="btn-primary">
            查看圖庫
          </Link>
        </div>
      </div>
    </div>
  );
}
