# 竹梅賽官網 — 開發進度紀錄

> 更新日期：2026-08-06  
> 線上網址：https://corgichen.github.io/chumei/  
> Repo：https://github.com/CorgiChen/chumei  
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
| 部署 | GitHub Actions → GitHub Pages |
| 內容來源 | `src/data/*` 靜態資料（活動、消息、場地、歷屆、站台） |
| 路徑處理 | Pages 建置（`GITHUB_PAGES=true`）設 `basePath`／`assetPrefix`＝`/chumei`；見下方注意事項 |
| 字體 | Noto Sans TC（400–900） |
| 規範文件 | `AGENT.md`、`DESIGN_SPEC.md` |

### GitHub Pages `basePath` 注意事項（重要）

Pages 站點掛在 `https://…/chumei/`，路徑前綴由 Next 設定處理。**不要對 `next/link` 再手動加前綴。**

| 用途 | 做法 | 範例 |
|------|------|------|
| 頁面導覽（`Link`／`href`） | 只用 app 路徑；Next 會自動加 `basePath` | `href="/activities"` → 輸出 `/chumei/activities/` |
| 靜態圖（`Image`／`<img>`） | 用 `withBasePath()`（`src/lib/utils.ts`） | `src={withBasePath("/images/…")}` → `/chumei/images/…` |

錯誤示範：`href={withBasePath("/activities")}` 會變成 `/chumei/chumei/activities/` → **404**。  
未加前綴的圖片 `src="/images/…"` 在 Pages 上會 404。本地 `npm run dev` 的 `NEXT_PUBLIC_BASE_PATH` 為空，兩種寫法在本機都正常。

### 目錄結構（重點）

```text
src/
├─ app/                 # 路由頁面（靜態產生）
│  ├─ page.tsx          # 首頁（DESIGN_SPEC Phase 2）
│  ├─ activities/       # 活動總覽 + [slug]
│  ├─ schedule/ scoreboard/ news/ history/ about/
│  └─ gallery/ join/ partners/ contact/
├─ components/          # UI（Header／Footer／Hero／ActivityCard…）
├─ data/                # activities / news / history / venues / site
├─ lib/                 # utils、activity-filters
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
| 專案骨架＋GitHub Pages | ✅ 完成 | Actions 自動部署；`basePath` 用法見 §1 |
| Design Tokens／背景間距 | ✅ Phase 1 | 依 `DESIGN_SPEC` 更新 `globals.css` |
| Header／Footer／Section／Badge／Card | ✅ Phase 1 | 黑底 Header、四欄 Footer、Featured／Grid 卡 |
| 首頁重構 | ✅ Phase 2 | Hero、狀態條、還能繼續胡鬧、精選 6 卡… |
| 活動總覽／詳情／賽程／比分／消息 | 🟡 待 Phase 3 | 功能可用，視覺尚未全面套用新版 |
| 歷屆／關於／圖庫等 | 🟡 待 Phase 4 | |
| 真實照片／OG／無障礙抽檢 | ❌ Phase 5 | |
| CMS／後台 | ❌ 未做 | |

**粗估完成度：資訊架構約 90%；DESIGN_SPEC Phase 1–2 約完成；全站視覺改版約 40%。**

---

## 3. 內容現況（2026 竹梅賽）

> 已對齊 [@chumei2026](https://www.instagram.com/chumei2026/)，總錦標以 [4/22 公告](https://www.instagram.com/p/DXbxyXpEvby/) 為準。  
> **正式活動名稱與賽果不得擅自修改。**

### 計分項目（清華 3 ： 4 交大）

| 活動 | 結果 |
|------|------|
| 恐龍賽跑 | 清華 |
| 酒精微積分 | 交大 |
| 辦公椅錦標賽 | 清華 |
| 日本麻將推廣賽 | 交大 |
| 四人臺灣麻將 | 交大 |
| 刷條碼競速賽 | 交大 |
| 兩校憑拳 | 清華 |

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
2. **Live Status Strip**：三項可點卡片（賽果／旮拉給木／Linktree），不再重複大比分
3. **還能繼續胡鬧**：旮拉給木＋小徑 T（取代下一場／空報名區）
4. **Scoreboard Section**：深色全寬＋七場小標＋連到完整結果
5. **活動精選**：最多 6 卡（1 featured + 2 mid + 3 grid）→ `/activities`
6. **最新公告**：公告板（黑底 featured + 側欄黃框）
7. **最近結果**：橫滑／三欄結果卡
8. **精選回顧**：大＋小媒體格，標「活動影像整理中」
9. **合作夥伴**：低張力灰階容器

### Phase 3–5 — 待辦

- Phase 3：Activities／Detail／Schedule／Scoreboard／News 視覺對齊
- Phase 4：History／About／Gallery／Join／Partners／Contact
- Phase 5：進一步壓縮／裁切、alt、手機抽檢、無障礙、CWV、OG、404

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
- [x] DESIGN_SPEC Phase 1–2（共用元件＋首頁）
- [x] 替換活動 SVG 為 Instagram／官方遊戲圖
- [x] 條碼達人改用專屬宣傳影片截圖（DXdvNT9knSJ）
- [x] 修正 Pages 雙重 `basePath`（導覽 404）與圖片缺前綴
- [ ] 確認 Linktree／旮拉給木／小徑 T 連結

### P1

- [ ] Phase 3 核心頁視覺
- [ ] 賽程 ICS、圖庫燈箱、篩選 URL sync

### P2

- [ ] CMS／Sheet 同步、分年頁、自訂網域

---

## 6. 常用指令

```bash
npm install
npm run dev      # http://localhost:3000（無 basePath）
npm run build    # 輸出至 out/

# 模擬 GitHub Pages 建置（驗證 /chumei 前綴）
set GITHUB_PAGES=true
set GITHUB_REPOSITORY=CorgiChen/chumei
npm run build
```

Push `main` 後 Actions 自動部署 Pages（workflow 會設 `GITHUB_PAGES=true`）。

---

## 7. 變更紀錄（摘要）

| 日期 | 內容 |
|------|------|
| 2026-08-06 | 初版全站＋Pages；IG 賽果對齊；總錦標交大 4：3 |
| 2026-08-06 | 更新 AGENT／DEVELOPMENT 規範對照 |
| 2026-08-06 | **DESIGN_SPEC Phase 1–2**：Tokens、共用元件、首頁重構；`npm run build` 通過 |
| 2026-08-06 | 以 Instagram 貼文圖替換各活動主視覺；圖庫改為實拍照 |
| 2026-08-06 | **修正 Pages 404**：`Link` 不再包 `withBasePath`；`Image` 改用 `withBasePath` |
