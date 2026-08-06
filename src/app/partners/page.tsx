import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import { partners } from "@/data/history";
import { withBasePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "合作夥伴",
  description: "竹梅賽主辦、贊助商、協辦社團與合作單位。",
};

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
    <div className="grid-bg py-12">
      <div className="container-main">
        <SectionHeader title="合作夥伴" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((p) => (
            <div key={p.id} className="card flex flex-col items-center p-6 text-center">
              {p.logo && (
                <Image
                  src={withBasePath(p.logo)}
                  alt={p.name}
                  width={80}
                  height={80}
                  className="mb-3 h-20 w-20 rounded-lg"
                />
              )}
              <p className="text-xs font-bold text-brand-blue">
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
