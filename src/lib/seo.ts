import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

/** Preferred Google Search site name (not the GitHub Pages default). */
export const SITE_BRAND_NAME = "竹梅賽";

/** Shared keyword set for meta keywords (meta keywords have limited impact; keep generous for completeness). */
export const SEO_KEYWORDS = [
  "竹梅賽",
  "竹梅",
  "竹梅活動",
  "竹梅比賽",
  "竹梅錦標",
  "竹梅錦標賽",
  "竹梅錦標對抗賽",
  "竹梅大賽",
  "竹梅 2026",
  "竹梅賽2026",
  "2026 竹梅賽",
  "2026竹梅賽",
  "2027竹梅",
  "2027 竹梅賽",
  "Chu Mei",
  "Chumei",
  "chu mei",
  "chumei",
  "Chu Mei Games",
  "Chumei Games",
  "chumei games",
  "chumei.org",
  "chumei2026",
  "竹梅精神",
  "竹梅籌委會",
  "竹梅籌備",
  "加入竹梅",
  "友誼賽",
  "竹梅賽籌備委員會",
  "清大",
  "清華",
  "清華大學",
  "國立清華大學",
  "清大活動",
  "NTHU",
  "National Tsing Hua University",
  "交大",
  "交通大學",
  "國立交通大學",
  "陽明交大",
  "陽明交通大學",
  "國立陽明交通大學",
  "交大活動",
  "交清",
  "NYCU",
  "NCTU",
  "NTHU NYCU",
  "National Yang Ming Chiao Tung University",
  "National Chiao Tung University",
  "清大交大",
  "清華交通",
  "清交",
  "清交活動",
  "清交對戰",
  "清交對抗",
  "清交賽",
  "清交友誼賽",
  "清交竹梅",
  "清交竹梅賽",
  "校際競賽",
  "校際競技",
  "校際活動",
  "校園活動",
  "學生活動",
  "學生自辦",
  "學生自發",
  "校園迷因",
  "一本正經地胡鬧",
  "趣味對抗",
  "清交共同文化",
  "校園競技",
  "校際友誼賽",
  "竹梅賽官方網站",
  "竹梅前哨戰",
  "辦公椅",
  "麻將大賽",
  "交清麻將",
  "交清麻將大賽",
  "清交恐龍",
  "猜拳",
  "不是梅竹",
  "清華交大",
  "陽明交大活動",
  "新竹",
  "新竹市",
  "新竹活動",
  "梅竹",
  "梅竹賽",
  "梅竹活動",
  "梅竹比賽",
  "梅竹錦標賽",
  "2026梅竹賽",
  "梅竹賽2026",
  "清大梅竹",
  "交大梅竹",
  "清交梅竹",
  "清交梅竹賽",
  "Meichu",
  "Mei Chu",
  "mei chu",
  "Meichu Games",
  "不是梅竹賽",
  "竹梅不是梅竹",
  "與梅竹賽無關",
  "跟梅竹賽無關",
  "荒謬競技",
  "荒謬校際競技",
  "荒謬比賽",
  "恐龍賽跑",
  "清交恐龍賽跑",
  "酒精微積分",
  "辦公椅錦標賽",
  "辦公椅競速",
  "兩校憑拳",
  "兩校猜拳",
  "猜拳送機票",
  "刷條碼競速",
  "刷條碼競速賽",
  "條碼達人",
  "日本麻將",
  "日本麻將推廣賽",
  "臺灣麻將",
  "四人臺灣麻將",
  "大草坪大尖叫",
  "期末週大草坪大尖叫",
  "金剛大戰哥吉拉",
  "旮拉給木",
  "攻略校長旮拉給木",
  "小徑T",
  "清交小徑",
  "交清小徑",
  "小徑正名",
  "正名公投",
  "卷酥獎",
  "竹梅籌備委員會",
  "竹梅官方",
  "竹梅官網",
  "雷霆活動",
  String(siteConfig.year),
];

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
  const social = normalized.replace(/\.avif$/i, ".jpg");
  return `${base}${social}`;
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
    keywords: SEO_KEYWORDS,
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
    alternateName: [
      SITE_BRAND_NAME,
      "竹梅",
      "Chu Mei",
      "Chumei",
      "chumei",
      "Chu Mei Games",
      "Chumei Games",
      "chumei games",
      siteConfig.yearName,
      "竹梅籌備委員會",
      "清交竹梅籌備委員會",
      "清大交大竹梅賽",
      "竹梅錦標對抗賽",
    ],
    description: siteConfig.description,
    knowsAbout: [
      "竹梅賽",
      "清交活動",
      "恐龍賽跑",
      "酒精微積分",
      "辦公椅錦標賽",
      "兩校憑拳",
      "大草坪大尖叫",
    ],
    areaServed: ["新竹", "國立清華大學", "國立交通大學", "國立陽明交通大學"],
    url: home,
    logo: {
      "@type": "ImageObject",
      url: absoluteAssetUrl(siteConfig.logoUrl),
    },
    email: siteConfig.contactEmail,
    sameAs: [
      "https://chumei.org/",
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
      "竹梅",
      "竹梅賽官方網站",
      "Chu Mei",
      "Chumei",
      "chumei",
      "Chu Mei Games",
      "Chumei Games",
      "chumei games",
      "清交竹梅賽",
      "清大交大竹梅賽",
    ],
    url: home,
    description: siteConfig.description,
    keywords: SEO_KEYWORDS.join(", "),
    about: [
      { "@type": "Thing", name: "國立清華大學" },
      { "@type": "Thing", name: "國立交通大學" },
      { "@type": "Thing", name: "國立陽明交通大學" },
      { "@type": "Thing", name: "清交" },
      { "@type": "Thing", name: "清交活動" },
      { "@type": "Thing", name: "新竹" },
      { "@type": "Thing", name: "恐龍賽跑" },
      { "@type": "Thing", name: "酒精微積分" },
      { "@type": "Thing", name: "辦公椅錦標賽" },
      { "@type": "Thing", name: "兩校憑拳" },
      { "@type": "Thing", name: "大草坪大尖叫" },
      { "@type": "Thing", name: "猜拳送機票" },
      { "@type": "Thing", name: "學生自辦" },
      { "@type": "Thing", name: "竹梅" },
      { "@type": "Thing", name: "竹梅賽" },
      { "@type": "Thing", name: "梅竹" },
      { "@type": "Thing", name: "梅竹賽" },
    ],
    inLanguage: "zh-TW",
    publisher: { "@id": `${home}#organization` },
  };
}

export function gamesEventJsonLd() {
  const home = absoluteUrl("/");
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: "2026 竹梅賽",
    alternateName: [
      "Chu Mei 2026",
      "Chumei Games",
      "chumei games",
      "Chu Mei Games",
      "竹梅",
      "竹梅賽",
      "竹梅錦標對抗賽",
      "清交竹梅賽",
    ],
    description: siteConfig.description,
    startDate: "2026-03-22",
    endDate: "2026-06-01",
    eventStatus: "https://schema.org/EventCompleted",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    sport: "校園競技",
    image: [absoluteAssetUrl(siteConfig.logoUrl)],
    url: home,
    organizer: { "@id": `${home}#organization` },
    competitor: [
      { "@type": "CollegeOrUniversity", name: "國立清華大學" },
      { "@type": "CollegeOrUniversity", name: "國立陽明交通大學" },
    ],
    location: {
      "@type": "Place",
      name: "新竹：國立清華大學、國立交通大學／國立陽明交通大學",
      address: {
        "@type": "PostalAddress",
        addressLocality: "新竹",
        addressCountry: "TW",
      },
    },
  };
}

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "竹梅賽是梅竹賽嗎？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "不是。竹梅賽（竹梅、Chu Mei、chumei games）是清華大學與交通大學／陽明交通大學學生自辦的清交荒謬競技，與正式梅竹賽沒有任何關係。",
        },
      },
      {
        "@type": "Question",
        name: "竹梅賽是什麼？",
        acceptedAnswer: {
          "@type": "Answer",
          text: siteConfig.description,
        },
      },
      {
        "@type": "Question",
        name: "2026 竹梅賽總錦標誰贏了？",
        acceptedAnswer: {
          "@type": "Answer",
          text: `2026 竹梅錦標對抗賽由交通大學（交大／NYCU）以 ${siteConfig.nycuScore}：${siteConfig.nthuScore} 擊敗國立清華大學（清大／NTHU）。計分項目包含恐龍賽跑、酒精微積分、辦公椅錦標賽、麻將、刷條碼競速與兩校憑拳。`,
        },
      },
      {
        "@type": "Question",
        name: "怎麼加入竹梅？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "清大、交大學生可填報名表，或私訊 Instagram @chumei2026。只要有搞事的心，都可以聯絡竹梅籌備委員會。",
        },
      },
    ],
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
