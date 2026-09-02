# 竹梅賽官網 — 開發進度紀錄

> 更新日期：2026-08-15  
> 線上網址：https://corgihere.github.io/chumei/  
> Repo：https://github.com/CorgiHere/chumei  
> 產品規範：[`AGENT.md`](./AGENT.md)  
> 設計規格：[`DESIGN_SPEC.md`](./DESIGN_SPEC.md)

---

## 1. 開發框架

| 項目 | 說明 |
|------|------|
| 框架 | Next.js 16（App Router） |
| 語言 | TypeScript |
| UI | React 19 + Tailwind CSS 4 |
| 輸出 | Static Export（`output: "export"`） |
| 部署 | GitHub Pages（`/chumei`）＋ Cloudflare Pages（`www.holychumei.org`） |
| 內容來源 | `src/data/*` 靜態資料（活動、消息、場地、歷屆、站台） |
| 內部連結 | `appPath()`（`trailingSlash: true`） |
| 路徑處理 | Pages 建置（`GITHUB_PAGES=true`）設 `basePath`／`assetPrefix`＝`/chumei`；見下方注意事項 |
| 字體 | Noto Sans TC、IBM Plex Mono、Oswald |
| 規範文件 | `AGENT.md`、`DESIGN_SPEC.md` |

### GitHub Pages `basePath` 注意事項（重要）

Pages 站點掛在 `https://…/chumei/`，路徑前綴由 Next 設定處理。**不要對 `next/link` 再手動加前綴。**

| 用途 | 做法 | 範例 |
|------|------|------|
| 頁面導覽（`Link`／`href`） | `appPath("/activities")`（結尾 `/`）；Next 再加 `basePath` | `appPath("/activities")` → `/chumei/activities/` |
| 靜態圖（`Image`／`<img>`） | 用 `withBasePath()`（`src/lib/utils.ts`） | `src={withBasePath("/images/…")}` → `/chumei/images/…` |

錯誤示範：`href={withBasePath("/activities")}` 會變成 `/chumei/chumei/activities/` → **404**。  
未加前綴的圖片 `src="/images/…"` 在 Pages 上會 404。本地 `npm run dev` 的 `NEXT_PUBLIC_BASE_PATH` 為空，兩種寫法在本機都正常。

### 目錄結構（重點）

```text
src/
├─ app/                 # 路由頁面（靜態產生）
│  ├─ page.tsx          # 首頁
│  ├─ not-found.tsx
│  ├─ icon.png / apple-icon.png
│  ├─ activities/       # 活動總覽 + [slug]
│  ├─ schedule/ scoreboard/ news/ history/ about/
│  └─ gallery/ join/ partners/ contact/
├─ components/          # Header（含清交／交清切換）、Hero、ActivityCard、Scoreboard…
├─ data/                # activities / news / history / venues / site
├─ lib/                 # utils、seo、activity-filters
└─ types/
```

### 技術限制

- 無後端／CMS：內容改 `src/data` 後需重新 build 部署
- 活動圖已改為 Instagram 官方貼文實拍／宣傳圖（見下方對照）；無專屬貼文者改用官方遊戲畫面或相關活動圖
- Instagram 貼文無法直接嵌入；賽果與圖片以人工對齊 IG 後寫入 `src/data` / `public/images`

---

## 2. 整體進度

| 模組 | 狀態 | 備註 |
|------|------|------|
| 專案骨架＋GitHub Pages | ✅ | Actions；`basePath` 見 §1 |
| 視覺（v7 黑黃＋校色） | ✅ | 圓角 0、清華紫／交通藍、黃輔色 |
| Header／Footer／卡片／賽程 | ✅ | 導覽含歷屆；賽程／加入在頁尾 |
| 首頁 | ✅ | 賽季後：總錦標 → 還能玩 → 三場代表 → 公告 → 圖庫；無重複賽果卡 |
| 活動／賽程／比分／消息 | ✅ | 功能＋視覺已套用 |
| 關於／圖庫／加入 | ✅ | 籌備團隊社群改圖示 |
| 真實照片 | ✅ | `public/images/activities`、`gallery`、`side` JPEG |
| Favicon | ✅ | 黃底 Chu Mei PNG；metadata 用絕對路徑（含 `/chumei`） |
| 清交／交清切換 | ✅ | Header；`localStorage`；說明文案 `data-keep-order` |
| SEO | ✅ | JSON-LD 全站；sitemap 完整 URL |
| CMS／自訂網域 | ❌ | 未做 |

**粗估：資訊架構與全站視覺已可上線。剩餘為 CMS、自訂網域、GSC 收錄。**

---

## 3. 內容現況（2026 竹梅賽）

> 已對齊 [@chumei2026](https://www.instagram.com/chumei2026/)，總錦標以 [4/22 公告](https://www.instagram.com/p/DXbxyXpEvby/) 為準。  
> **正式活動名稱與賽果不得擅自修改。**

### 計分項目（清大 3 ： 4 交大）

| 活動 | 結果 |
|------|------|
| 恐龍賽跑 | 清大 |
| 酒精微積分 | 交大 |
| 辦公椅錦標賽 | 清大 |
| 日本麻將推廣賽 | 交大 |
| 四人臺灣麻將 | 交大 |
| 刷條碼競速賽 | 交大 |
| 兩校憑拳 | 清大 |

### 命名原則

- 年度名稱：**2026 竹梅賽**（不用天干地支）
- 不虛構無資料歷屆
- 與梅竹賽無關

---

## 4. DESIGN_SPEC 實作紀錄

### Phase 1 — 品牌視覺骨架（已完成）

| 元件 | 重點 |
|------|------|
| Tokens | paper 底、硬陰影 7px、圓角 12/22/30、容器 1240px、section 間距 |
| Header | 黑底 sticky、黃圓 Logo、當前頁黃 Pill、手機全螢幕選單 |
| Footer | 頂部 Hazard、四欄（品牌／連結／參與／社群） |
| SectionHeader | 藍圓編號＋黃 eyebrow＋標題＋「查看全部」 |
| StatusBadge | 趣味文案＋正式狀態雙層；狀態色對齊規格 |
| ActivityCard | `featured`／`grid`／`list` 三種；線上活動 CTA 為「立即遊玩」 |
| HazardBar | 桌面 22px／手機較矮；限 Hero／重要公告／Footer |
| 活動圖像 | 已改用 @chumei2026 貼文圖（實拍／官方宣傳圖）；旮拉給木為遊戲畫面 |

### Phase 2 — 首頁重做（已完成）

依規格順序：

1. **Hero**：55／45 雙欄＋主視覺海報；賽季後主訊息為總錦標，不喊「下一場」
2. **Live Status Strip**：跑馬燈（賽果／旮拉給木／Linktree）
3. **Scoreboard**：總錦標表，連到完整結果
4. **還能繼續胡鬧**：旮拉給木＋周邊／非計分（不再與下方重複小徑 T 文案卡）
5. **三場代表**：恐龍賽跑、酒精微積分、兩校憑拳 → `/activities`
6. **最新公告**：公告板
7. **精選回顧**：站內圖庫入口（不再直接外連 IG）
8. **關於**：連到關於／歷屆／加入

### Phase 3–5

視覺已大致套到活動卡、賽程、比分、關於、圖庫。其餘：

- 賽程 ICS 深化、圖庫燈箱、篩選 URL
- 無障礙與 CWV 抽檢
- 自訂網域（利於搜尋站名，避免 Google 顯示 GitHub Pages documentation）

### 活動圖片來源（Instagram）

| 活動 | 來源貼文 |
|------|----------|
| 金剛大戰哥吉拉 | [DWOJcC1EtO5](https://www.instagram.com/p/DWOJcC1EtO5/) |
| 恐龍賽跑 | [DWggtf6kmv8](https://www.instagram.com/p/DWggtf6kmv8/) |
| 酒精微積分 | [DW0vItSjneJ](https://www.instagram.com/p/DW0vItSjneJ/) |
| 辦公椅錦標賽 | [DW-lvPikgxN](https://www.instagram.com/p/DW-lvPikgxN/) |
| 日本麻將推廣賽 | [DWVO9kcEjhl](https://www.instagram.com/p/DWVO9kcEjhl/) |
| 四人臺灣麻將 | [DWVv1V7Dv6v](https://www.instagram.com/p/DWVv1V7Dv6v/) |
| 刷條碼競速賽 | [DXOlu9akqto](https://www.instagram.com/p/DXOlu9akqto/) |
| 兩校憑拳 | [DXRiFuoErbl](https://www.instagram.com/p/DXRiFuoErbl/) |
| 期末週大尖叫 | [DY6p2fskiQ6](https://www.instagram.com/p/DY6p2fskiQ6/) |
| 條碼達人 | [DXdvNT9knSJ](https://www.instagram.com/p/DXdvNT9knSJ/) 影片截圖 |
| 攻略校長旮拉給木 | 官方遊戲畫面截圖（galgame-5c440.web.app） |

---

## 5. 代辦事項

### P0

- [x] IG 對齊賽果與總錦標
- [x] DESIGN_SPEC 共用元件＋首頁＋後續頁視覺
- [x] 替換活動 SVG 為 Instagram／官方遊戲圖
- [x] 條碼達人改用專屬宣傳影片截圖（DXdvNT9knSJ）
- [x] 修正 Pages 雙重 `basePath`（導覽 404）與圖片缺前綴
- [x] Favicon 絕對路徑、sitemap 完整 URL
- [x] 清交／交清切換、清大／交大校色
- [ ] 確認 Linktree／旮拉給木／小徑 T 連結
- [ ] Search Console 改送 `https://corgihere.github.io/chumei/sitemap.xml`

### P1

- [ ] 賽程 ICS、圖庫燈箱、篩選 URL sync
- [ ] 自訂網域（搜尋站名）

### P2

- [ ] CMS／Sheet 同步、分年頁

---

## 6. 常用指令

```bash
npm install
npm run dev      # http://localhost:3000（無 basePath）
npm run seo      # 產生 public/sitemap.xml、robots.txt
npm run build    # prebuild 會先跑 seo，輸出至 out/
npm run build:cloudflare   # 正式站建置（根路徑、holychumei.org sitemap）
npm run deploy:cloudflare  # 本機建置 + wrangler pages deploy（需 wrangler login）

# 模擬 GitHub Pages 建置（驗證 /chumei 前綴）
set DEPLOY_TARGET=github
set GITHUB_PAGES=true
set GITHUB_REPOSITORY=CorgiHere/chumei
npm run build
```

Push `main` 後 Actions 會同時部署 GitHub Pages（`deploy.yml`）與 Cloudflare Pages（`deploy-cloudflare.yml`，需 Secrets）。

### SEO 注意

- 共用 helper：`src/lib/seo.ts`（canonical／OG／Twitter／JSON-LD）
- 靜態 export 用 `public/robots.txt`、`public/sitemap.xml`、`public/sitemap.txt`（`npm run seo`）
- GSC（Cloudflare）：`https://www.holychumei.org/sitemap.xml`
- GSC（GitHub Pages）：`https://corgihere.github.io/chumei/sitemap.xml`（根路徑 `/sitemap.xml` 在 github.io 為 404）
- 全站 WebSite／Organization JSON-LD 在 `layout.tsx`；站名偏好「竹梅賽」
- `github.io` 子路徑搜尋結果可能仍顯示 GitHub Pages 站名，自訂網域較穩

---

## 7. 變更紀錄（摘要）

| 日期 | 內容 |
|------|------|
| 2026-08-06 | 初版全站＋Pages；IG 賽果對齊；總錦標交大 4：3 |
| 2026-08-06 | DESIGN_SPEC Phase 1–2；IG 主視覺；basePath／SEO |
| 2026-08-14 | v7 視覺、真實 JPEG、Hero 對齊、跑馬燈文案、Chu Mei favicon |
| 2026-08-15 | 清華紫／交通藍、清大勝標籤、清交／交清切換、導覽首頁、GSC sitemap 路徑、站名 schema |
