import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const [owner = "CorgiHere", repoName = "chumei"] = (
  process.env.GITHUB_REPOSITORY ?? "CorgiHere/chumei"
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
