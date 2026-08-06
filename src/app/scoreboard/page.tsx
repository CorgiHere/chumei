import type { Metadata } from "next";
import Link from "next/link";
import { Scoreboard } from "@/components/Scoreboard";
import { SectionHeader } from "@/components/SectionHeader";
import { activities } from "@/data/activities";
import { siteConfig } from "@/data/site";
import { formatDateOnly, withBasePath } from "@/lib/utils";

export const metadata: Metadata = {
  title: "比分與結果",
  description: "2026 丙午竹梅賽總錦標比分、各活動計分與完整結果。",
};

export default function ScoreboardPage() {
  const scored = activities.filter((a) => a.isScored);
  const unscored = activities.filter((a) => !a.isScored);

  return (
    <div className="py-12">
      <section className="bg-[var(--color-black)] py-12">
        <div className="container-main">
          <SectionHeader title="目前總比分" />
          <Scoreboard className="max-w-2xl mx-auto" />
          <p className="mt-4 text-center text-white/70">
            清華 {siteConfig.nthuScore}：{siteConfig.nycuScore} 陽明交大
          </p>
        </div>
      </section>

      <div className="container-main grid-bg py-12">
        <SectionHeader title="計分項目" />
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black text-left">
                <th className="py-3 pr-4">活動</th>
                <th className="py-3 pr-4">清華</th>
                <th className="py-3 pr-4">陽明交大</th>
                <th className="py-3 pr-4">狀態</th>
                <th className="py-3">日期</th>
              </tr>
            </thead>
            <tbody>
              {scored.map((a) => (
                <tr key={a.id} className="border-b border-[var(--color-light-gray)]">
                  <td className="py-3 pr-4 font-bold">
                    <Link
                      href={withBasePath(`/activities/${a.slug}`)}
                      className="hover:text-[var(--color-brand-blue)]"
                    >
                      {a.title}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-[var(--color-nthu)]">
                    {a.result?.nthuScore ?? "—"}
                  </td>
                  <td className="py-3 pr-4 text-[var(--color-nycu)]">
                    {a.result?.nycuScore ?? "—"}
                  </td>
                  <td className="py-3 pr-4">
                    {a.status === "finished" ? "已完成" : "尚未進行"}
                  </td>
                  <td className="py-3">{formatDateOnly(a.startAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4 md:hidden">
          {scored.map((a) => (
            <div key={a.id} className="card p-4">
              <h3 className="font-black">{a.title}</h3>
              <p className="mt-2 text-sm">
                清華 {a.result?.nthuScore ?? "—"} · 陽明交大{" "}
                {a.result?.nycuScore ?? "—"}
              </p>
              <p className="text-sm text-[var(--color-gray)]">
                {formatDateOnly(a.startAt)} ·{" "}
                {a.status === "finished" ? "已完成" : "尚未進行"}
              </p>
            </div>
          ))}
        </div>

        <SectionHeader title="非計分項目" subtitle="好玩但不影響總錦標" />
        <ul className="space-y-2">
          {unscored.map((a) => (
            <li key={a.id}>
              <Link
                href={withBasePath(`/activities/${a.slug}`)}
                className="font-bold hover:text-[var(--color-brand-blue)]"
              >
                {a.title}
              </Link>
              <span className="ml-2 text-sm text-[var(--color-gray)]">
                {formatDateOnly(a.startAt)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
