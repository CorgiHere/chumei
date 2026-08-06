import type { HistoryYear, Partner, GalleryItem } from "@/types";

export const historyYears: HistoryYear[] = [
  {
    year: 2026,
    name: "2026 竹梅賽",
    tagline: "兩個星期的大亂鬥 · 交大 4：3",
    nthuScore: 3,
    nycuScore: 4,
    activityCount: 11,
    highlights: [
      "金剛大戰哥吉拉",
      "恐龍賽跑",
      "酒精微積分",
      "辦公椅錦標賽",
      "刷條碼競速",
      "兩校憑拳",
    ],
    summary:
      "竹梅籌備委員會以正式錦標賽形式舉辦一系列完全不正經的校園活動。總錦標由交通大學以 4：3 獲勝，交大校狗牛排代表領獎。",
  },
];

export const partners: Partner[] = [
  {
    id: "p-01",
    name: "竹梅籌備委員會",
    type: "club",
  },
  {
    id: "p-jp-mahjong",
    name: "日本麻將研究社",
    type: "club",
  },
];

export const galleryItems: GalleryItem[] = [
  {
    id: "g-01",
    year: 2026,
    activityId: "act-02",
    title: "恐龍賽跑衝線瞬間",
    type: "photo",
    imageUrl: "/images/gallery/dinosaur-finish.svg",
    instagramUrl: "https://www.instagram.com/chumei2026/",
    alt: "恐龍裝選手衝過終點線",
  },
  {
    id: "g-02",
    year: 2026,
    activityId: "act-02",
    title: "恐龍軍團大合照",
    type: "photo",
    imageUrl: "/images/gallery/dinosaur-group.svg",
    instagramUrl: "https://www.instagram.com/chumei2026/",
    alt: "穿恐龍裝的參賽者們合照",
  },
  {
    id: "g-03",
    year: 2026,
    title: "竹梅賽 2026 主視覺",
    type: "photo",
    imageUrl: "/images/gallery/hero-poster.svg",
    instagramUrl: "https://www.instagram.com/chumei2026/",
    alt: "2026 竹梅賽宣傳主視覺",
  },
];
