# 2026 竹梅賽官方網站

竹梅賽是清大與交大學生自主籌辦的校際趣味競技。本站是活動、賽程、總錦標與公告的正式入口。

- 線上：https://corgihere.github.io/chumei/
- Instagram：[@chumei2026](https://www.instagram.com/chumei2026/)
- Linktree：[linktr.ee/chumei2026](https://linktr.ee/chumei2026)

UI 簡稱用 **清大／交大**。校色：清華紫 `#7d2b8e`、交通藍 `#003087`，輔以竹梅黃與黑白。導覽可切換全站「清交／交清」用詞。

## 開發

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 建置

```bash
npm run seo    # 產生 sitemap.xml、sitemap.txt、robots.txt
npm run build  # 靜態輸出到 out/
```

## 部署

### Cloudflare Pages（正式站）

正式網域：`https://chumei.org`（根路徑，無 `/chumei` 前綴）

**GitHub Actions（建議）** — push `main` 後自動部署。請在 repo Secrets 設定：

| Secret | 說明 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | [API Token](https://dash.cloudflare.com/profile/api-tokens)，權限：Account → Cloudflare Pages → Edit |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 儀表板右側 Account ID |

Workflow：`.github/workflows/deploy-cloudflare.yml`

**本機手動部署：**

```bash
npx wrangler login
npm run deploy:cloudflare
```

Cloudflare 儀表板 → Pages → `chumei` → Custom domains → 綁定 `chumei.org`（可選 `www.chumei.org` 轉址到根網域）。

### GitHub Pages（備用鏡像）

Push `main` 後仍會部署到 `https://corgihere.github.io/chumei/`（workflow：`deploy.yml`）。

### 路徑

- **Cloudflare**：站點在根目錄，`appPath("/activities")` → `/activities/`
- **GitHub Pages**：前綴 `/chumei`。靜態圖一律用 `withBasePath("/images/...")`。不要對 `Link` 再包 `withBasePath`。

### Search Console

- Cloudflare：`https://chumei.org/sitemap.xml`
- GitHub Pages：`https://corgihere.github.io/chumei/sitemap.xml`（勿送根目錄 `/sitemap.xml`）

## 技術棧

- Next.js 16（App Router、Static Export）
- TypeScript、React 19
- Tailwind CSS 4
- 字體：Noto Sans TC、IBM Plex Mono、Oswald

## 規範

- 產品：[AGENT.md](./AGENT.md)
- 進度：[DEVELOPMENT.md](./DEVELOPMENT.md)
- 設計藍圖：[DESIGN_SPEC.md](./DESIGN_SPEC.md)
