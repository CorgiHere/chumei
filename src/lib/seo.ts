import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

/** Preferred Google Search site name (not the GitHub Pages default). */
export const SITE_BRAND_NAME = "竹梅賽";

/** Production site origin including path prefix (no trailing slash). */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    siteConfig.siteUrl.replace(/\/$/, "")
  );
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return `${base}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withSlash =
    normalized.includes("#") ||
    normalized.includes("?") ||
    normalized.endsWith("/")
      ? normalized
      : `${normalized}/`;
  return `${base}${withSlash}`;
}

export function absoluteAssetUrl(path: string): string {
  const base = getSiteUrl();
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  /** Use full title as-is (skip layout title template). */
  absoluteTitle?: boolean;
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  absoluteTitle,
  noIndex,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteAssetUrl(image ?? siteConfig.logoUrl);
  const displayTitle = absoluteTitle
    ? title
    : path === "/"
      ? title
      : `${title}｜${siteConfig.yearName}`;

  return {
    title: absoluteTitle || path === "/" ? { absolute: title } : title,
    description,
    keywords: [
      "竹梅賽",
      "竹梅",
      "Chu Mei",
      "清華",
      "交大",
      "交通大學",
      "清交",
      String(siteConfig.year),
      "校園活動",
    ],
    authors: [{ name: "竹梅籌備委員會" }],
    creator: "竹梅籌備委員會",
    publisher: "竹梅籌備委員會",
    category: "sports",
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: displayTitle,
      description,
      url,
      siteName: SITE_BRAND_NAME,
      locale: "zh_TW",
      type,
      images: [
        {
          url: ogImage,
          width: 543,
          height: 543,
          alt: displayTitle,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function organizationJsonLd() {
  const home = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${home}#organization`,
    name: "竹梅籌備委員會",
    alternateName: [SITE_BRAND_NAME, "Chu Mei", siteConfig.yearName],
    url: home,
    logo: {
      "@type": "ImageObject",
      url: absoluteAssetUrl(siteConfig.logoUrl),
    },
    email: siteConfig.contactEmail,
    sameAs: [
      siteConfig.instagramUrl,
      siteConfig.facebookUrl,
      siteConfig.threadsUrl,
      siteConfig.linktreeUrl,
    ],
  };
}

export function websiteJsonLd() {
  const home = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${home}#website`,
    name: SITE_BRAND_NAME,
    alternateName: [
      siteConfig.yearName,
      "竹梅賽官方網站",
      "Chu Mei",
      "corgihere.github.io",
    ],
    url: home,
    description: siteConfig.description,
    inLanguage: "zh-Hant",
    publisher: { "@id": `${home}#organization` },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function eventJsonLd(input: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  path: string;
  image?: string;
  locationName: string;
  locationAddress?: string;
  isOnline?: boolean;
  status: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${siteConfig.yearName}${input.name}`,
    description: input.description,
    startDate: input.startDate,
    ...(input.endDate ? { endDate: input.endDate } : {}),
    eventStatus:
      input.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: input.isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    image: [absoluteAssetUrl(input.image ?? siteConfig.logoUrl)],
    url: absoluteUrl(input.path),
    organizer: {
      "@type": "Organization",
      name: "竹梅籌備委員會",
      url: absoluteUrl("/about/"),
    },
    location: input.isOnline
      ? {
          "@type": "VirtualLocation",
          url: absoluteUrl(input.path),
        }
      : {
          "@type": "Place",
          name: input.locationName,
          ...(input.locationAddress
            ? {
                address: {
                  "@type": "PostalAddress",
                  streetAddress: input.locationAddress,
                  addressCountry: "TW",
                },
              }
            : {}),
        },
  };
}

export function newsArticleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: input.title,
    description: input.description,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    image: [absoluteAssetUrl(input.image ?? siteConfig.logoUrl)],
    mainEntityOfPage: absoluteUrl(input.path),
    author: {
      "@type": "Organization",
      name: "竹梅籌備委員會",
    },
    publisher: {
      "@type": "Organization",
      name: "竹梅籌備委員會",
      logo: {
        "@type": "ImageObject",
        url: absoluteAssetUrl(siteConfig.logoUrl),
      },
    },
  };
}
