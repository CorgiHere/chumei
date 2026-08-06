import Link from "next/link";
import { siteConfig } from "@/data/site";

const items = [
  {
    label: "2026 總錦標交大 4：3",
    href: "/scoreboard",
    cta: "看賽果",
    external: false,
  },
  {
    label: "旮拉給木持續開放",
    href: siteConfig.galagaUrl,
    cta: "立即遊玩",
    external: true,
  },
  {
    label: "小徑 T 資訊見 Linktree",
    href: siteConfig.linktreeUrl,
    cta: "Linktree",
    external: true,
  },
];

export function LiveStatusStrip() {
  return (
    <section className="border-b-4 border-black bg-brand-yellow">
      <div className="container-main py-4">
        <ul className="flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {items.map((item) => {
            const className =
              "flex min-w-[240px] shrink-0 items-center justify-between gap-3 rounded-xl border-2 border-black bg-white px-4 py-3 md:min-w-0";
            if (item.external) {
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    <span className="text-sm font-black">{item.label}</span>
                    <span className="shrink-0 text-xs font-bold text-brand-blue">
                      {item.cta} →
                    </span>
                  </a>
                </li>
              );
            }
            return (
              <li key={item.label}>
                <Link href={item.href} className={className}>
                  <span className="text-sm font-black">{item.label}</span>
                  <span className="shrink-0 text-xs font-bold text-brand-blue">
                    {item.cta} →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
