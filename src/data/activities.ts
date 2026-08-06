import type { Activity } from "@/types";
import { venues } from "./venues";
import { siteConfig } from "./site";

export const activities: Activity[] = [
  {
    id: "act-03",
    slug: "dinosaur-race",
    year: 2026,
    index: 3,
    title: "恐龍賽跑",
    subtitle: "再辦一屆恐龍ㄟ賽啦",
    tagline: "再辦一屆恐龍ㄟ賽啦",
    description:
      "穿上恐龍裝，在大草坪上進行最荒謬的短跑對決。不是比誰跑最快，是比誰的恐龍最像真的在追獵物。",
    heroImage: "/images/activities/dinosaur-race.svg",
    cardImage: "/images/activities/dinosaur-race.svg",
    startAt: "2026-03-29T14:00:00+08:00",
    status: "finished",
    venue: venues["nthu-lawn"],
    categories: ["實體活動", "個人賽", "計分項目"],
    format: "individual",
    teamSizeMin: 1,
    teamSizeMax: 1,
    participantLimit: 32,
    registrationFee: 0,
    rules: [
      {
        title: "勝負條件",
        content:
          "各組穿著完整恐龍裝，完成 50 公尺直線賽道。最先衝線且恐龍裝未脫落者獲勝。",
      },
      {
        title: "比賽流程",
        content: "報到 → 恐龍裝檢查 → 分組熱身 → 預賽 → 決賽 → 頒獎。",
      },
      {
        title: "違規與判定",
        content:
          "中途脫下恐龍頭套、推擠對手、或恐龍裝不完整者，由裁判判定失格或加時。",
      },
    ],
    safetyNotes: ["請穿著運動鞋", "恐龍裝需自行準備或現場租借"],
    audienceNotes: ["開放觀賽", "建議攜帶防曬用品"],
    isScored: true,
    scoreWeight: 1,
    organizerIds: ["chumei-committee"],
    result: {
      status: "official",
      publishedAt: "2026-03-29T16:30:00+08:00",
      winner: "NTHU",
      nthuScore: 1,
      nycuScore: 0,
      summary:
        "清華恐龍軍團以些微優勢險勝，現場觀眾表示「這真的有必要辦第二屆嗎」——有的。",
      rankings: [
        { rank: 1, school: "NTHU", teamName: "清恐龍突擊隊", score: "12.4s" },
        { rank: 2, school: "NYCU", teamName: "狐龍混合種", score: "12.7s" },
        { rank: 3, school: "NTHU", teamName: "熊貓騎恐龍", score: "13.1s" },
      ],
    },
    socialLinks: [
      { platform: "Instagram", url: siteConfig.instagramUrl },
    ],
  },
  {
    id: "act-04",
    slug: "office-chair-racing",
    year: 2026,
    index: 4,
    title: "辦公椅競速",
    subtitle: "輪子準備失控",
    tagline: "輪子準備失控",
    description:
      "用辦公椅在體育館賽道上一決高下。參賽者需自備或租借符合規格的辦公椅，這不是普通的滑椅，這是尊嚴之戰。",
    heroImage: "/images/activities/office-chair.svg",
    cardImage: "/images/activities/office-chair.svg",
    startAt: "2026-04-05T15:00:00+08:00",
    registrationStartAt: "2026-03-20T00:00:00+08:00",
    registrationEndAt: "2026-04-03T23:59:00+08:00",
    status: "finished",
    venue: venues["nthu-gym"],
    categories: ["實體活動", "個人賽", "計分項目"],
    format: "individual",
    teamSizeMin: 1,
    teamSizeMax: 1,
    participantLimit: 24,
    registrationFee: 0,
    registrationUrl: siteConfig.linktreeUrl,
    rules: [
      {
        title: "勝負條件",
        content:
          "以辦公椅完成環形賽道，禁止雙腳著地推進。最先完成規定圈數者獲勝。",
      },
      {
        title: "器材規範",
        content: "椅子需有滾輪、無扶手或可拆卸扶手。禁止改裝電動裝置。",
      },
      {
        title: "安全限制",
        content: "必須佩戴護膝，速度超過安全上限者将被裁判叫停。",
      },
    ],
    safetyNotes: ["請佩戴護膝", "禁止改裝電動椅子"],
    isScored: true,
    scoreWeight: 1,
    organizerIds: ["chumei-committee"],
    result: {
      status: "official",
      publishedAt: "2026-04-05T17:00:00+08:00",
      winner: "NYCU",
      nthuScore: 0,
      nycuScore: 1,
      summary: "陽明交大以穩定過彎技術奪冠，清華選手則留下華麗翻椅名場面。",
    },
  },
  {
    id: "act-05",
    slug: "mahjong",
    year: 2026,
    index: 5,
    title: "麻將大賽",
    subtitle: "牌桌之上，友誼（可能）破裂",
    tagline: "牌桌之上，友誼（可能）破裂",
    description:
      "清交對決的麻將大賽，四個人一桌，八個人心碎。規則遵循台灣十六張麻將，但心理戰強度不亞於任何正式賽事。",
    heroImage: "/images/activities/mahjong.svg",
    cardImage: "/images/activities/mahjong.svg",
    startAt: "2026-04-11T19:00:00+08:00",
    status: "finished",
    venue: venues["nthu-mw"],
    categories: ["實體活動", "團體賽", "計分項目"],
    format: "team",
    teamSizeMin: 4,
    teamSizeMax: 4,
    participantLimit: 64,
    registrationFee: 0,
    registrationUrl: siteConfig.linktreeUrl,
    rules: [
      {
        title: "勝負條件",
        content: "採積分制，各桌打完規定局數後，依總積分排名。",
      },
      {
        title: "比賽流程",
        content: "報到 → 抽籤分桌 → 初賽 → 複賽 → 決賽。",
      },
    ],
    audienceNotes: ["開放觀賽", "請保持安靜，不要 hint"],
    isScored: true,
    scoreWeight: 1,
    organizerIds: ["chumei-committee"],
    result: {
      status: "official",
      publishedAt: "2026-04-12T00:30:00+08:00",
      winner: "NTHU",
      nthuScore: 1,
      nycuScore: 0,
      summary: "清華牌桌軍團連庄取勝，現場氣氛一度需要冷靜一下。",
    },
  },
  {
    id: "act-06",
    slug: "alcohol-calculus",
    year: 2026,
    index: 6,
    title: "酒精微積分",
    subtitle: "用微積分算酒量，用酒量解微積分",
    tagline: "用微積分算酒量，用酒量解微積分",
    description:
      "一邊解微積分題目，一邊完成指定非酒精飲料挑戰（未滿 18 歲僅解題）。這是竹梅賽最學術也最不學術的項目。",
    heroImage: "/images/activities/calculus.svg",
    cardImage: "/images/activities/calculus.svg",
    startAt: "2026-04-18T18:30:00+08:00",
    status: "finished",
    venue: venues["nthu-library"],
    categories: ["實體活動", "個人賽", "非計分項目"],
    format: "individual",
    participantLimit: 40,
    registrationFee: 0,
    rules: [
      {
        title: "勝負條件",
        content:
          "在時限內完成最多正確微積分題目。同分時以完成速度決定勝負。",
      },
      {
        title: "特殊情況",
        content: "未滿 18 歲參賽者僅參與解題部分，飲料替換為無糖茶。",
      },
    ],
    safetyNotes: ["未滿 18 歲禁止飲酒", "活動提供非酒精選項"],
    isScored: false,
    organizerIds: ["chumei-committee"],
  },
  {
    id: "act-07",
    slug: "galaga-president",
    year: 2026,
    index: 7,
    title: "攻略校長旮拉給木",
    subtitle: "竹梅賽年度鉅獻",
    tagline: "好啊我沒差啊你繼續找理由玩嘎拉給木啊",
    description:
      "竹梅賽年度鉅獻線上互動體驗。經典街機魂 × 校園迷因，考驗反應速度、策略，以及面對權威時的手抖程度。現已上線，清交人快來挑戰。",
    heroImage: "/images/activities/galaga.svg",
    cardImage: "/images/activities/galaga.svg",
    startAt: "2026-04-25T14:00:00+08:00",
    status: "ongoing",
    venue: venues["online"],
    categories: ["線上活動", "個人賽", "非計分項目"],
    format: "individual",
    participantLimit: undefined,
    registrationFee: 0,
    registrationUrl: siteConfig.galagaUrl,
    rules: [
      {
        title: "勝負條件",
        content: "完成關卡挑戰，挑戰自我高分紀錄。詳見遊戲內說明。",
      },
      {
        title: "參加方式",
        content: "開啟活動頁即可遊玩，無需實體報到。",
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
    id: "act-08",
    slug: "rock-paper-scissors-flight",
    year: 2026,
    index: 8,
    title: "猜拳贏機票",
    subtitle: "三局兩勝，贏了機票飛哪裡看運氣",
    tagline: "剪刀石頭布，但機票在線",
    description:
      "最純粹的運氣對決。三局兩勝，贏家獲得機票抽獎資格。輸的人獲得下次再來的勇氣。報名表單現正開放中。",
    heroImage: "/images/activities/rps.svg",
    cardImage: "/images/activities/rps.svg",
    startAt: "2026-08-30T13:00:00+08:00",
    registrationStartAt: "2026-07-01T00:00:00+08:00",
    registrationEndAt: "2026-08-25T23:59:00+08:00",
    status: "registration_open",
    venue: venues["nthu-mw"],
    categories: ["實體活動", "個人賽", "非計分項目"],
    format: "individual",
    participantLimit: 128,
    registrationFee: 0,
    registrationUrl: siteConfig.rpsFormUrl,
    rules: [
      {
        title: "勝負條件",
        content: "三局兩勝制，標準剪刀石頭布規則。",
      },
      {
        title: "報名資訊",
        content: "請填寫官方報名表單，名額有限，額滿為止。",
      },
    ],
    isScored: false,
    organizerIds: ["chumei-committee"],
    socialLinks: [
      { platform: "報名表單", url: siteConfig.rpsFormUrl },
      { platform: "Linktree", url: siteConfig.linktreeUrl },
    ],
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

  // Prefer actionable ongoing / open-registration activities when season is between events
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
