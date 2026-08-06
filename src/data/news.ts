import type { NewsPost } from "@/types";
import { siteConfig } from "./site";

export const newsPosts: NewsPost[] = [
  {
    id: "news-01",
    slug: "championship-announcement",
    title: "⚡️竹梅賽總錦標公告：交大 4：3 獲勝",
    summary:
      "兩個星期的大亂鬥之後，2026 竹梅賽由交通大學以 4：3 獲得勝利。交大校狗「牛排」代表領獎。",
    category: "important",
    publishedAt: "2026-04-22T12:00:00+08:00",
    pinned: true,
    content: `<p>在兩個星期的大亂鬥之後，<strong>2026 竹梅賽由交通大學 4：3 獲得勝利</strong>🦊</p>
<p>這理由交大校狗——牛排代表領獎。竹梅籌備委員會也捐贈狗食一包、牛肉凍乾及小饅頭給清大懷生社。</p>
<p>總錦標公告圖公布七場計分勝負：恐龍賽跑（清華）、酒精微積分（交大）、辦公椅錦標賽（清華）、<strong>臺灣麻將大賽（交大）</strong>、<strong>日本麻將推廣賽（交大）</strong>、刷條碼競速賽（交大）、兩校憑拳（清華）。</p>
<p>來源：<a href="https://www.instagram.com/p/DXbxyXpEvby/">Instagram 總錦標公告</a>。後續另有季後賽，請持續鎖定 <a href="${siteConfig.instagramUrl}">@chumei2026</a>。</p>`,
  },
  {
    id: "news-02",
    slug: "rps-results",
    title: "兩校憑拳結果：清華奪下最後一個錦標",
    summary: "拳王林沛函，東京機票送出；正賽項目圓滿成功。",
    category: "result",
    publishedAt: "2026-04-18T12:00:00+08:00",
    relatedActivityIds: ["act-08"],
    content: `<p>恭喜清華大學獲得兩校憑拳校際競賽勝利。</p>
<p>第一名：清華理學院學士班<strong>林沛函</strong>；第二名：清華電機系沈博暘。</p>
<p>隨著拳王誕生與機票送出，2026 竹梅賽正賽告一段落。總錦標於 4/22 正式公布。</p>`,
  },
  {
    id: "news-03",
    slug: "barcode-results",
    title: "刷條碼競速賽結果：交大運管傅靖閎奪冠",
    summary: "交清條碼王出爐。",
    category: "result",
    publishedAt: "2026-04-17T12:00:00+08:00",
    relatedActivityIds: ["act-07"],
    content: `<p>〇〇系畢業，刷條碼預備！恭喜交大運管系代表奪下交清條碼王的稱號。</p>
<p>第一名：交通大學運管系<strong>傅靖閎</strong>。</p>`,
  },
  {
    id: "news-04",
    slug: "office-chair-results",
    title: "辦公椅競速賽結果：清華沈昊呈奪冠",
    summary: "近萬元辦公椅歸清華；當時總錦標清交 2：1。",
    category: "result",
    publishedAt: "2026-04-11T12:00:00+08:00",
    relatedActivityIds: ["act-04"],
    content: `<p>第一名：清華動機系<strong>沈昊呈</strong>；第二名：清華教科系蘇柏瑋。</p>
<p>恭喜冠軍獲得近萬元高級辦公椅。賽後竹梅錦標對抗賽戰況為清交 2：1。</p>`,
  },
  {
    id: "news-05",
    slug: "alcohol-calculus-results",
    title: "酒精微積分結果：交大奪冠，清交 1：1",
    summary: "冠軍隊伍「書驚館之家」。",
    category: "result",
    publishedAt: "2026-04-07T12:00:00+08:00",
    relatedActivityIds: ["act-03"],
    content: `<p>經歷四十組激烈廝殺，冠軍由交通大學拿下。</p>
<p>第一名：書驚館之家（電機、工工）；第二名：會員制酒吧。</p>
<p>賽後竹梅錦標對抗賽為清交 1：1。</p>`,
  },
  {
    id: "news-06",
    slug: "dinosaur-race-results",
    title: "恐龍賽跑結果：清華奪冠",
    summary: "毛毛蟲龍騎士前三名皆為清華。",
    category: "result",
    publishedAt: "2026-03-30T12:00:00+08:00",
    relatedActivityIds: ["act-02"],
    content: `<p>經過 3/29 一下午的恐龍騎毛毛蟲賽跑，冠軍由清華大學拿下。</p>
<p>第一名：賴彥錞的黑色牛奶棒；第二名：Champiyan；第三名：老恐龍曬太陽。</p>`,
  },
  {
    id: "news-07",
    slug: "barcode-taiko-postseason",
    title: "季後賽第一彈：條碼達人",
    summary: "5/11 清大野台，免費參加。",
    category: "important",
    publishedAt: "2026-05-08T12:00:00+08:00",
    relatedActivityIds: ["act-10"],
    content: `<p>竹梅季後賽第一彈——條碼達人，免！費！參！加！</p>
<p>5/11（一）11:00–13:00，清華大學野台。歡迎清交大各位好朋友一起玩。</p>`,
  },
  {
    id: "news-08",
    slug: "merch-tee-pickup",
    title: "小徑 T 開放領取",
    summary: "收到 Gmail 通知者可於指定時段領取。",
    category: "pickup",
    publishedAt: "2026-05-10T12:00:00+08:00",
    content: `<p>第一波小徑 T 開放領取。收到 Gmail 的朋友可於公告時段領取；尚未收到者請等待後續波次。</p>
<p>有任何問題歡迎私訊 <a href="${siteConfig.instagramUrl}">@chumei2026</a>。</p>
<p>預購表單仍可參考：<a href="${siteConfig.merchFormUrl}">小徑 T 表單</a></p>`,
  },
  {
    id: "news-09",
    slug: "galaga-president-live",
    title: "攻略校長旮拉給木持續開放",
    summary: "竹梅賽線上體驗，Linktree 可進。",
    category: "important",
    publishedAt: "2026-04-01T12:00:00+08:00",
    relatedActivityIds: ["act-09"],
    pinned: true,
    content: `<p>好啊我沒差啊你繼續找理由玩嘎拉給木啊……</p>
<p>竹梅賽「攻略校長旮拉給木」可透過官方連結遊玩。</p>
<p><a href="${siteConfig.galagaUrl}">立即遊玩</a></p>`,
  },
  {
    id: "news-10",
    slug: "lawn-scream",
    title: "期末週大草坪大尖叫",
    summary: "6/1 23:59 清大大草坪，不見不散。",
    category: "important",
    publishedAt: "2026-05-29T12:00:00+08:00",
    relatedActivityIds: ["act-11"],
    content: `<p>期末週壓力很大嗎？6/1 23:59 清大大草坪大尖叫。</p>
<p>現場發放休學單（竹委會先簽下去），可能有能量飲料；並有追 IG 抽電動滑板車。</p>`,
  },
  {
    id: "news-11",
    slug: "mahjong-results",
    title: "麻將兩場結果：交大連勝台麻與日麻",
    summary: "總錦標公告圖：臺灣麻將大賽、日本麻將推廣賽皆為交通大學勝。",
    category: "result",
    publishedAt: "2026-04-22T12:30:00+08:00",
    relatedActivityIds: ["act-05", "act-06"],
    content: `<p>依 <a href="https://www.instagram.com/p/DXbxyXpEvby/">4/22 總錦標公告</a> 圖示：</p>
<ul>
<li><strong>臺灣麻將大賽</strong>：交通大學勝</li>
<li><strong>日本麻將推廣賽</strong>：交通大學勝</li>
</ul>
<p>兩場皆計入總錦標，與恐龍、酒精微積分、辦公椅、條碼、憑拳合計為清華 3：4 交大。</p>`,
  },
];

export function getNewsBySlug(slug: string): NewsPost | undefined {
  return newsPosts.find((n) => n.slug === slug);
}
