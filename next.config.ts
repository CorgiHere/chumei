import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const [owner = "CorgiChen", repoName = "chumei"] = (
  process.env.GITHUB_REPOSITORY ?? "CorgiChen/chumei"
).split("/");
const pagesHost = `${owner.toLowerCase()}.github.io`;

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
    NEXT_PUBLIC_SITE_URL: `https://${pagesHost}/${repoName}`,
  },
};

export default nextConfig;
