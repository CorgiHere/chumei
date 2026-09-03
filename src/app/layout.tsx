import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans_TC, Oswald } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/data/site";
import {
  absoluteAssetUrl,
  absoluteUrl,
  getSiteUrl,
  organizationJsonLd,
  SEO_KEYWORDS,
  SITE_BRAND_NAME,
  websiteJsonLd,
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
    default: "竹梅賽｜2026 清大 × 交大",
    template: `%s｜${siteConfig.yearName}`,
  },
  description: siteConfig.description,
  applicationName: SITE_BRAND_NAME,
  appleWebApp: {
    title: SITE_BRAND_NAME,
  },
  authors: [{ name: "竹梅籌備委員會" }],
  creator: "竹梅籌備委員會",
  publisher: "竹梅籌備委員會",
  keywords: SEO_KEYWORDS,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "竹梅賽｜2026 清大 NTHU × 交大 NYCU",
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
        alt: "竹梅賽｜清大 × 交大",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "竹梅賽｜2026 清大交大官方網站",
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
    icon: [
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
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
      lang="zh-TW"
      className={`${notoSansTC.variable} ${ibmPlexMono.variable} ${oswald.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
