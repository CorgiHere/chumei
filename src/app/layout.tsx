import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/data/site";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-tc",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.yearName}｜竹梅賽官方網站`,
    template: `%s｜${siteConfig.yearName}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.yearName,
    description: siteConfig.description,
    type: "website",
    locale: "zh_TW",
    images: [{ url: siteConfig.logoUrl, width: 543, height: 543, alt: "竹梅 Chu Mei" }],
  },
  icons: {
    icon: [{ url: siteConfig.logoUrl, type: "image/png" }],
    apple: [{ url: siteConfig.logoUrl }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={notoSansTC.variable}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
