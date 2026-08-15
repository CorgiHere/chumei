"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site";
import { SchoolOrderToggle } from "@/components/SchoolOrderToggle";
import { cn, withBasePath, appPath } from "@/lib/utils";

const navItems = [
  { href: appPath("/activities"), label: "活動總覽" },
  { href: appPath("/schedule"), label: "賽程" },
  { href: appPath("/scoreboard"), label: "總錦標" },
  { href: appPath("/news"), label: "最新消息" },
  { href: appPath("/gallery"), label: "現場" },
  { href: appPath("/about"), label: "關於" },
  { href: appPath("/join"), label: "加入我們" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-ink text-chalk">
      <div className="container-main flex items-center justify-between gap-5 py-2.5">
        <Link
          href="/"
          className="flex items-center gap-3 no-underline"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src={withBasePath(siteConfig.logoUrl)}
            alt="竹梅 Chu Mei"
            width={42}
            height={42}
            className="h-[42px] w-[42px] rounded-[9px]"
            priority
          />
          <span className="hidden text-[17px] font-black tracking-[0.06em] sm:block">
            竹梅籌備委員會
          </span>
        </Link>

        <nav
          className="hidden items-center gap-6 font-mono-ui text-[13px] tracking-[0.08em] xl:flex"
          aria-label="主導覽"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "border-b-2 py-[3px] no-underline",
                isActive(item.href)
                  ? "border-brand-yellow text-brand-yellow"
                  : "border-transparent hover:border-brand-yellow hover:text-brand-yellow",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SchoolOrderToggle className="hidden sm:inline-flex" />

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border-2 border-brand-yellow text-brand-yellow xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "關閉選單" : "開啟選單"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              {menuOpen ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" fill="none" />
              ) : (
                <>
                  <rect y="3" width="20" height="2" />
                  <rect y="9" width="20" height="2" />
                  <rect y="15" width="20" height="2" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          className="fixed inset-0 top-[57px] z-40 flex flex-col bg-ink xl:hidden"
          aria-label="手機導覽"
        >
          <div className="container-main flex flex-1 flex-col gap-1 overflow-y-auto py-8">
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-4 border-b border-white/10 py-4"
                onClick={() => setMenuOpen(false)}
              >
                <span className="font-mono-ui text-xs tracking-[0.14em] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-2xl font-black">{item.label}</span>
              </Link>
            ))}
            <div className="pt-6">
              <SchoolOrderToggle />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
