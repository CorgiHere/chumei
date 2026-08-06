import type { NewsPost } from "@/types";

export const newsPosts: NewsPost[] = [
  {
    id: "news-01",
    slug: "2026-chumei-kickoff",
    title: "2026 丙午竹梅賽正式開跑",
    summary:
      "清交學生自主籌辦的荒謬競技平台強勢回歸，首波活動已陸續公布。",
    category: "important",
    publishedAt: "2026-03-01T10:00:00+08:00",
    pinned: true,
    content: `<p>只要是清交人就絕對不能錯過的竹梅！</p>
<p>2026 丙午竹梅賽正式啟動，由清交學生自主籌辦的一系列好玩活動陸續登場。不同於正式梅竹賽，竹梅賽的比賽項目完全不正常——但資訊絕對清楚。</p>
<p>追蹤 <a href="https://www.instagram.com/chumei2026/">Instagram @chumei2026</a> 獲取 IG 獨家驚喜，本官網則提供報名、規則與結果的正式資訊。</p>`,
  },
  {
    id: "news-02",
    slug: "dinosaur-race-results",
    title: "恐龍賽跑結果出爐：清華險勝",
    summary: "第三場計分項目完成，清華以 0.3 秒優勢拿下勝利。",
    category: "result",
    publishedAt: "2026-03-29T18:00:00+08:00",
    relatedActivityIds: ["act-03"],
    content: `<p>2026 年 3 月 29 日，恐龍賽跑於清華大學大草坪圓滿結束。</p>
<p>清華「清恐龍突擊隊」以 12.4 秒成績奪冠，陽明交大「狐龍混合種」以 12.7 秒緊追在後。本場計入總錦標，清華 +1。</p>
<p>目前總比分：清華 3：2 陽明交大。</p>`,
  },
  {
    id: "news-03",
    slug: "office-chair-registration",
    title: "辦公椅競速報名開放",
    summary: "報名截止 4 月 8 日 23:59，剩餘名額有限。",
    category: "registration",
    publishedAt: "2026-03-20T12:00:00+08:00",
    relatedActivityIds: ["act-04"],
    content: `<p>辦公椅競速報名現已開放！</p>
<p>活動時間：2026 年 4 月 5 日（六）15:00<br/>地點：清華大學體育館<br/>報名截止：2026 年 4 月 8 日 23:59</p>
<p>請自備符合規格的辦公椅，並佩戴護膝。報名連結請見活動頁面。</p>`,
  },
  {
    id: "news-04",
    slug: "mahjong-schedule",
    title: "麻將大賽賽程公告",
    summary: "4 月 11 日 19:00 於蒙民偉樓開打。",
    category: "rules",
    publishedAt: "2026-04-01T09:00:00+08:00",
    relatedActivityIds: ["act-05"],
    content: `<p>麻將大賽將於 2026 年 4 月 11 日（六）19:00 於清華大學蒙民偉樓舉行。</p>
<p>每隊 4 人，採積分制。報名即將開放，請密切注意本官網與 Instagram 公告。</p>`,
  },
];

export function getNewsBySlug(slug: string): NewsPost | undefined {
  return newsPosts.find((n) => n.slug === slug);
}
