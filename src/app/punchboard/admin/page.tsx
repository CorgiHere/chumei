import type { Metadata } from "next";
import { PunchboardAdmin } from "@/components/PunchboardAdmin";

export const metadata: Metadata = {
  title: "開扁後台",
  robots: { index: false, follow: false, nocache: true },
};

export default function PunchboardAdminPage() {
  return (
    <div className="bg-ink pb-10 text-white">
      <PunchboardAdmin />
    </div>
  );
}
