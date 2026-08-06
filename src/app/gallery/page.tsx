import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeader } from "@/components/SectionHeader";
import { galleryItems } from "@/data/history";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "圖庫",
  description: "2026 竹梅賽活動照片、精彩時刻與幕後花絮。",
};

export default function GalleryPage() {
  return (
    <div className="grid-bg py-12">
      <div className="container-main">
        <SectionHeader title="圖庫" subtitle="活動照片與精彩回顧" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <figure key={item.id} className="card overflow-hidden">
              <a
                href={item.instagramUrl ?? siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="relative aspect-video">
                  <Image
                    src={item.imageUrl}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <figcaption className="p-3 text-sm font-bold">
                  {item.title}
                </figcaption>
              </a>
            </figure>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted">
          更多照片請追蹤{" "}
          <a
            href={siteConfig.instagramUrl}
            className="font-bold text-brand-blue"
            target="_blank"
            rel="noopener noreferrer"
          >
            @chumei2026
          </a>
        </p>
      </div>
    </div>
  );
}
