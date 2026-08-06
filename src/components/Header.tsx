"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site";
import { getOpenRegistrationActivities } from "@/data/activities";
import { cn, withBasePath } from "@/lib/utils";

const navItems = [
  { href: "/activities", label: "活動總覽" },
  { href: "/schedule", label: "賽程" },
  { href: "/scoreboard", label: "比分與結果" },
  { href: "/news", label: "最新消息" },
  { href: "/history", label: "歷屆竹梅" },
  { href: "/about", label: "關於竹梅" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const hasOpenRegistration = getOpenRegistrationActivities().length > 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={cn(
        "sticky top-0 z-50 border-b-4 border-brand-yellow bg-black text-white transition-[height] duration-200",
      )}
    >
      <div
        className={cn(
          "container-main flex items-center justify-between gap-4",
          scrolled ? "h-16" : "h-16 lg:h-20",
        )}
      >
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src={withBasePath(siteConfig.logoUrl)}
            alt="竹梅 Chu Mei"
            width={44}
            height={44}
            className="h-11 w-11 rounded-lg border-2 border-brand-yellow"
            priority
          />
          <span className="display-title text-base font-black tracking-tight md:text-lg">
            {siteConfig.yearName}
          </span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="主導覽">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-pill px-3 py-2 text-sm font-bold transition",
                isActive(item.href)
                  ? "bg-brand-yellow text-black"
                  : "text-white hover:bg-white/10",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-11 w-11 items-center justify-center rounded-full border-2 border-white/40 text-sm font-black hover:border-brand-yellow hover:text-brand-yellow lg:inline-flex"
            aria-label="Instagram"
          >
            IG
          </a>
          <Link
            href={hasOpenRegistration ? "/activities" : "/schedule"}
            className="btn-primary hidden text-sm sm:inline-flex"
          >
            {hasOpenRegistration ? "目前開放報名" : "近期活動"}
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border-2 border-white lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "關閉選單" : "開啟選單"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              {menuOpen ? (
                <path
                  d="M4 4l12 12M16 4L4 16"
                  stroke="currentColor"
                  strokeWidth="2"
                />
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
          className="fixed inset-0 top-16 z-40 flex flex-col bg-black lg:hidden"
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
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-sm font-black">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="display-title text-3xl font-black">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          <div className="container-main flex gap-3 border-t border-white/20 py-5">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 text-center text-sm"
            >
              Instagram
            </a>
            <a
              href={siteConfig.linktreeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-dark-outline flex-1 text-center text-sm"
            >
              Linktree
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
