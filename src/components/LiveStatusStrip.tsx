import Link from "next/link";
import { siteConfig } from "@/data/site";
import { appPath } from "@/lib/utils";

const items = [
  `2026 總錦標 交大 ${siteConfig.nycuScore}：${siteConfig.nthuScore} 清大`,
  "學生自發籌辦 · 非學校組織",
  "旮拉給木持續開放",
  "清大 × 交大 · NTHU × NYCU",
];

export function LiveStatusStrip() {
  const loop = [...items, ...items];
  return (
    <section
      className="overflow-hidden border-b-2 border-white/15 bg-ink text-brand-yellow"
      aria-label="最新狀態"
    >
      <div className="ticker-track">
        {loop.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="inline-flex items-center whitespace-nowrap"
          >
            <span className="px-5 font-mono-ui" aria-hidden>
              ◆
            </span>
            {label.startsWith("2026 總錦標") ? (
              <Link href={appPath("/scoreboard")} className="no-underline">
                {label}
              </Link>
            ) : (
              label
            )}
          </span>
        ))}
      </div>
    </section>
  );
}
