/**
 * Turns every ink drawing in public/images/ink/ into an alpha mask in
 * public/images/ink-masks/<name>.png for `InkIllustration`: ink becomes
 * opaque, paper becomes fully transparent. The paper's brightness is detected
 * per image from its histogram, so rescanned or redrawn sources need no tuning.
 *
 * Runs before `dev` and `build`; outputs are gitignored. Masks newer than both
 * their source and this script are skipped.
 */
import { mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const SOURCE_DIR = path.join(import.meta.dirname, "../public/images/ink");
const OUTPUT_DIR = path.join(import.meta.dirname, "../public/images/ink-masks");
const SOURCE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"]);

const BLACK_POINT = 24;
// Paper ends where the histogram falls below this fraction of the paper peak.
const PAPER_EDGE = 0.05;
const SMOOTHING_RADIUS = 2;

function histogram(pixels) {
  const counts = new Array(256).fill(0);
  for (const value of pixels) counts[value] += 1;
  return counts.map((_, v) => {
    let sum = 0;
    let n = 0;
    for (let i = v - SMOOTHING_RADIUS; i <= v + SMOOTHING_RADIUS; i += 1) {
      if (i >= 0 && i < 256) {
        sum += counts[i];
        n += 1;
      }
    }
    return sum / n;
  });
}

function detectWhitePoint(counts) {
  let peak = 128;
  for (let v = 128; v < 256; v += 1) if (counts[v] > counts[peak]) peak = v;
  let whitePoint = peak;
  while (whitePoint > BLACK_POINT + 1 && counts[whitePoint - 1] >= counts[peak] * PAPER_EDGE) {
    whitePoint -= 1;
  }
  return whitePoint;
}

async function isFresh(source, output) {
  try {
    const [src, out, script] = await Promise.all([
      stat(source),
      stat(output),
      stat(import.meta.filename),
    ]);
    return out.mtimeMs >= src.mtimeMs && out.mtimeMs >= script.mtimeMs;
  } catch {
    return false;
  }
}

async function generateMask(source, output) {
  const { data, info } = await sharp(source)
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const whitePoint = detectWhitePoint(histogram(data));
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < data.length; i += 1) {
    const ink = (whitePoint - data[i]) / (whitePoint - BLACK_POINT);
    rgba[i * 4 + 3] = Math.round(Math.min(1, Math.max(0, ink)) * 255);
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ palette: true, compressionLevel: 9, effort: 10 })
    .toFile(output);
  return whitePoint;
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const sources = (await readdir(SOURCE_DIR)).filter((file) =>
    SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase()),
  );
  const expected = new Set(sources.map((file) => `${path.parse(file).name}.png`));

  for (const file of await readdir(OUTPUT_DIR)) {
    if (!expected.has(file)) await rm(path.join(OUTPUT_DIR, file));
  }

  for (const file of sources) {
    const source = path.join(SOURCE_DIR, file);
    const output = path.join(OUTPUT_DIR, `${path.parse(file).name}.png`);
    if (await isFresh(source, output)) continue;
    const whitePoint = await generateMask(source, output);
    console.log(`ink mask: ${file} → ${path.basename(output)} (paper ≥ ${whitePoint})`);
  }
}

await main();
