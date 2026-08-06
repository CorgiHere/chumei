import type { HistoryYear, Partner, GalleryItem } from "@/types";

export const historyYears: HistoryYear[] = [
  {
    year: 2026,
    name: "2026 丙午竹梅賽",
    tagline: "荒謬競技，強勢回歸",
    nthuScore: 3,
    nycuScore: 2,
    activityCount: 6,
    highlights: ["恐龍賽跑", "辦公椅競速", "麻將大賽", "攻略校長旮拉給木", "猜拳贏機票"],
    summary:
      "竹梅籌備委員會以正式錦標賽形式，舉辦一系列完全不正經的校園活動。",
  },
  {
    year: 2025,
    name: "2025 乙巳竹梅賽",
    tagline: "熊躍竹影，巳意競技",
    nthuScore: 4,
    nycuScore: 3,
    activityCount: 5,
    highlights: ["大胃王對決", "電競知識王", "校園尋寶"],
    summary: "第二屆竹梅賽，活動規模擴大，Instagram 粉絲突破千人大關。",
  },
  {
    year: 2024,
    name: "2024 甲辰竹梅賽",
    tagline: "首屆試辦",
    nthuScore: 2,
    nycuScore: 2,
    activityCount: 3,
    highlights: ["首屆恐龍賽跑", "辦公椅試辦賽"],
    summary: "竹梅賽元年，以「一本正經地胡鬧」為精神，試辦三項活動。",
  },
];

export const partners: Partner[] = [
  {
    id: "p-01",
    name: "竹梅籌備委員會",
    type: "club",
  },
  {
    id: "p-02",
    name: "清華大學學生會",
    type: "club",
  },
  {
    id: "p-03",
    name: "陽明交通大學學生會",
    type: "club",
  },
];

export const galleryItems: GalleryItem[] = [
  {
    id: "g-01",
    year: 2026,
    activityId: "act-03",
    title: "恐龍賽跑衝線瞬間",
    type: "photo",
    imageUrl: "/images/gallery/dinosaur-finish.svg",
    instagramUrl: "https://www.instagram.com/chumei2026/",
    alt: "恐龍裝選手衝過終點線",
  },
  {
    id: "g-02",
    year: 2026,
    activityId: "act-03",
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
    alt: "2026 丙午竹梅賽宣傳主視覺",
  },
];
