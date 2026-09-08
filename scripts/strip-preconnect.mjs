import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.join(process.cwd(), "out");
const needles = [
  '<link rel="preconnect" href="/" crossorigin=""/>',
  '<link rel="preconnect" href="/" crossOrigin=""/>',
];

async function walk(dir) {
  let changed = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const next = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      changed += await walk(next);
      continue;
    }
    if (!entry.name.endsWith(".html")) continue;
    const html = await readFile(next, "utf8");
    let updated = html;
    for (const needle of needles) {
      updated = updated.replaceAll(needle, "");
    }
    if (updated !== html) {
      await writeFile(next, updated);
      changed += 1;
    }
  }
  return changed;
}

const count = await walk(root);
console.log(`Removed same-origin preconnect from ${count} HTML files`);
