import type { NextConfig } from "next";

const deployTarget = process.env.DEPLOY_TARGET ?? "";
const isGithubPages =
  deployTarget === "github" || process.env.GITHUB_PAGES === "true";
const isCloudflare =
  deployTarget === "cloudflare" || process.env.CLOUDFLARE_PAGES === "1";

const [owner = "CorgiHere", repoName = "chumei"] = (
  process.env.GITHUB_REPOSITORY ?? "CorgiHere/chumei"
).split("/");
const pagesHost = `${owner.toLowerCase()}.github.io`;

const defaultSiteUrl = isGithubPages
  ? `https://${pagesHost}/${repoName}`
  : isCloudflare
    ? "https://www.holychumei.org"
    : "http://localhost:3000";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? defaultSiteUrl).replace(
  /\/$/,
  "",
);

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? `/${repoName}` : "",
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
};

export default nextConfig;
