"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/data/site";
import { getOpenRegistrationActivities } from "@/data/activities";
import { cn, withBasePath } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首頁" },
  { href: "/activities", label: "活動總覽" },
  { href: "/schedule", label: "賽程" },
  { href: "/scoreboard", label: "比分與結果" },
  { href: "/news", label: "最新消息" },
  { href: "/history", label: "歷屆竹梅" },
  { href: "/about", label: "關於竹梅" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const hasOpenRegistration = getOpenRegistrationActivities().length > 0;

  return (
    <header className="sticky top-0 z-50 border-b-4 border-black bg-white">
      <div className="container-main flex h-16 items-center justify-between gap-4">
        <Link
          href={withBasePath("/")}
          className="display-title text-lg font-black tracking-tight md:text-xl"
        >
          竹梅賽
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="主導覽">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={withBasePath(item.href)}
              className="text-sm font-bold hover:text-brand-blue"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={withBasePath(
              hasOpenRegistration ? "/activities" : "/schedule",
            )}
            className="btn-primary hidden text-sm sm:inline-flex"
          >
            {hasOpenRegistration ? "目前開放報名" : "查看近期活動"}
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border-2 border-black lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "關閉選單" : "開啟選單"}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="sr-only">選單</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden
            >
              {menuOpen ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" />
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
          className="border-t-2 border-black bg-white lg:hidden"
          aria-label="手機導覽"
        >
          <div className="container-main flex flex-col gap-1 py-4">
            <Link
              href={withBasePath(
                hasOpenRegistration ? "/activities" : "/schedule",
              )}
              className="btn-primary mb-2 text-center"
              onClick={() => setMenuOpen(false)}
            >
              {hasOpenRegistration ? "開放報名" : "近期活動"}
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={withBasePath(item.href)}
                className="rounded-md px-3 py-3 font-bold hover:bg-light-gray"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-3 py-3 font-bold text-brand-blue"
            >
              Instagram @chumei2026
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
