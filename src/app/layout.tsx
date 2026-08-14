import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans_TC, Oswald } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/data/site";
import {
  absoluteAssetUrl,
  absoluteUrl,
  getSiteUrl,
  SEO_KEYWORDS,
  SITE_BRAND_NAME,
} from "@/lib/seo";
import "./globals.css";

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-tc",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-oswald",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteConfig.yearName}｜清大交大清交荒謬校際競技官方網站`,
    template: `%s｜${siteConfig.yearName}`,
  },
  description: siteConfig.description,
  applicationName: SITE_BRAND_NAME,
  authors: [{ name: "竹梅籌備委員會" }],
  creator: "竹梅籌備委員會",
  publisher: "竹梅籌備委員會",
  keywords: SEO_KEYWORDS,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: `${siteConfig.yearName}｜清大 NTHU × 交大 NYCU／NCTU 竹梅賽`,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    siteName: SITE_BRAND_NAME,
    type: "website",
    locale: "zh_TW",
    images: [
      {
        url: absoluteAssetUrl(siteConfig.logoUrl),
        width: 543,
        height: 543,
        alt: "2026 竹梅賽 Chu Mei｜清大 NTHU × 交大 NYCU／NCTU",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.yearName}｜清大交大竹梅賽官方網站`,
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
  verification: {
    google: "AOByrRSfqUZkDoAFPwsS9bJOn1TYCS3dX63AM105jn8",
  },
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  category: "sports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant"
      className={`${notoSansTC.variable} ${ibmPlexMono.variable} ${oswald.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
