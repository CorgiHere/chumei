import { spawnSync } from "node:child_process";

process.env.DEPLOY_TARGET = "cloudflare";
process.env.NEXT_PUBLIC_SITE_URL = "https://www.holychumei.org";

const result = spawnSync("npm", ["run", "build"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

process.exit(result.status ?? 1);
