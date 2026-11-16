export type DiplomaPaint = {
  bgSrc: string;
  score: string;
  rank: string;
  highest: boolean;
  player: string;
  school: string;
  group: string;
  arcadeFamily: string;
  fusionFamily: string;
};

const W = 801;
const H = 1001;

export function diplomaFileName(id: string, score: string) {
  const safe = id.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 16) || "player";
  return `chumei-punch-${safe}-${score.replace(/,/g, "")}.png`;
}

export async function renderDiplomaBlob(paint: DiplomaPaint): Promise<Blob> {
  const img = await loadImage(paint.bgSrc);
  await Promise.all([
    loadFont(`92px ${paint.arcadeFamily}`),
    loadFont(`48px ${paint.arcadeFamily}`),
    loadFont(`18px ${paint.arcadeFamily}`),
    loadFont(`20px ${paint.fusionFamily}`),
    document.fonts.ready.catch(() => undefined),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, 0, 0, W, H);

  drawScore(ctx, paint.score, paint.arcadeFamily);
  drawRank(ctx, paint.rank, paint.arcadeFamily);
  if (paint.highest) drawHighest(ctx, paint.arcadeFamily);
  fillFitted(ctx, paint.player, box(0.32, 0.677, 0.58, 0.035), paint.fusionFamily, "#ffffff", 20, 13);
  fillFitted(ctx, paint.school, box(0.32, 0.745, 0.58, 0.032), paint.fusionFamily, "#ffffff", 17, 12);
  fillFitted(ctx, paint.group, box(0.455, 0.814, 0.225, 0.05), paint.fusionFamily, "#1a1400", 20, 13);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((next) => (next ? resolve(next) : reject(new Error("png"))), "image/png");
  });
  return blob;
}

export function downloadBlob(blob: Blob, fileName: string) {
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  link.rel = "noopener";
  if (isAppleMobile()) {
    link.target = "_blank";
  }
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 8000);
}

function isAppleMobile() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export async function copyPng(blob: Blob) {
  if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
    throw new Error("clipboard");
  }
  await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
}

function box(left: number, top: number, width: number, height: number) {
  return {
    x: left * W,
    y: top * H,
    w: width * W,
    h: height * H,
  };
}

function drawScore(ctx: CanvasRenderingContext2D, score: string, family: string) {
  const area = box(0.18, 0.266, 0.64, 0.152);
  const size = fitSize(ctx, score, family, area.w, 92, 42);
  ctx.save();
  ctx.font = `${size}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const cx = area.x + area.w / 2;
  const cy = area.y + area.h / 2;
  const shadows: Array<[number, number, string]> = [
    [3, 3, "#3a2bff"],
    [2, 0, "#ff4fbf"],
    [0, 2, "#ff4fbf"],
    [0, -1, "#7af0ff"],
    [-2, 0, "#3de8ff"],
  ];
  for (const [dx, dy, color] of shadows) {
    ctx.fillStyle = color;
    ctx.fillText(score, cx + dx, cy + dy);
  }
  const grad = ctx.createLinearGradient(cx, cy - size * 0.55, cx, cy + size * 0.55);
  grad.addColorStop(0, "#fffef6");
  grad.addColorStop(0.4, "#fff4b3");
  grad.addColorStop(1, "#ffd23a");
  ctx.fillStyle = grad;
  ctx.fillText(score, cx, cy);
  ctx.restore();
}

function drawRank(ctx: CanvasRenderingContext2D, rank: string, family: string) {
  const area = box(0.36, 0.522, 0.28, 0.056);
  const size = fitSize(ctx, rank, family, area.w, 48, 22);
  ctx.save();
  ctx.font = `${size}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const cx = area.x + area.w / 2;
  const cy = area.y + area.h / 2;
  const shadows: Array<[number, number, string]> = [
    [3, 3, "#1c4bff"],
    [0, 3, "#ff2a4a"],
    [-2, 1, "#ff2a4a"],
  ];
  for (const [dx, dy, color] of shadows) {
    ctx.fillStyle = color;
    ctx.fillText(rank, cx + dx, cy + dy);
  }
  ctx.fillStyle = "#ffe14a";
  ctx.fillText(rank, cx, cy);
  ctx.restore();
}

function drawHighest(ctx: CanvasRenderingContext2D, family: string) {
  const area = box(0.31, 0.576, 0.38, 0.046);
  ctx.save();
  ctx.fillStyle = "#b8860a";
  ctx.fillRect(area.x, area.y + 3, area.w, area.h);
  ctx.fillStyle = "#f5c51a";
  ctx.fillRect(area.x, area.y, area.w, area.h);
  ctx.font = `18px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#1a1400";
  ctx.fillText("HIGHEST", area.x + area.w / 2, area.y + area.h / 2);
  ctx.restore();
}

function fillFitted(
  ctx: CanvasRenderingContext2D,
  text: string,
  area: { x: number; y: number; w: number; h: number },
  family: string,
  color: string,
  start: number,
  min: number,
) {
  const size = fitSize(ctx, text, family, area.w - 8, start, min);
  ctx.save();
  ctx.font = `${size}px ${family}`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, area.x + area.w / 2, area.y + area.h / 2, area.w);
  ctx.restore();
}

function fitSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  maxWidth: number,
  start: number,
  min: number,
) {
  let size = start;
  ctx.font = `${size}px ${family}`;
  while (size > min && ctx.measureText(text).width > maxWidth) {
    size -= 1;
    ctx.font = `${size}px ${family}`;
  }
  return size;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "sync";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("diploma-bg"));
    img.src = src;
  });
}

async function loadFont(spec: string) {
  try {
    await document.fonts.load(spec);
  } catch {
    /* keep going with fallback */
  }
}
