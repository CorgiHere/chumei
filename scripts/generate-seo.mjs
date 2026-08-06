/**
 * Writes public/robots.txt and public/sitemap.xml for static export (GitHub Pages).
 * Run before `next build`.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const require = createRequire(import.meta.url);

// Register ts-node-less loader: parse TS data files with regex (no TS runtime needed)
function extractSlugs(filePath, key = "slug") {
  const fs = require("node:fs");
  const text = fs.readFileSync(filePath, "utf8");
  const re = new RegExp(`${key}:\\s*[\"']([^\"']+)[\"']`, "g");
  const out = [];
  let m;
  while ((m = re.exec(text))) out.push(m[1]);
  return out;
}

const siteUrl = "https://corgihere.github.io/chumei";

const staticPaths = [
  "/",
  "/activities/",
  "/schedule/",
  "/scoreboard/",
  "/news/",
  "/history/",
  "/about/",
  "/gallery/",
  "/join/",
  "/partners/",
  "/contact/",
];

const activitySlugs = extractSlugs(join(root, "src/data/activities.ts"));
const newsSlugs = extractSlugs(join(root, "src/data/news.ts"));

const urls = [
  ...staticPaths.map((path) => ({
    loc: path === "/" ? `${siteUrl}/` : `${siteUrl}${path}`,
    priority: path === "/" ? "1.0" : path === "/activities/" || path === "/scoreboard/" ? "0.9" : "0.7",
    changefreq: path === "/news/" || path === "/" ? "weekly" : "monthly",
  })),
  ...activitySlugs.map((slug) => ({
    loc: `${siteUrl}/activities/${slug}/`,
    priority: "0.8",
    changefreq: "monthly",
  })),
  ...newsSlugs.map((slug) => ({
    loc: `${siteUrl}/news/${slug}/`,
    priority: "0.6",
    changefreq: "monthly",
  })),
];

const today = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const publicDir = join(root, "public");
mkdirSync(publicDir, { recursive: true });
writeFileSync(join(publicDir, "sitemap.xml"), sitemap, "utf8");
writeFileSync(join(publicDir, "robots.txt"), robots, "utf8");

console.log(
  `SEO files written: ${urls.length} URLs → public/sitemap.xml, public/robots.txt`,
);
