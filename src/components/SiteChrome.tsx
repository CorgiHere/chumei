"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SchoolOrderProvider } from "@/components/SchoolOrder";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <SchoolOrderProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </SchoolOrderProvider>
  );
}
