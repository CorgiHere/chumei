import type { NewsPost } from "@/types";
import { siteConfig } from "./site";

export const newsPosts: NewsPost[] = [
  {
    id: "news-01",
    slug: "2026-chumei-kickoff",
    title: "竹梅 2026 強勢回歸",
    summary:
      "只要是清交人就絕對不能錯過的竹梅！IG 有臉書沒有的獨家驚喜。",
    category: "important",
    publishedAt: "2026-03-01T10:00:00+08:00",
    pinned: true,
    content: `<p>只要是清交人就絕對不能錯過的竹梅！</p>
<p>2026 丙午竹梅賽由<strong>竹梅籌備委員會</strong>自主籌辦，一系列荒謬好玩活動陸續登場。不同於正式梅竹賽，竹梅賽的比賽項目完全不正常——但資訊絕對清楚。</p>
<p>追蹤 <a href="${siteConfig.instagramUrl}">Instagram @chumei2026</a> 獲取 IG 獨家驚喜，本官網則提供報名、規則與結果的正式資訊。所有表單與連結也整理在 <a href="${siteConfig.linktreeUrl}">Linktree</a>。</p>`,
  },
  {
    id: "news-05",
    slug: "galaga-president-live",
    title: "攻略校長旮拉給木正式上線",
    summary: "竹梅賽年度鉅獻線上體驗現已開放挑戰。",
    category: "important",
    publishedAt: "2026-07-15T12:00:00+08:00",
    relatedActivityIds: ["act-07"],
    pinned: true,
    content: `<p>好啊我沒差啊你繼續找理由玩嘎拉給木啊……</p>
<p>竹梅賽年度鉅獻「攻略校長旮拉給木」現已上線！打開瀏覽器就能玩，詳見活動頁或直接前往遊戲。</p>
<p><a href="${siteConfig.galagaUrl}">立即遊玩</a></p>`,
  },
  {
    id: "news-06",
    slug: "rps-flight-registration",
    title: "猜拳贏機票報名開放",
    summary: "報名表單現正開放，名額有限。",
    category: "registration",
    publishedAt: "2026-07-20T10:00:00+08:00",
    relatedActivityIds: ["act-08"],
    content: `<p>最純粹的運氣對決回來了。</p>
<p>「猜拳贏機票」報名表單現正開放，請透過官方表單完成報名。活動詳情與集合資訊請見活動頁，並持續關注 Instagram 公告。</p>
<p><a href="${siteConfig.rpsFormUrl}">前往報名表單</a></p>`,
  },
  {
    id: "news-07",
    slug: "merch-tee-preorder",
    title: "小徑 T 預購開放",
    summary: "竹梅週邊小徑 T 預購表單開放中。",
    category: "pickup",
    publishedAt: "2026-07-25T09:00:00+08:00",
    content: `<p>想穿上竹梅魂出門？小徑 T 預購表單現已開放。</p>
<p>尺寸、款式與領取方式請以表單說明為準。有疑問歡迎於 Instagram 匿名提問或私訊籌備委員會。</p>
<p><a href="${siteConfig.merchFormUrl}">前往預購表單</a></p>`,
  },
  {
    id: "news-02",
    slug: "dinosaur-race-results",
    title: "恐龍賽跑結果出爐：清華險勝",
    summary: "第三場計分項目完成，清華拿下勝利。",
    category: "result",
    publishedAt: "2026-03-29T18:00:00+08:00",
    relatedActivityIds: ["act-03"],
    content: `<p>2026 年 3 月 29 日，恐龍賽跑於清華大學大草坪圓滿結束。</p>
<p>本場計入總錦標，清華 +1。精彩瞬間請追蹤 <a href="${siteConfig.instagramUrl}">@chumei2026</a>。</p>`,
  },
  {
    id: "news-03",
    slug: "office-chair-registration",
    title: "辦公椅競速完賽回顧",
    summary: "輪子失控現場，陽明交大奪冠。",
    category: "result",
    publishedAt: "2026-04-05T20:00:00+08:00",
    relatedActivityIds: ["act-04"],
    content: `<p>辦公椅競速已圓滿結束。感謝所有自備滾輪、敢於失控的選手。</p>
<p>本場計入總錦標，陽明交大 +1。</p>`,
  },
  {
    id: "news-04",
    slug: "mahjong-schedule",
    title: "麻將大賽結果公告",
    summary: "牌桌大戰落幕，清華取勝。",
    category: "result",
    publishedAt: "2026-04-12T09:00:00+08:00",
    relatedActivityIds: ["act-05"],
    content: `<p>麻將大賽於清華大學蒙民偉樓落幕。</p>
<p>本場計入總錦標，清華 +1。目前總比分請見比分頁。</p>`,
  },
];

export function getNewsBySlug(slug: string): NewsPost | undefined {
  return newsPosts.find((n) => n.slug === slug);
}
