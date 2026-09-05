import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { partners } from "@/data/history";
import { withBasePath } from "@/lib/utils";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "合作夥伴｜清大交大竹梅賽主辦與贊助",
  description:
    "2026 竹梅賽合作夥伴：清華大學、交通大學／陽明交通大學（清大／交大、NTHU／NYCU／NCTU）主辦單位、贊助商、協辦社團與合作單位。歡迎清交贊助與協辦洽詢。",
  path: "/partners",
});

const typeLabels = {
  organizer: "主辦單位",
  sponsor: "贊助商",
  club: "協辦社團",
  venue: "場地協力",
  equipment: "器材協力",
  media: "媒體合作",
};

export default function PartnersPage() {
  return (
    <div className="bg-ink section-space text-chalk">
      <div className="container-main">
        <PageIntro title="合作夥伴" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => (
            <div key={p.id} className="card flex flex-col items-center p-6 text-center">
              {p.logo && (
                <Image
                  src={withBasePath(p.logo)}
                  alt={p.name}
                  width={80}
                  height={80}
                  className="mb-3 h-20 w-20"
                />
              )}
              <p className="font-mono-ui text-[11px] font-semibold tracking-[0.12em] text-brand-yellow">
                {typeLabels[p.type]}
              </p>
              <p className="mt-2 text-lg font-black">{p.name}</p>
              {p.note && (
                <p className="mt-2 text-sm text-muted">{p.note}</p>
              )}
            </div>
          ))}
        </div>

        <div className="card mt-10 p-6 text-center">
          <h2 className="text-xl font-black">合作提案</h2>
          <p className="mt-2 text-muted">
            歡迎贊助、協辦或媒體合作洽詢
          </p>
          <Link href="/contact" className="btn-primary mt-4">
            聯絡我們
          </Link>
        </div>
      </div>
    </div>
  );
}
