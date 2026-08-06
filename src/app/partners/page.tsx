import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { partners } from "@/data/history";
import { withBasePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "合作夥伴",
  description: "竹梅賽贊助商、協辦社團與合作單位。",
};

const typeLabels = {
  sponsor: "贊助商",
  club: "協辦社團",
  venue: "場地協力",
  equipment: "器材協力",
  media: "媒體合作",
};

export default function PartnersPage() {
  return (
    <div className="grid-bg py-12">
      <div className="container-main">
        <SectionHeader title="合作夥伴" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => (
            <div key={p.id} className="card p-6 text-center">
              <p className="text-xs font-bold text-[var(--color-brand-blue)]">
                {typeLabels[p.type]}
              </p>
              <p className="mt-2 text-lg font-black">{p.name}</p>
            </div>
          ))}
        </div>

        <div className="card mt-10 p-6 text-center">
          <h2 className="text-xl font-black">合作提案</h2>
          <p className="mt-2 text-[var(--color-gray)]">
            歡迎贊助、協辦或媒體合作洽詢
          </p>
          <Link href={withBasePath("/contact")} className="btn-primary mt-4">
            聯絡我們
          </Link>
        </div>
      </div>
    </div>
  );
}
