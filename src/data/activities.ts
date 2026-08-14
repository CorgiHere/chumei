import type { Activity } from "@/types";
import { venues } from "./venues";
import { siteConfig } from "./site";

export const activities: Activity[] = [
  {
    id: "act-01",
    slug: "kong-vs-godzilla",
    year: 2026,
    index: 1,
    title: "金剛大戰哥吉拉",
    subtitle: "竹梅前哨戰",
    tagline: "金剛／恐龍版鬼抓人",
    description:
      "竹梅前哨戰：一校十人、免費報名。猜拳決定先攻後攻，攻擊方派出大猩猩追恐龍裝隊友。2026/3/22 於清大大草坪完賽。",
    heroImage: "/images/activities/kong-vs-godzilla.jpg",
    cardImage: "/images/activities/kong-vs-godzilla.jpg",
    startAt: "2026-03-22T13:00:00+08:00",
    endAt: "2026-03-22T16:00:00+08:00",
    status: "finished",
    venue: venues["nthu-lawn"],
    categories: ["實體活動", "團體賽", "前哨戰", "非計分項目"],
    format: "team",
    teamSizeMin: 10,
    teamSizeMax: 10,
    registrationFee: 0,
    rules: [
      {
        title: "賽制摘要",
        content:
          "猜拳決定先攻後攻。攻擊方選一人當大猩猩，另一方全員穿恐龍裝；比較五分鐘內抓到的恐龍數量，若都抓完以時間較短者勝。",
      },
    ],
    audienceNotes: ["開放觀賽"],
    isScored: false,
    organizerIds: ["chumei-committee"],
    socialLinks: [{ platform: "Instagram", url: siteConfig.instagramUrl }],
  },
  {
    id: "act-02",
    slug: "dinosaur-race",
    year: 2026,
    index: 2,
    title: "恐龍賽跑",
    subtitle: "第二屆清交恐龍賽跑",
    tagline: "龍ㄟ賽　／　再辦一屆？龍ㄟ賽啦",
    description:
      "三人一組穿著恐龍裝騎毛毛蟲於跑道競速。第二屆清交恐龍賽跑於 3/29 清大操場完賽，冠軍由清華大學拿下。",
    heroImage: "/images/activities/dinosaur-race.jpg",
    cardImage: "/images/activities/dinosaur-race.jpg",
    startAt: "2026-03-29T14:00:00+08:00",
    endAt: "2026-03-29T17:00:00+08:00",
    status: "finished",
    venue: venues["nthu-track"],
    categories: ["實體活動", "團體賽", "計分項目"],
    format: "team",
    teamSizeMin: 3,
    teamSizeMax: 3,
    registrationFee: 0,
    rules: [
      {
        title: "比賽方式",
        content: "三人一組穿著恐龍裝騎毛毛蟲於跑道競速。詳見賽前活動流程公告。",
      },
    ],
    safetyNotes: ["請穿著運動鞋", "恐龍裝與毛毛蟲器材依現場規定使用"],
    audienceNotes: ["開放觀賽", "建議攜帶防曬用品"],
    isScored: true,
    scoreWeight: 1,
    organizerIds: ["chumei-committee"],
    result: {
      status: "official",
      publishedAt: "2026-03-30T12:00:00+08:00",
      winner: "NTHU",
      nthuScore: 1,
      nycuScore: 0,
      summary:
        "經過一下午的恐龍騎毛毛蟲賽跑，冠軍由清華大學拿下。前三名皆為清華隊伍。",
      rankings: [
        {
          rank: 1,
          school: "NTHU",
          teamName: "賴彥錞的黑色牛奶棒",
        },
        { rank: 2, school: "NTHU", teamName: "Champiyan" },
        { rank: 3, school: "NTHU", teamName: "老恐龍曬太陽" },
      ],
    },
    socialLinks: [{ platform: "Instagram", url: siteConfig.instagramUrl }],
  },
  {
    id: "act-03",
    slug: "alcohol-calculus",
    year: 2026,
    index: 3,
    title: "酒精微積分",
    subtitle: "外微不變乘內微",
    tagline: "微～好酒不見　／　誰是清交醉後的天才",
    description:
      "今朝有酒今朝醉，外微不變乘內微。報名費 200 元／人，須滿 18 歲。4/6 於交大綜合一館 B102 完賽，冠軍由交通大學拿下；賽後總錦標清交 1：1。",
    heroImage: "/images/activities/alcohol-calculus.jpg",
    cardImage: "/images/activities/alcohol-calculus.jpg",
    startAt: "2026-04-06T17:00:00+08:00",
    endAt: "2026-04-06T20:00:00+08:00",
    status: "finished",
    venue: venues["nycu-b102"],
    categories: ["實體活動", "團體賽", "計分項目"],
    format: "team",
    registrationFee: 200,
    rules: [
      {
        title: "參加資格",
        content: "參賽者須年滿 18 歲。詳見報名表單與現場說明。",
      },
    ],
    safetyNotes: ["未滿 18 歲不得參賽", "請理性飲酒、注意身體狀況"],
    isScored: true,
    scoreWeight: 1,
    organizerIds: ["chumei-committee"],
    result: {
      status: "official",
      publishedAt: "2026-04-07T12:00:00+08:00",
      winner: "NYCU",
      nthuScore: 0,
      nycuScore: 1,
      summary:
        "經歷四十組激烈廝殺，冠軍由交通大學拿下。竹梅錦標對抗賽當時為清交 1：1。",
      rankings: [
        {
          rank: 1,
          school: "NYCU",
          teamName: "書驚館之家（電機、工工）",
        },
        {
          rank: 2,
          school: "NYCU",
          teamName: "會員制酒吧（土木、機械、電機）",
        },
        {
          rank: 3,
          school: "NYCU",
          teamName: "明天微積分期中考我們在這裡（陽明藥學）",
        },
        {
          rank: 4,
          school: "NTHU",
          teamName: "許富翔好醜（數學系）",
        },
      ],
    },
    socialLinks: [{ platform: "Instagram", url: siteConfig.instagramUrl }],
  },
  {
    id: "act-04",
    slug: "office-chair-racing",
    year: 2026,
    index: 4,
    title: "辦公椅錦標賽",
    subtitle: "滑辦公椅移動吧",
    tagline: "冠軍獎品：近萬元辦公椅",
    description:
      "oloo 又沒車？邁出成為辦公椅賽車手的第一步。4/10 19:30 於清大實齋講堂完賽，冠軍為清華動機系沈昊呈；賽後總錦標清交 2：1。",
    heroImage: "/images/activities/office-chair.jpg",
    cardImage: "/images/activities/office-chair.jpg",
    startAt: "2026-04-10T19:30:00+08:00",
    endAt: "2026-04-10T20:30:00+08:00",
    status: "finished",
    venue: venues["nthu-shizhai"],
    categories: ["實體活動", "個人賽", "計分項目"],
    format: "individual",
    registrationFee: 0,
    rules: [
      {
        title: "獎品",
        content: "冠軍獲得近萬元高級辦公椅；前六名可獲小徑 T 一件。",
      },
    ],
    safetyNotes: ["請依現場裁判指示滑行，注意安全"],
    isScored: true,
    scoreWeight: 1,
    organizerIds: ["chumei-committee"],
    result: {
      status: "official",
      publishedAt: "2026-04-11T12:00:00+08:00",
      winner: "NTHU",
      nthuScore: 1,
      nycuScore: 0,
      summary:
        "橫跨交清兩校最優秀的辦公椅賽車手出爐。賽後竹梅錦標對抗賽為清交 2：1。",
      rankings: [
        {
          rank: 1,
          school: "NTHU",
          teamName: "沈昊呈（動機系）",
        },
        {
          rank: 2,
          school: "NTHU",
          teamName: "蘇柏瑋（教科系）",
        },
      ],
    },
    socialLinks: [{ platform: "Instagram", url: siteConfig.instagramUrl }],
  },
  {
    id: "act-05",
    slug: "japanese-mahjong",
    year: 2026,
    index: 5,
    title: "日本麻將推廣賽",
    subtitle: "與日本麻將研究社合作",
    tagline: "免報名費 · 計入總錦標",
    description:
      "與日本麻將研究社合作舉辦。免報名費，第一名獎品為全新日本麻將，前四名可獲小徑 T。4/11 於清大蒙民偉樓舉行；總錦標公告記為交通大學勝。",
    heroImage: "/images/activities/japanese-mahjong.jpg",
    cardImage: "/images/activities/japanese-mahjong.jpg",
    startAt: "2026-04-11T13:30:00+08:00",
    status: "finished",
    venue: venues["nthu-mw"],
    categories: ["實體活動", "個人賽", "計分項目"],
    format: "individual",
    participantLimit: 32,
    registrationFee: 0,
    rules: [
      {
        title: "賽制",
        content:
          "三場半莊戰，每場隨機分組；三場後積分最高的四名選手晉級決賽。",
      },
    ],
    audienceNotes: ["開放清華、交通大學全體教職員生"],
    isScored: true,
    scoreWeight: 1,
    organizerIds: ["chumei-committee"],
    partnerIds: ["p-jp-mahjong"],
    result: {
      status: "official",
      publishedAt: "2026-04-22T12:00:00+08:00",
      winner: "NYCU",
      nthuScore: 0,
      nycuScore: 1,
      summary:
        "依 4/22 總錦標公告圖，日本麻將推廣賽由交通大學獲得校際勝利。",
    },
    socialLinks: [
      { platform: "Instagram", url: "https://www.instagram.com/p/DXbxyXpEvby/" },
      { platform: "Instagram", url: siteConfig.instagramUrl },
    ],
  },
  {
    id: "act-06",
    slug: "taiwan-mahjong",
    year: 2026,
    index: 6,
    title: "四人臺灣麻將",
    subtitle: "交清麻將大賽",
    tagline: "冠軍獎品：自動麻將桌",
    description:
      "人家麻將都是單打獨鬥，你有聽過能組成戰隊的嗎？冠軍組獎品為自動麻將桌。4/12 13:30–21:00 於清大蒙民偉樓舉行；總錦標公告記為交通大學勝。",
    heroImage: "/images/activities/taiwan-mahjong.jpg",
    cardImage: "/images/activities/taiwan-mahjong.jpg",
    startAt: "2026-04-12T13:30:00+08:00",
    endAt: "2026-04-12T21:00:00+08:00",
    status: "finished",
    venue: venues["nthu-mw"],
    categories: ["實體活動", "團體賽", "計分項目"],
    format: "team",
    teamSizeMin: 4,
    teamSizeMax: 4,
    registrationFee: 0,
    rules: [
      {
        title: "章程",
        content: "請詳閱活動章程（報名期間已公告於官方連結）。",
      },
    ],
    audienceNotes: ["請保持安靜，不要 hint"],
    isScored: true,
    scoreWeight: 1,
    organizerIds: ["chumei-committee"],
    result: {
      status: "official",
      publishedAt: "2026-04-22T12:00:00+08:00",
      winner: "NYCU",
      nthuScore: 0,
      nycuScore: 1,
      summary:
        "依 4/22 總錦標公告圖，臺灣麻將大賽由交通大學獲得校際勝利。",
    },
    socialLinks: [
      { platform: "Instagram", url: "https://www.instagram.com/p/DXbxyXpEvby/" },
      { platform: "Instagram", url: siteConfig.instagramUrl },
    ],
  },
  {
    id: "act-07",
    slug: "barcode-racing",
    year: 2026,
    index: 7,
    title: "刷條碼競速賽",
    subtitle: "一日超商人，終身超商魂",
    tagline: "〇〇系畢業，刷條碼預備！",
    description:
      "竹梅職前訓練所：盡情發揮大學所學專長——刷條碼。報名費 99 元／人。4/14 19:00–21:00 於交大二餐一樓完賽，交清條碼王為交大運管系傅靖閎。",
    heroImage: "/images/activities/barcode.jpg",
    cardImage: "/images/activities/barcode.jpg",
    startAt: "2026-04-14T19:00:00+08:00",
    endAt: "2026-04-14T21:00:00+08:00",
    status: "finished",
    venue: venues["nycu-dining2"],
    categories: ["實體活動", "個人賽", "計分項目"],
    format: "individual",
    registrationFee: 99,
    rules: [
      {
        title: "獎品",
        content:
          "第一名獲八小時基本時薪（新台幣 1568 元）；前八名可獲小徑 T（視參賽人數調整）。",
      },
    ],
    isScored: true,
    scoreWeight: 1,
    organizerIds: ["chumei-committee"],
    result: {
      status: "official",
      publishedAt: "2026-04-17T12:00:00+08:00",
      winner: "NYCU",
      nthuScore: 0,
      nycuScore: 1,
      summary: "恭喜交大運管系代表奪下交清條碼王的稱號。",
      rankings: [
        {
          rank: 1,
          school: "NYCU",
          teamName: "傅靖閎（運管系）",
        },
      ],
    },
    socialLinks: [{ platform: "Instagram", url: siteConfig.instagramUrl }],
  },
  {
    id: "act-08",
    slug: "two-school-rps",
    year: 2026,
    index: 8,
    title: "兩校憑拳",
    subtitle: "清華 × 交大猜拳對決",
    tagline: "報名費 20 塊，拿洗衣服的錢去東京玩",
    description:
      "2026 竹梅賽最後一個錦標。第一名獲日本東京機票，第二名飛機餅乾一包。4/17 16:00 於清交／交清小徑完賽，清華大學獲得校際競賽勝利；拳王為理學院學士班林沛函。",
    heroImage: "/images/activities/rps.jpg",
    cardImage: "/images/activities/rps.jpg",
    startAt: "2026-04-17T16:00:00+08:00",
    status: "finished",
    venue: venues["qingjiao-path"],
    categories: ["實體活動", "個人賽", "計分項目"],
    format: "individual",
    registrationFee: 20,
    rules: [
      {
        title: "報到",
        content: "需攜帶學生證或登入校務資訊系統備查；亦接受現場報名。",
      },
      {
        title: "獎品",
        content: "第一名日本東京機票；第二名飛機餅乾一包。",
      },
    ],
    isScored: true,
    scoreWeight: 1,
    organizerIds: ["chumei-committee"],
    result: {
      status: "official",
      publishedAt: "2026-04-18T12:00:00+08:00",
      winner: "NTHU",
      nthuScore: 1,
      nycuScore: 0,
      summary:
        "恭喜清華大學獲得兩校憑拳校際競賽勝利。隨著拳王誕生與機票送出，正賽項目告一段落。",
      rankings: [
        {
          rank: 1,
          school: "NTHU",
          teamName: "林沛函（理學院學士班）",
        },
        {
          rank: 2,
          school: "NTHU",
          teamName: "沈博暘（電機系）",
        },
        {
          rank: 3,
          school: "NTHU",
          teamName: "凌沛瀅（科管）／洪維晨（工科系）",
        },
      ],
    },
    socialLinks: [
      { platform: "Instagram", url: siteConfig.instagramUrl },
      { platform: "Linktree", url: siteConfig.linktreeUrl },
    ],
  },
  {
    id: "act-09",
    slug: "galaga-president",
    year: 2026,
    index: 9,
    title: "攻略校長旮拉給木",
    subtitle: "竹梅賽年度鉅獻",
    tagline: "好啊我沒差啊你繼續找理由玩嘎拉給木啊",
    description:
      "竹梅賽線上互動體驗，經典街機魂 × 校園迷因。可透過官方 Linktree 進入遊玩。",
    heroImage: "/images/activities/galaga.jpg",
    cardImage: "/images/activities/galaga.jpg",
    startAt: "2026-04-01T00:00:00+08:00",
    status: "ongoing",
    venue: venues.online,
    categories: ["線上活動", "個人賽", "非計分項目"],
    format: "individual",
    registrationFee: 0,
    registrationUrl: siteConfig.galagaUrl,
    rules: [
      {
        title: "參加方式",
        content: "開啟遊戲頁即可遊玩，無需實體報到。",
      },
    ],
    audienceNotes: ["線上隨時可玩", "建議使用電腦或平板"],
    isScored: false,
    organizerIds: ["chumei-committee"],
    socialLinks: [
      { platform: "Game", url: siteConfig.galagaUrl },
      { platform: "Instagram", url: siteConfig.instagramUrl },
    ],
  },
  {
    id: "act-10",
    slug: "barcode-taiko",
    year: 2026,
    index: 10,
    title: "條碼達人",
    subtitle: "竹梅季後賽第一彈",
    tagline: "免費參加",
    description:
      "季後賽：刷條碼太鼓達人。5/11 11:00–13:00 於清華大學野台舉行，免報名費。",
    heroImage: "/images/activities/barcode-taiko.jpg",
    cardImage: "/images/activities/barcode-taiko.jpg",
    startAt: "2026-05-11T11:00:00+08:00",
    endAt: "2026-05-11T13:00:00+08:00",
    status: "finished",
    venue: venues["nthu-yutai"],
    categories: ["實體活動", "季後賽", "非計分項目"],
    format: "individual",
    registrationFee: 0,
    rules: [
      {
        title: "參加方式",
        content: "免費參加，歡迎清交同學一起玩。",
      },
    ],
    isScored: false,
    organizerIds: ["chumei-committee"],
    socialLinks: [{ platform: "Instagram", url: siteConfig.instagramUrl }],
  },
  {
    id: "act-11",
    slug: "lawn-scream",
    year: 2026,
    index: 11,
    title: "期末週大草坪大尖叫",
    subtitle: "壓力很大嗎？",
    tagline: "現場發放休學單（竹委會先簽）",
    description:
      "6/1 23:59 清大大草坪集合大尖叫。現場可能有能量飲料；並有追 IG 抽電動滑板車活動。",
    heroImage: "/images/activities/lawn-scream.jpg",
    cardImage: "/images/activities/lawn-scream.jpg",
    startAt: "2026-06-01T23:59:00+08:00",
    status: "finished",
    venue: venues["nthu-lawn"],
    categories: ["實體活動", "季後賽", "非計分項目"],
    format: "individual",
    registrationFee: 0,
    rules: [
      {
        title: "集合",
        content: "清大大草坪，23:59 不見不散。",
      },
    ],
    isScored: false,
    organizerIds: ["chumei-committee"],
    socialLinks: [{ platform: "Instagram", url: siteConfig.instagramUrl }],
  },
];

export function getActivityBySlug(slug: string): Activity | undefined {
  return activities.find((a) => a.slug === slug);
}

export function getOpenRegistrationActivities(): Activity[] {
  return activities.filter(
    (a) =>
      a.status === "registration_open" ||
      a.status === "registration_closing" ||
      a.status === "waitlist",
  );
}

export function getNextActivity(): Activity | undefined {
  const now = new Date();
  const upcoming = activities
    .filter(
      (a) =>
        new Date(a.startAt) >= now &&
        a.status !== "finished" &&
        a.status !== "cancelled",
    )
    .sort(
      (a, b) =>
        new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
    );
  if (upcoming[0]) return upcoming[0];

  const actionable = activities.find(
    (a) =>
      a.status === "registration_open" ||
      a.status === "registration_closing" ||
      a.status === "ongoing",
  );
  return actionable;
}

export function getRecentResults(): Activity[] {
  return activities
    .filter((a) => a.result?.status === "official")
    .sort(
      (a, b) =>
        new Date(b.startAt).getTime() - new Date(a.startAt).getTime(),
    );
}
