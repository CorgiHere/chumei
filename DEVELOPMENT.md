# 竹梅賽官網 — 開發進度紀錄

> 更新日期：2026-08-06  
> 線上網址：https://corgichen.github.io/chumei/  
> Repo：https://github.com/CorgiChen/chumei  
> 產品規範：[`AGENT.md`](./AGENT.md)  
> 最新 commit：`990cba3`（已 push `main`；Pages 由 Actions 自動部署）

---

## 1. 開發框架

| 項目 | 說明 |
|------|------|
| 框架 | Next.js 16（App Router） |
| 語言 | TypeScript |
| UI | React 19 + Tailwind CSS 4 |
| 輸出 | Static Export（`output: "export"`） |
| 部署 | GitHub Actions → GitHub Pages |
| 內容來源 | `src/data/*` 靜態資料（活動、消息、場地、歷屆、站台） |
| 路徑處理 | `basePath` / `assetPrefix` 於 Pages 環境自動加 `/chumei` |
| 字體 | Noto Sans TC（400–900） |
| 規範文件 | `AGENT.md`（產品／視覺／元件／內容模型） |

### 目錄結構（重點）

```text
src/
├─ app/                 # 路由頁面（靜態產生）
│  ├─ page.tsx          # 首頁（賽季結束版 CTA）
│  ├─ activities/       # 活動總覽 + [slug]
│  ├─ schedule/         # 賽程
│  ├─ scoreboard/       # 比分與結果
│  ├─ news/             # 最新消息 + [slug]
│  ├─ history/          # 歷屆竹梅（僅真實有資料之年度）
│  ├─ about/            # 關於竹梅
│  ├─ gallery/ join/ partners/ contact/
├─ components/          # UI 元件（含篩選 Explorer）
├─ data/                # activities / news / history / venues / site
├─ lib/                 # utils、activity-filters
└─ types/               # 共用型別
```

### 技術限制

- 無後端／CMS：內容改 `src/data` 後需重新 build 部署
- 圖片目前為 SVG 佔位，非正式活動攝影
- Instagram 貼文無法直接嵌入（登入牆／API），改以連結導流；賽果以人工對齊 IG 後寫入 `src/data`

---

## 2. 整體進度

| 模組 | 狀態 | 備註 |
|------|------|------|
| 專案骨架＋GitHub Pages | ✅ 完成 | Actions 自動部署 |
| 品牌／視覺系統（CSS variables） | ✅ 完成 | Light 綜藝／Dark 競速雙模式；Tailwind `@theme` 對齊 |
| 首頁 | ✅ 完成 | 賽季結束 CTA、總錦標、活動、公告、回顧 |
| 活動總覽 | ✅ 完善 | 搜尋＋多種篩選 |
| 單一活動頁 | 🟡 可用 | 區塊齊全；真實照片／細部規則待補 |
| 賽程 | ✅ 完善 | 今日／本週／即將／時間軸 |
| 比分與結果 | ✅ 完善 | 七場計分＋總錦標 4：3；來源連結 IG 公告 |
| 最新消息 | ✅ 完善 | 分類篩選＋置頂；含麻將／總錦標公告 |
| 歷屆竹梅 | ✅ 完善 | 僅 2026；無虛構屆次；無天干地支命名 |
| 關於竹梅 | ✅ 完善 | 對照表、精神標籤、聯絡 |
| 圖庫／加入／合作／聯絡 | 🟡 骨架 | 可用，內容偏薄 |
| CMS／後台管理 | ❌ 未做 | 見代辦 |
| 真實照片／影片 | ❌ 未做 | 見代辦 |
| ICS 下載、分享 API | ❌ 未做 | 賽程已有 Google Calendar |

**粗估完成度：核心資訊架構約 90%；全站產品目標約 75%（主要缺口為真實媒體與營運流程）。**

---

## 3. 內容現況（2026 竹梅賽）

> 內容已對齊 Instagram [@chumei2026](https://www.instagram.com/chumei2026/)（通讀貼文），總錦標七場勝負以 [4/22 公告圖](https://www.instagram.com/p/DXbxyXpEvby/) 為準。

### 計分項目（清華 3 ： 4 陽明交大）

| 活動 | 日期／場地 | 結果 |
|------|------------|------|
| 恐龍賽跑（騎毛毛蟲） | 3/29 清大操場 | ✅ 清華 |
| 酒精微積分 | 4/6 交大綜一 B102 | ✅ 交大（賽後 1：1） |
| 辦公椅錦標賽 | 4/10 實齋講堂 | ✅ 清華（賽後 2：1） |
| 日本麻將推廣賽 | 4/11 蒙民偉樓 | ✅ 交大（總錦標圖） |
| 四人臺灣麻將 | 4/12 蒙民偉樓 | ✅ 交大（總錦標圖） |
| 刷條碼競速賽 | 4/14 交大二餐 | ✅ 交大 |
| 兩校憑拳 | 4/17 清交小徑 | ✅ 清華（最後一個錦標） |

總錦標（4/22）：**清華 3 ： 4 陽明交大**；交大校狗「牛排」代表領獎。

### 非計分／季後等

| 活動 | 說明 |
|------|------|
| 金剛大戰哥吉拉 | 3/22 前哨戰 |
| 攻略校長旮拉給木 | 線上進行中 |
| 條碼達人 | 5/11 季後賽 |
| 期末週大草坪大尖叫 | 6/1 |
| 小徑 T | 預購／領取流程見 IG／Linktree |

### 命名與歷屆原則

- 年度名稱固定為 **「2026 竹梅賽」**，官網**不使用**天干地支（如「丙午」）
- 歷屆頁**不虛構** 2024／2025 等無資料屆次
- 與梅竹賽無關，文案需可區分

### 消息（`src/data/news.ts`）

- 置頂：總錦標公告、旮拉給木
- 結果：恐龍、酒精微積分、辦公椅、麻將兩場、條碼、兩校憑拳
- 季後／物資：條碼達人、小徑 T、大尖叫

### 外部連結（`src/data/site.ts`）

- Instagram / Facebook / Threads / Linktree / Email
- 旮拉給木、小徑 T 表單、憑拳表單（賽季已結束，表單可能仍掛在 Linktree）

---

## 4. 視覺系統摘要

### 雙模式

| 模式 | 用途 | 特徵 |
|------|------|------|
| Light（校園綜藝） | 列表、關於、歷屆 | 白底、淺灰格線、黃／藍強調、硬陰影卡片 |
| Dark（地下競速） | Hero、重要公告、總比分區 | 黑底、黃綠警示條、高對比黃資訊框 |

### 品牌色（`globals.css` `@theme`）

- `--color-brand-yellow: #FFBF00`（主 CTA）
- `--color-brand-blue: #19A9E5`（編號／次要）
- `--color-signal-lime: #D7F238`（警示條）
- `--color-nthu: #7A1F40`／`--color-nycu: #1E4E8C`（僅比分）

### 動效（已實作）

- 警示條緩慢捲動（`hazard-stripe-animated`）
- Hero 進場淡入上滑
- 比分區塊輕微脈動
- 速度線背景漂移
- 尊重 `prefers-reduced-motion`

---

## 5. 已完善的核心頁

| 路由 | 重點 |
|------|------|
| `/` | 賽季結束 CTA、總錦標、活動列表、公告、最近結果 |
| `/activities` | 搜尋＋狀態／計分／賽制／線上實體篩選 |
| `/activities/[slug]` | Hero、介紹、規則、結果、相關連結 |
| `/schedule` | 今日／本週／即將／時間軸；地圖與 Calendar |
| `/scoreboard` | 總分 3：4、七場計分表、非計分區、歷屆 |
| `/news` | 置頂重要＋分類篩選 |
| `/history` | 2026 年度卡＋活動時間軸 |
| `/about` | 定位、梅竹對照、精神標籤、聯絡 |

---

## 6. 代辦事項

### P0 — 建議優先

- [x] 與官方 IG 對齊：活動清單、真實賽果、總比分（含台麻／日麻）
- [ ] 替換 SVG 佔位圖為壓縮後的活動照片（含 alt）
- [ ] 確認 Linktree／旮拉給木／小徑 T 連結是否仍有效（賽季後可能調整）
- [ ] 單一活動頁補齊：候補規則、報名確認方式、完整安全注意事項（依章程）

### P1 — 體驗強化

- [ ] 賽程：下載 ICS、Web Share API
- [ ] 圖庫：依年度／活動篩選、燈箱、連回活動頁與 IG 原貼
- [ ] 活動總覽：URL query 同步篩選狀態
- [ ] 首頁／Hero：正式主視覺全幅圖

### P2 — 營運與擴充

- [ ] 簡易 CMS 或 Google Sheet → JSON 同步
- [ ] 合作夥伴真實 Logo 與提案 PDF
- [ ] 歷屆分年頁 `/history/[year]`（有第二屆資料時再開）
- [ ] 無障礙抽檢（對比、鍵盤、焦點）
- [ ] 自訂網域（若有）

### 已知限制／風險

- 靜態站無法即時改比分；改資料需 redeploy
- Instagram 無法自動同步貼文
- 單場詳細名次若僅出現在圖片中、未寫入 caption，官網可能只登錄校際勝負

---

## 7. 常用指令

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 輸出至 out/
```

Push `main` 後，GitHub Actions 會自動建置並部署 Pages。

---

## 8. 變更紀錄（摘要）

| 日期 | 內容 |
|------|------|
| 2026-08-06 | 初版全站骨架＋Pages 部署；對齊 Linktree CTA |
| 2026-08-06 | 移除虛構 2024／2025 屆；年度名稱改為「2026 竹梅賽」（不加天干地支） |
| 2026-08-06 | 通讀 @chumei2026；重寫活動／消息／比分；總錦標交大 4：3 |
| 2026-08-06 | 依總錦標公告圖補上臺灣麻將、日本麻將皆為交大勝 |
| 2026-08-06 | Push `main`（`990cba3`）並更新本進度／`AGENT.md` 對照 |
