import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "images");

const jobs = [
  { src: "gallery/hero-slide-1.jpg", dest: "gallery/hero-slide-1.avif", width: 960 },
  { src: "gallery/hero-slide-2.jpg", dest: "gallery/hero-slide-2.avif", width: 960 },
  { src: "gallery/hero-slide-3.jpg", dest: "gallery/hero-slide-3.avif", width: 960 },
  { src: "gallery/hero-slide-4.jpg", dest: "gallery/hero-slide-4.avif", width: 960 },
  { src: "gallery/hero-slide-5.jpg", dest: "gallery/hero-slide-5.avif", width: 960 },
  { src: "path-vote/nthu-gate.jpg", dest: "path-vote/nthu-gate.avif", width: 800 },
  { src: "path-vote/nycu-tower.jpg", dest: "path-vote/nycu-tower.avif", width: 800 },
  { src: "side/path-tee.jpg", dest: "side/path-tee.avif", width: 640 },
  { src: "side/lawn-scream.jpg", dest: "side/lawn-scream.avif", width: 640 },
  { src: "side/juan-su.jpg", dest: "side/juan-su.avif", width: 480 },
  { src: "side/sony-draw.jpg", dest: "side/sony-draw.avif", width: 480 },
  { src: "activities/rps.jpg", dest: "activities/rps.avif", width: 960 },
  { src: "activities/alcohol-calculus.jpg", dest: "activities/alcohol-calculus.avif", width: 960 },
  { src: "activities/dinosaur-race.jpg", dest: "activities/dinosaur-race.avif", width: 960 },
  { src: "activities/office-chair.jpg", dest: "activities/office-chair.avif", width: 960 },
  { src: "activities/barcode.jpg", dest: "activities/barcode.avif", width: 960 },
  { src: "activities/japanese-mahjong.jpg", dest: "activities/japanese-mahjong.avif", width: 960 },
  { src: "activities/taiwan-mahjong.jpg", dest: "activities/taiwan-mahjong.avif", width: 960 },
  { src: "activities/lawn-scream.jpg", dest: "activities/lawn-scream.avif", width: 960 },
  { src: "brand/chumei-logo.png", dest: "brand/chumei-logo-mark.webp", width: 96, webp: true, skipJpeg: true },
];

for (const job of jobs) {
  const input = path.join(root, job.src);
  if (!existsSync(input)) {
    console.warn(`skip missing ${job.src}`);
    continue;
  }

  const original = await readFile(input);
  const resized = sharp(original).rotate().resize({
    width: job.width,
    height: job.width,
    fit: "inside",
    withoutEnlargement: true,
  });
  const output = path.join(root, job.dest);
  const info = job.webp
    ? await resized.clone().webp({ quality: 72, effort: 6 }).toFile(output)
    : await resized.clone().avif({ quality: 42, effort: 6 }).toFile(output);
  console.log(`${job.dest}\t${info.width}x${info.height}\t${info.size} bytes`);

  if (!job.skipJpeg && job.src.endsWith(".jpg")) {
    const jpeg = await resized.clone().jpeg({ quality: 72, mozjpeg: true }).toBuffer();
    await writeFile(input, jpeg);
    console.log(`${job.src}\t${jpeg.length} bytes`);
  }
}
