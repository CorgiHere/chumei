import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const emptyPolyfill = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "src/lib/empty-polyfill.js",
);

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
    ? "https://chumei.org"
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
  experimental: {
    inlineCss: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      [path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        "node_modules/next/dist/build/polyfills/polyfill-module.js",
      )]: emptyPolyfill,
      "next/dist/build/polyfills/polyfill-module": emptyPolyfill,
      "next/dist/build/polyfills/polyfill-module.js": emptyPolyfill,
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      "next/dist/build/polyfills/polyfill-module": "./src/lib/empty-polyfill.js",
      "next/dist/build/polyfills/polyfill-module.js": "./src/lib/empty-polyfill.js",
    },
  },
  basePath: isGithubPages ? `/${repoName}` : "",
  assetPrefix: isGithubPages ? `/${repoName}/` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? `/${repoName}` : "",
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
};

export default nextConfig;
