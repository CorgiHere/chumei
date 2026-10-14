import type { Metadata } from "next";
import { PunchboardAdmin } from "@/components/PunchboardAdmin";
import { PageIntro } from "@/components/PageIntro";

export const metadata: Metadata = {
  title: "拳擊機後台",
  robots: { index: false, follow: false, nocache: true },
};

export default function PunchboardAdminPage() {
  return (
    <div className="bg-ink section-space text-chalk">
      <div className="container-main">
        <PageIntro eyebrow="現場登錄" title="拳擊機後台" />
        <PunchboardAdmin />
      </div>
    </div>
  );
}
