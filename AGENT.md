# AGENT.md — 竹梅賽官方網站開發規範

## 0. 文件目的

本文件定義竹梅賽官方網站的產品目標、網站架構、資訊模型、視覺系統、元件規範、內容原則、技術要求與開發限制。

所有 AI Agent、開發者、設計者與內容維護者，在新增頁面、修改元件、撰寫文案或調整樣式前，皆應先閱讀本文件。

網站的核心任務不是單純介紹竹梅賽，而是成為以下內容的正式入口：

1. 活動總覽
2. 報名與參賽資訊
3. 日期、場地與規則查詢
4. 最新公告
5. 比賽結果與總錦標
6. 活動照片、影片與歷屆紀錄
7. 竹梅賽品牌與文化展示

---

# 1. 品牌定位

## 1.1 一句話定位

竹梅賽是一個以正式校際競賽形式，舉辦荒謬、創意且高度參與式校園活動的學生文化平台。

## 1.2 核心精神

網站必須同時呈現以下兩種特質：

- 資訊上清楚、正式、可靠
- 內容上荒謬、幽默、有校園感

最重要的品牌反差是：

> 看起來像正式大型錦標賽，但比賽項目完全不正常。

## 1.3 品牌關鍵字

- 一本正經地胡鬧
- 校園迷因
- 荒謬競技
- 清交共同文化
- 趣味對抗
- 高參與感
- 速度感
- 警示感
- 綜藝感
- 學生自辦

## 1.4 品牌不應成為

- 正式體育官網的複製品
- 純可愛風活動網站
- 只有黃色與黑色的普通活動頁
- 只放品牌理念、沒有實用功能的形象網站
- 完全依賴 Instagram 圖片的內容集合
- 為了有趣而犧牲可讀性與操作性的迷因網站

---

# 2. 產品目標

## 2.1 第一優先目標

使用者進入網站後，應能在 10 秒內知道：

1. 下一場活動是什麼（若賽季已結束：改為總錦標結果或仍開放的線上活動）
2. 活動何時、在哪裡舉辦
3. 現在是否可以報名（若無開放報名：改顯示總比分／近期活動／Linktree）
4. 目前總比分或最新結果
5. 如何查看全部活動

## 2.2 主要使用者

### 參賽者

需要快速取得：

- 活動內容
- 日期與時間
- 地點
- 參賽資格
- 隊伍人數
- 規則
- 報名連結
- 報名截止時間
- 集合資訊
- 注意事項
- 比賽結果

### 觀眾

需要快速取得：

- 今日或近期活動
- 開始時間
- 場地
- 地圖
- 是否開放觀賽
- 是否有直播
- 最新比分
- 精彩照片與影片

### 籌備團隊

需要能管理：

- 活動資料
- 報名狀態
- 公告
- 結果
- 總錦標
- 圖片與影片
- 合作單位
- 歷屆資料

### 合作單位與贊助商

需要看到：

- 活動規模
- 品牌定位
- 歷屆成果
- 合作曝光
- 聯絡方式
- 合作提案入口

---

# 3. 網站架構

## 3.1 建議 Sitemap

```text
/
├─ activities
│  ├─ index
│  └─ [slug]
├─ schedule
├─ scoreboard
├─ news
│  ├─ index
│  └─ [slug]
├─ gallery
│  ├─ index
│  └─ [year]
├─ history
│  ├─ index
│  └─ [year]
├─ about
├─ partners
├─ join
└─ contact
```

## 3.2 主導覽

桌面版主導覽：

```text
首頁
活動總覽
賽程
比分與結果
最新消息
歷屆竹梅
關於竹梅
```

右側主要行動按鈕：

```text
目前開放報名
```

若沒有開放報名，改為：

```text
查看近期活動
```

手機版導覽順序：

```text
近期活動
開放報名
賽程
比分與結果
最新消息
歷屆竹梅
關於竹梅
```

## 3.3 首頁架構

首頁區塊順序如下：

```text
Header
Hero
下一場活動
目前開放報名
總錦標
2026 活動總覽
最新公告
最近結果
精選回顧
合作夥伴
Footer
```

### Hero 必須包含

- 年度名稱
- 年度主標語
- 竹梅賽一句話描述
- 下一場活動摘要
- 主要 CTA
- 次要 CTA
- 當前總比分或活動狀態

Hero 不應只有品牌理念。

### 下一場活動

應顯示：

- 活動名稱
- 一句話副標
- 日期
- 時間
- 地點
- 報名狀態
- 觀賽狀態
- 查看詳情
- 加入行事曆
- 開啟地圖

### 目前開放報名

只顯示尚可採取行動的活動：

- 報名中
- 即將截止
- 候補中

若沒有活動開放報名，顯示下一次預計開放時間或近期活動。

### 總錦標

至少包含：

- 清華大學積分
- 陽明交通大學積分
- 平手或未計分狀態
- 下一個計分項目
- 查看完整結果

### 活動總覽

至少支援：

- 日期排序
- 狀態標籤
- 活動主視覺
- 一句話玩法
- 日期與地點
- 報名按鈕
- 詳情按鈕

### 最新公告

內容類型：

- 報名公告
- 規則更新
- 場地異動
- 活動延期
- 結果公告
- 物資領取
- 合作消息

### 精選回顧

顯示：

- 活動照片
- 短影片
- 最荒謬時刻
- 得獎者
- 活動數據
- Instagram 原貼文連結

---

# 4. 頁面規格

## 4.1 活動總覽 `/activities`

### 功能

- 顯示所有當屆活動
- 支援依狀態、日期、類型篩選
- 支援搜尋
- 支援桌面與手機瀏覽

### 篩選條件

- 全部
- 報名中
- 即將開始
- 進行中
- 已結束
- 延期或取消
- 計分項目
- 非計分項目
- 個人賽
- 團體賽
- 線上活動
- 實體活動

### 活動卡片欄位

- 編號
- 活動名稱
- 英文或裝飾性副標
- 一句話文案
- 圖片
- 日期
- 時間
- 地點
- 活動狀態
- 報名狀態
- 是否計入總錦標
- 主辦或協辦單位
- 查看詳情

## 4.2 單一活動頁 `/activities/[slug]`

### 頁面區塊

```text
活動 Hero
重要資訊列
活動介紹
報名資訊
參賽資格
活動流程
比賽規則
安全與注意事項
場地資訊
合作單位
最新公告
比賽結果
照片與影片
其他推薦活動
```

### 活動 Hero

必須顯示：

- 活動名稱
- 活動副標
- 活動主視覺
- 活動狀態
- 日期與時間
- 場地
- 報名 CTA
- 是否計入總錦標

### 報名區

必須顯示：

- 報名狀態
- 報名截止時間
- 報名連結
- 參賽人數限制
- 隊伍人數
- 報名費
- 候補規則
- 報名成功確認方式

### 規則區

規則必須以 HTML 文字呈現，不得只放在圖片中。

規則應拆分為：

- 勝負條件
- 比賽流程
- 違規與判定
- 器材規範
- 安全限制
- 特殊情況處理

### 場地區

包含：

- 場地名稱
- 校區
- 地址或校內位置
- 地圖
- 集合點
- 入場方式
- 開啟地圖按鈕

### 結果區

包含：

- 冠軍
- 亞軍
- 季軍
- 所屬學校
- 隊伍名稱
- 成績
- 是否影響總錦標
- 完整排名
- 活動照片
- 頒獎資訊

若尚未有結果，整個結果區應隱藏或顯示簡短提示，不要保留大量空區塊。

## 4.3 賽程頁 `/schedule`

### 顯示模式

- 今日
- 本週
- 全部
- 日曆
- 時間軸

### 每筆資料

- 日期
- 時間
- 活動名稱
- 地點
- 狀態
- 報名狀態
- 觀賽資訊
- 詳情連結

### 行動功能

- 加入 Google Calendar
- 下載 ICS
- 開啟地圖
- 分享活動

## 4.4 比分與結果 `/scoreboard`

### 頁面內容

- 當前總比分
- 各活動計分
- 已完成活動
- 尚未進行活動
- 計分規則
- 歷屆總比分

### 計分表欄位

- 活動
- 清華得分
- 陽明交大得分
- 狀態
- 完成日期
- 查看結果

若部分活動不計入總錦標，必須明確標示「非計分項目」。

## 4.5 最新消息 `/news`

### 文章分類

- 重要公告
- 報名
- 規則
- 活動異動
- 結果
- 物資領取
- 合作
- 幕後

### 文章頁內容

- 標題
- 發布時間
- 更新時間
- 分類
- 內文
- 相關活動
- 附件
- 相關連結

重要公告應可固定置頂。

## 4.6 歷屆竹梅 `/history`

### 年度列表

每年包含：

- 年度名稱
- 年度主視覺
- 總比分
- 活動數量
- 經典活動
- 年度回顧
- 照片
- 影片
- 得獎紀錄

### 歷史時間軸

記錄：

- 竹梅賽創立
- 重要活動
- 經典項目
- 停辦與復辦
- 歷屆特色
- 品牌變化

歷史頁的重點不是只有總比分，而是保存校園文化與荒謬活動。

## 4.7 圖庫 `/gallery`

### 分類

- 依年度
- 依活動
- 照片
- 影片
- 得獎時刻
- 幕後花絮

### 顯示原則

- 圖片必須有替代文字
- 不得上傳未壓縮大圖
- 支援燈箱檢視
- 可連到對應活動頁
- 可連到 Instagram 原貼文

## 4.8 關於竹梅 `/about`

包含：

- 竹梅賽是什麼
- 與梅竹賽的差異
- 竹梅精神
- 活動理念
- 籌備團隊
- 聯絡方式
- 歷史簡介

此頁應精簡，不應取代活動總覽或首頁。

## 4.9 合作夥伴 `/partners`

包含：

- 贊助商
- 協辦社團
- 場地協力
- 器材協力
- 媒體合作
- 歷屆合作成果
- 合作提案下載
- 合作聯絡方式

## 4.10 加入竹梅 `/join`

包含：

- 加入籌備團隊
- 成為活動協辦
- 提案新活動
- 志工招募
- 攝影或媒體合作
- 贊助合作

---

# 5. 內容模型

## 5.1 Activity

```ts
type ActivityStatus =
  | "draft"
  | "announced"
  | "registration_open"
  | "registration_closing"
  | "waitlist"
  | "full"
  | "upcoming"
  | "ongoing"
  | "finished"
  | "postponed"
  | "cancelled";

type Activity = {
  id: string;
  slug: string;
  year: number;
  index?: number;
  title: string;
  shortTitle?: string;
  subtitle?: string;
  description: string;
  tagline?: string;
  heroImage: string;
  cardImage?: string;
  startAt: string;
  endAt?: string;
  registrationStartAt?: string;
  registrationEndAt?: string;
  status: ActivityStatus;
  venue: Venue;
  categories: string[];
  format: "individual" | "team";
  teamSizeMin?: number;
  teamSizeMax?: number;
  participantLimit?: number;
  registrationFee?: number;
  registrationUrl?: string;
  waitlistUrl?: string;
  rules: RuleSection[];
  safetyNotes?: string[];
  audienceNotes?: string[];
  isScored: boolean;
  scoreWeight?: number;
  organizerIds: string[];
  partnerIds?: string[];
  result?: ActivityResult;
  galleryIds?: string[];
  relatedNewsIds?: string[];
  socialLinks?: SocialLink[];
};
```

## 5.2 Venue

```ts
type Venue = {
  id: string;
  name: string;
  campus: "NTHU" | "NYCU" | "OTHER";
  address?: string;
  description?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  meetingPoint?: string;
  accessibilityNotes?: string;
};
```

## 5.3 ActivityResult

```ts
type ActivityResult = {
  status: "unpublished" | "provisional" | "official";
  publishedAt?: string;
  nthuScore?: number;
  nycuScore?: number;
  winner?: "NTHU" | "NYCU" | "DRAW" | "NONE";
  rankings?: Ranking[];
  summary?: string;
};
```

## 5.4 News

```ts
type NewsCategory =
  | "important"
  | "registration"
  | "rules"
  | "change"
  | "result"
  | "pickup"
  | "partner"
  | "behind_the_scenes";

type NewsPost = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: NewsCategory;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  content: string;
  relatedActivityIds?: string[];
  pinned?: boolean;
};
```

---

# 6. 視覺系統

## 6.1 整體概念

竹梅賽網站使用兩種互補模式：

### Light Mode：校園綜藝模式

用於：

- 活動總覽
- 關於竹梅
- 歷史
- 一般內容
- 卡片列表

視覺元素：

- 白色背景
- 淺灰方格紙
- 黃色主色
- 亮藍色輔色
- 圓形編號
- 黃色圓角長條
- 粗體標題
- 幽默副標

### Dark Mode：地下競速模式

用於：

- 首頁 Hero
- 重要公告
- 倒數
- 比賽結果
- 即將開始
- 高張力 Banner

視覺元素：

- 黑色背景
- 黃黑或黃綠警示條
- 白色斜體粗字
- 磨損材質
- 高對比黃色資訊框
- 速度線
- 工業警示符號

兩種模式必須共享相同的 Logo、字體系統、圓角規則與資訊階層。

## 6.2 顏色設定

建議 CSS Variables：

```css
:root {
  --color-brand-yellow: #FFBF00;
  --color-brand-yellow-hover: #E5AA00;
  --color-signal-lime: #D7F238;
  --color-brand-blue: #19A9E5;

  --color-black: #0A0A0A;
  --color-charcoal: #1A1A1A;
  --color-dark-gray: #333333;
  --color-gray: #777777;
  --color-light-gray: #E9E9E9;
  --color-grid: rgba(10, 10, 10, 0.08);
  --color-white: #FFFFFF;

  --color-success: #1E9E58;
  --color-warning: #FFBF00;
  --color-danger: #D92D20;
  --color-info: #19A9E5;

  --color-nthu: #7A1F40;
  --color-nycu: #1E4E8C;
  --color-draw: #666666;
}
```

### 顏色使用原則

- 品牌黃是主要 CTA 與品牌識別色。
- 亮藍色主要用於編號、次要資訊與 Light Mode。
- 螢光黃綠只用於警示、倒數與高張力區塊。
- 清華與陽明交大代表色只用於比分、隊伍與學校資訊。
- 不可用品牌黃同時代表其中一校。
- 警告、錯誤、取消等狀態不得只依靠顏色傳達。

## 6.3 字體

### 正文與介面字體

優先順序：

```css
font-family:
  "Noto Sans TC",
  "PingFang TC",
  "Microsoft JhengHei",
  sans-serif;
```

### Display 字體

使用粗體、壓縮感或斜體的繁體中文字體。

若專案沒有合法授權的 Display 字體，使用 Noto Sans TC Black 搭配：

- `font-weight: 900`
- 輕微 `transform: skewX(-4deg)`
- 限定於大標
- 不可對正文使用

### 字體層級

```css
--font-size-display-xl: clamp(3rem, 8vw, 7rem);
--font-size-display-lg: clamp(2.5rem, 6vw, 5rem);
--font-size-h1: clamp(2rem, 4vw, 3.5rem);
--font-size-h2: clamp(1.75rem, 3vw, 2.5rem);
--font-size-h3: clamp(1.375rem, 2vw, 1.75rem);
--font-size-body-lg: 1.125rem;
--font-size-body: 1rem;
--font-size-small: 0.875rem;
--font-size-caption: 0.75rem;
```

### 使用限制

- 描邊字只用於主視覺或活動標題。
- 規則、時間、地點與按鈕不得使用磨損字或描邊字。
- 長篇正文行長建議 60 至 75 個中文字。
- 正文行高至少 1.7。
- 小字不得低於 14px。

## 6.4 圓角

```css
--radius-sm: 8px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-pill: 999px;
```

使用原則：

- 按鈕：`radius-pill` 或 `radius-md`
- 活動卡片：`radius-lg`
- 狀態標籤：`radius-pill`
- 公告資訊框：`radius-md`

## 6.5 邊框與陰影

### Light Mode

- 邊框：2px 至 4px 品牌黃或黑色
- 卡片陰影：偏硬、偏圖像化
- 可使用 4px 至 8px 黑色偏移陰影

### Dark Mode

- 避免柔和的大面積陰影
- 以高對比邊框、警示條和實色區塊建立層次

## 6.6 方格背景

Light Mode 可使用淡灰格線：

```css
background-image:
  linear-gradient(var(--color-grid) 1px, transparent 1px),
  linear-gradient(90deg, var(--color-grid) 1px, transparent 1px);
background-size: 40px 40px;
```

限制：

- 格線透明度必須低。
- 文字密集區塊可改用純白底。
- 手機版可加大格線間距或關閉。

## 6.7 警示條紋

警示條紋只用於：

- 重要公告
- 開賽倒數
- 活動異動
- 報名即將截止
- Hero 裝飾
- Footer 局部裝飾

不可將警示條紋作為所有區塊分隔線。

建議：

```css
background:
  repeating-linear-gradient(
    -55deg,
    var(--color-black) 0 24px,
    var(--color-signal-lime) 24px 48px
  );
```

## 6.8 紋理

允許使用：

- 紙張顆粒
- 磨損
- 印刷錯位
- 工業噪點
- 速度線

限制：

- 紋理不得降低正文可讀性。
- 不得套用在表單輸入框。
- 不得套用在規則正文。
- 不得讓背景與文字對比低於 WCAG AA。

---

# 7. 元件規範

## 7.1 Button

### Primary

- 黃底黑字
- 粗體
- 高度至少 48px
- Hover 時略微上移或增加硬陰影

### Secondary

- 黑底白字
- 或透明底加 2px 黑框

### Warning

- 黑底或深灰底
- 搭配黃黑警示區塊
- 只用於重要公告或時效性行動

### Disabled

- 降低對比
- 不可只降低透明度到難以閱讀
- 必須不可點擊

## 7.2 Status Badge

正式狀態名稱必須清楚。

可搭配竹梅式文案，但不可取代正式狀態。

範例：

```text
恐龍已全數孵化
報名已額滿
```

```text
本場荒謬完賽
活動已結束
```

```text
最後召集
報名將於 24 小時後截止
```

## 7.3 Activity Card

### 桌面版

左側：

- 圓形編號或日期

中間：

- 活動名稱
- 幽默副標
- 日期與地點
- 狀態

右側：

- 主視覺
- CTA

### 手機版

順序：

1. 圖片
2. 狀態
3. 活動名稱
4. 副標
5. 日期與地點
6. CTA

### 卡片視覺

可使用第一套主視覺語言：

- 藍色圓形編號
- 黃色標題條
- 白底格線
- 黑色文案

## 7.4 Scoreboard

必須清楚區分：

- 清華
- 陽明交大
- 平手
- 未比賽
- 非計分項目

比分數字應是最高視覺層級之一。

手機版不得使用過寬表格，應改為卡片或直向排列。

## 7.5 Announcement Banner

可使用第二套視覺語言：

- 黑底
- 上下警示條
- 黃色小標
- 白色斜體主標
- 黃色資訊框

每頁最多一個高張力公告 Banner。

## 7.6 Empty State

空資料狀態應簡短：

```text
目前沒有開放報名的活動。
下一波活動資訊將在這裡公布。
```

不要保留空白大標題與空區塊。

---

# 8. 文案規範

## 8.1 語氣

竹梅文案應：

- 直接
- 有節奏
- 能適度玩梗
- 像學生說話
- 不使用官腔
- 不使用過度文青語言
- 不犧牲資訊清楚度

## 8.2 雙層文案原則

每個重要狀態可使用：

1. 竹梅式趣味標題
2. 正式資訊說明

例如：

```text
恐龍蛋已全數孵化
本活動報名已額滿。
```

```text
輪子準備失控
辦公椅錦標賽將於 30 分鐘後開始。
```

## 8.3 活動名稱

活動正式名稱必須固定，不可在不同頁面任意變更。正式名稱以 Instagram／籌委會公告為準，官網 `src/data/activities.ts` 為唯一實作來源。

2026 屆正式名稱範例：

- 金剛大戰哥吉拉
- 恐龍賽跑
- 酒精微積分
- 辦公椅錦標賽
- 日本麻將推廣賽
- 四人臺灣麻將（公告圖亦可稱「臺灣麻將大賽」）
- 刷條碼競速賽
- 兩校憑拳
- 攻略校長旮拉給木
- 條碼達人
- 期末週大草坪大尖叫

可額外加副標，但正式名稱要一致。不得自行改成「猜拳贏機票」等非正式別名作為頁面主標題（可作副標或說明）。

## 8.3.1 年度命名

- 官網年度名稱固定為「2026 竹梅賽」這類西元年＋竹梅賽格式。
- **不得**在官網使用天干地支屆名（例如「丙午竹梅」），即使部分社群貼文曾出現類似寫法。
- 不得虛構尚未有正式資料的歷屆（例如無來源就寫 2024／2025 屆）。

## 8.4 日期與時間

統一格式：

```text
2026 年 4 月 11 日（六）19:00
```

列表可簡化為：

```text
04/11（六）19:00
```

不得只寫：

```text
這週六晚上
```

## 8.5 學校名稱

正式內容：

- 國立清華大學
- 國立陽明交通大學

比分與短版介面：

- 清華
- 陽明交大

不得在正式官網使用容易混淆或不一致的縮寫。

---

# 9. 響應式設計

## 9.1 Mobile First

網站主要使用情境是手機與 Instagram 內建瀏覽器。

優先支援：

- 360px
- 390px
- 430px
- 768px
- 1024px
- 1440px

## 9.2 手機版要求

- 首屏必須看到下一場活動或目前開放報名。
- 按鈕高度至少 44px，建議 48px。
- 不使用橫向大表格。
- 長規則使用摺疊區塊與目錄。
- 活動卡片採單欄。
- 導覽列使用抽屜或全螢幕選單。
- 場地應提供一鍵開啟地圖。
- 報名按鈕不得藏在頁面最底部。
- 固定 CTA 不得遮擋內容。

## 9.3 桌面版要求

- 最大內容寬度 1200px 至 1440px。
- Hero 可採雙欄或滿版。
- 活動卡片可採 2 至 3 欄。
- 規則與側邊資訊可採雙欄。
- 保留足夠留白，不要將所有區塊塞滿。

---

# 10. 動畫與互動

## 10.1 可使用

- CTA 輕微位移
- 速度線短動畫
- 計分數字切換
- 活動卡片 Hover
- 倒數計時
- 警示條緩慢移動
- 圖片輕微縮放
- 進場淡入或滑入

## 10.2 不可使用

- 長時間遮擋頁面的開場動畫
- 強制播放音效
- 無法跳過的 Loading 動畫
- 大量閃爍
- 過度視差
- 影響閱讀的背景持續移動
- 每個元件都獨立動畫

## 10.3 Reduced Motion

必須支援：

```css
@media (prefers-reduced-motion: reduce)
```

關閉非必要動畫。

---

# 11. 可用性與無障礙

## 11.1 基本要求

- 符合 WCAG 2.2 AA。
- 文字與背景有足夠對比。
- 所有圖片有替代文字。
- 表單欄位有 Label。
- 所有操作可使用鍵盤完成。
- Focus 狀態清楚。
- 不以顏色作為唯一資訊。
- 對話框可正確管理焦點。
- 標題層級正確。
- 連結文字需描述目的。

## 11.2 圖片文字

Instagram 宣傳圖上的重要資訊，必須轉寫為 HTML 文字。

不得只放圖片，讓使用者自行辨認：

- 日期
- 地點
- 報名截止
- 規則
- 得獎名單
- 活動異動

---

# 12. SEO 與分享

## 12.1 每頁 Metadata

每個活動頁必須有：

- Title
- Description
- Canonical URL
- Open Graph Title
- Open Graph Description
- Open Graph Image
- Twitter Card
- 結構化資料

範例：

```text
Title:
2026 竹梅賽恐龍賽跑｜報名、規則與結果

Description:
查看 2026 竹梅賽恐龍賽跑的日期、地點、參賽資格、比賽規則、報名資訊與最新結果。
```

## 12.2 URL

使用清楚且固定的英文 slug：

```text
/activities/dinosaur-race
/activities/alcohol-calculus
/activities/office-chair-racing
```

不得使用隨機 ID 當主要公開 URL。

## 12.3 分享預覽

分享至 LINE、Discord、Facebook、Messenger 時，應顯示：

- 活動名稱
- 日期
- 報名狀態
- 活動主視覺
- 官網網址

---

# 13. 效能要求

## 13.1 圖片

- 優先使用 AVIF 或 WebP。
- 必須提供正確尺寸。
- Hero 圖片預載入。
- 非首屏圖片 Lazy Load。
- 不上傳未壓縮原始圖片。
- 圖片應使用響應式 `srcset`。

## 13.2 Core Web Vitals

目標：

- LCP < 2.5 秒
- INP < 200ms
- CLS < 0.1

## 13.3 JavaScript

- 優先使用伺服器渲染或靜態產生。
- 非必要功能不得加入大型套件。
- 動畫套件需審慎使用。
- Instagram Embed 不應阻塞主要內容載入。

---

# 14. 資料與內容管理

## 14.1 單一資料來源

活動日期、地點、狀態與規則應有唯一正式資料來源。本專案實作為 `src/data/*`（尤其 `activities.ts`、`site.ts`、`news.ts`、`history.ts`）。

社群（Instagram／Linktree）用於核對與導流，但官網呈現必須由 `src/data` 生成，不得手寫第二套互相矛盾的日期或比分。

不得出現：

- 首頁一個日期
- IG 一個日期
- 活動頁另一個日期

賽果若僅出現在 IG 圖片（例如總錦標公告圖），應寫入 `activities.ts`／`site.ts`，並在消息或比分頁附上來源連結。

所有頁面應由同一份資料生成。進度摘要同步維護於 `DEVELOPMENT.md`。

## 14.2 更新紀錄

重要內容更新時，應記錄：

- 更新時間
- 更新內容
- 是否需要置頂公告
- 是否需要同步社群

## 14.3 活動狀態自動化

可依日期自動推導：

- 尚未開放
- 報名中
- 報名截止
- 即將開始
- 進行中
- 已結束

但管理者必須可手動覆寫，處理延期、取消或臨時異動。

---

# 15. 開發原則

## 15.1 元件化

優先建立可重用元件：

```text
Header
MobileMenu
Hero
AnnouncementBanner
NextActivity
RegistrationPanel
ActivityCard
ActivityGrid
StatusBadge
Scoreboard
ScheduleList
VenueCard
RuleAccordion
NewsCard
GalleryGrid
PartnerLogoGrid
Footer
```

不得為每個活動建立完全不同且不可維護的頁面結構。

## 15.2 設計 Token

所有顏色、字體、間距、圓角、陰影與斷點必須使用 Token。

不得在元件中大量硬編碼顏色。

## 15.3 型別安全

若使用 TypeScript：

- 不得使用不必要的 `any`
- Activity、News、Venue、Result 必須有明確型別
- API 回傳資料需驗證
- 日期欄位統一使用 ISO 8601

## 15.4 錯誤處理

需要處理：

- 活動不存在
- 報名連結失效
- 活動資料未完成
- 圖片載入失敗
- 網路錯誤
- 地圖連結缺失
- 比分尚未公布

不得直接顯示程式錯誤訊息給使用者。

---

# 16. 禁止事項

開發與設計時禁止：

1. 只把 Instagram 貼文嵌入首頁，取代正式內容。
2. 將規則、日期或報名資訊只做成圖片。
3. 每場活動使用完全不同的版型。
4. 為了荒謬感犧牲操作與閱讀。
5. 首頁先放大段品牌理念，再放活動資訊。
6. 使用超寬表格作為手機版主要呈現。
7. 在所有區塊使用警示條紋。
8. 在正文使用描邊、磨損或斜體字。
9. 使用未授權商業字體或圖片。
10. 將清華與陽明交大代表色和品牌黃色混為一談。
11. 在沒有內容時顯示大量空區塊。
12. 建立多份互相矛盾的活動資料。
13. 讓報名連結必須經過多層頁面才能取得。
14. 忽略 Instagram 內建瀏覽器的手機體驗。
15. 使用過度動畫影響載入與閱讀。

---

# 17. 首頁示意內容

賽季進行中（有下一場／報名時）可採：

```text
2026 竹梅賽
荒謬競技，強勢回歸。
清華 X：Y 陽明交大
下一場活動 · 日期 · 場地
[查看活動] [全部賽程]
```

**2026 正賽結束後（現況）示意：**

```text
2026 竹梅賽

總錦標：交通大學 4：3 獲勝

清華 3：4 陽明交大

仍可挑戰
攻略校長旮拉給木（線上）

[查看比分] [玩旮拉給木] [Linktree]
```

頂部 CTA 條（賽季結束）：

```text
2026 總錦標交大 4：3 · 旮拉給木持續開放 · 小徑 T 見 Linktree
[查看比分] [玩旮拉給木] [Linktree]
```

活動卡片（已完賽計分場）：

```text
恐龍賽跑
恐龍騎毛毛蟲

03/29（日）14:00
清華大學操場

清華勝 · [查看結果]
```

總錦標七場勝負來源：[Instagram 總錦標公告](https://www.instagram.com/p/DXbxyXpEvby/)（含臺灣麻將、日本麻將）。

---

# 18. 驗收清單

## 資訊架構

- [ ] 首頁可快速找到下一場活動
- [ ] 首頁可快速找到開放報名
- [ ] 所有活動都有獨立頁面
- [ ] 賽程與結果可被查詢
- [ ] 歷屆內容可被保存
- [ ] 公告有獨立頁面
- [ ] 合作夥伴有正式展示區

## 視覺

- [ ] Light 與 Dark 模式一致
- [ ] 黃色、黑色、藍色使用規則一致
- [ ] 警示條紋沒有被濫用
- [ ] Display 字體只用於標題
- [ ] 活動卡片具有竹梅辨識度
- [ ] 手機版仍保持清楚

## 功能

- [ ] 報名按鈕可正常使用
- [ ] 活動狀態正確
- [ ] 地圖可開啟
- [ ] 行事曆可加入
- [ ] 分享預覽正確
- [ ] 比分可更新
- [ ] 空資料狀態正確

## 品質

- [ ] 通過鍵盤操作測試
- [ ] 通過基本無障礙檢查
- [ ] 手機載入速度可接受
- [ ] 沒有大型未壓縮圖片
- [ ] 沒有重要資訊只存在圖片
- [ ] 沒有重複或矛盾資料
- [ ] 所有公開頁面有 Metadata

---

# 19. Agent 工作守則

AI Agent 在執行任何網站修改時，必須遵守以下流程：

1. 先確認修改屬於哪個頁面與哪個使用情境。
2. 優先解決資訊與操作問題，再處理裝飾。
3. 優先重用既有元件與 Token。
4. 不得自行創造新的品牌色。
5. 不得自行改變活動正式名稱。
6. 不得將未確認資訊寫成正式公告；賽果須有 IG／籌委會來源。
7. 新增活動時，必須同時考慮：
   - 活動列表
   - 單一活動頁
   - 賽程
   - 報名狀態
   - 結果
   - SEO
   - 分享圖
8. 修改日期、地點或狀態時，必須檢查所有引用位置（含 `site.ts` 總分、`news.ts`、`history.ts`）。
9. 新增視覺效果時，必須檢查：
   - 手機版
   - 可讀性
   - Reduced Motion
   - 載入效能
10. 若需求與本文件衝突，應先指出衝突，再提出符合品牌與使用性的替代方案。
11. 進度與實作現況同步更新 `DEVELOPMENT.md`；本文件（`AGENT.md`）維持產品規範，重大決策變更時一併修訂。
12. 與梅竹賽的關係必須清楚：竹梅賽是學生自辦趣味對抗，**不是**正式梅竹賽。

---

# 20. 最終設計判斷原則

任何頁面或元件完成後，使用以下問題檢查：

1. 使用者能不能快速找到需要的資訊？
2. 看起來是否屬於竹梅賽，而不是一般活動網站？
3. 是否保留「正式形式 × 荒謬內容」的品牌反差？
4. 是否在手機上仍然好用？
5. 是否能在活動結束後繼續保存與查詢？
6. 是否避免把 IG 當成唯一正式資訊來源？（官網應結構化保存日期、規則、結果；IG 負責花絮與即時）
7. 是否能讓陌生人看懂，也能讓清交學生感受到內梗？

符合以上條件，才算完成。

---

# 21. 實作現況對照（2026-08-06）

本節描述目前 repo 實作，方便 Agent 對齊，**不取代**上方規範。細節進度見 [`DEVELOPMENT.md`](./DEVELOPMENT.md)。

| 項目 | 現況 |
|------|------|
| 技術棧 | Next.js 16 static export、React 19、Tailwind 4、GitHub Pages |
| 內容存放 | `src/data/*`（無 CMS） |
| 2026 總錦標 | 清華 3 ： 4 陽明交大（交大獲勝） |
| 計分七場 | 恐龍、酒精微積分、辦公椅、日麻、台麻、刷條碼、兩校憑拳 |
| 賽季狀態 | 正賽已結束；旮拉給木仍可玩；首頁 CTA 為賽季結束版 |
| 歷屆 | 僅收錄有資料的 2026；無虛構屆次、無天干地支命名 |
| 內容核對 | 已對齊 @chumei2026；總錦標圖 https://www.instagram.com/p/DXbxyXpEvby/ |
| 主要缺口 | 真實活動照片、ICS／分享、CMS、圖庫深化 |
