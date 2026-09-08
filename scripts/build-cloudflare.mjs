import { spawnSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";

process.env.DEPLOY_TARGET = "cloudflare";
process.env.NEXT_PUBLIC_SITE_URL = "https://chumei.org";

const result = spawnSync("npm", ["run", "build"], {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

if ((result.status ?? 1) !== 0) {
  process.exit(result.status ?? 1);
}

if (existsSync("functions")) {
  cpSync("functions", "out/functions", { recursive: true });
}

process.exit(0);
