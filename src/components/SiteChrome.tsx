"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JoinStorm } from "@/components/JoinStorm";
import { SchoolOrderProvider } from "@/components/SchoolOrder";
import { SiteFlagsProvider } from "@/components/SiteFlags";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <SchoolOrderProvider>
      <SiteFlagsProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <JoinStorm />
      </SiteFlagsProvider>
    </SchoolOrderProvider>
  );
}
