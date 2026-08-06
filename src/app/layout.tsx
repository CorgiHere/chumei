import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/data/site";
import { absoluteAssetUrl, absoluteUrl, getSiteUrl } from "@/lib/seo";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-tc",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteConfig.yearName}｜竹梅賽官方網站`,
    template: `%s｜${siteConfig.yearName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.yearName,
  authors: [{ name: "竹梅籌備委員會" }],
  creator: "竹梅籌備委員會",
  publisher: "竹梅籌備委員會",
  keywords: [
    "竹梅賽",
    "竹梅",
    "Chu Mei",
    "清華大學",
    "交通大學",
    "清交",
    "校園活動",
    "荒謬競技",
    String(siteConfig.year),
  ],
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: `${siteConfig.yearName}｜竹梅賽官方網站`,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    siteName: siteConfig.yearName,
    type: "website",
    locale: "zh_TW",
    images: [
      {
        url: absoluteAssetUrl(siteConfig.logoUrl),
        width: 543,
        height: 543,
        alt: "竹梅 Chu Mei",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.yearName}｜竹梅賽官方網站`,
    description: siteConfig.description,
    images: [absoluteAssetUrl(siteConfig.logoUrl)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: siteConfig.logoUrl, type: "image/png" }],
    apple: [{ url: siteConfig.logoUrl }],
  },
  category: "sports",
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
