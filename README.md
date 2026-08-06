# 2026 丙午竹梅賽官方網站

竹梅賽是清交學生自主籌辦的荒謬校際競技平台。本網站提供活動總覽、報名資訊、賽程、比分與最新消息的正式入口。

- Instagram: [@chumei2026](https://www.instagram.com/chumei2026/)
- Linktree: [linktr.ee/chumei2026](https://linktr.ee/chumei2026)

## 開發

```bash
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000)

## 建置

```bash
npm run build
```

靜態輸出位於 `out/` 目錄。

## 部署至 GitHub Pages

1. 將專案 push 至 GitHub
2. 在 Repository Settings → Pages → Build and deployment 選擇 **GitHub Actions**
3. Push 至 `main` 分支後，GitHub Actions 會自動建置並部署

部署網址：`https://<username>.github.io/chumei/`

## 技術棧

- Next.js 16 (App Router, Static Export)
- TypeScript
- Tailwind CSS 4

## 規範

開發規範請參閱 [AGENT.md](./AGENT.md)。
