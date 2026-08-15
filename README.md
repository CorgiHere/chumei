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

Push `main` 後 GitHub Actions 會建置並部署 Pages。

正式網址：`https://corgihere.github.io/chumei/`

### 路徑

站點前綴為 `/chumei`。頁面用 `appPath("/activities")`（含結尾 `/`）。靜態圖用 `withBasePath("/images/...")`。不要對 `Link` 再包 `withBasePath`。

### Search Console

Sitemap 請送完整網址，不要送根目錄的 `/sitemap.xml`：

`https://corgihere.github.io/chumei/sitemap.xml`

## 技術棧

- Next.js 16（App Router、Static Export）
- TypeScript、React 19
- Tailwind CSS 4
- 字體：Noto Sans TC、IBM Plex Mono、Oswald

## 規範

- 產品：[AGENT.md](./AGENT.md)
- 進度：[DEVELOPMENT.md](./DEVELOPMENT.md)
- 設計藍圖：[DESIGN_SPEC.md](./DESIGN_SPEC.md)
