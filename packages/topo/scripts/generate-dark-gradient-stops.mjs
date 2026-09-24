#!/usr/bin/env node

import { gradientStops } from "../src/Theme/vars/colors.ts";

const DARK_BG = "#1E1119";
const FIELD_POSITIONS = [0, 20, 40, 62];
const TOP_TARGET_L = 0.62;
const TOP_CHROMA_BOOST = 0.25;

const hex2srgb = (h) => {
  h = h.trim().replace(/^#/, "");
  return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16) / 255);
};
const s2lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lin2s = (c) => {
  c = Math.max(0, Math.min(1, c));
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
};
const toLin = (hex) => hex2srgb(hex).map(s2lin);

function oklabFromLin([r, g, b]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function linFromOklab([L, a, b]) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3,
    m = m_ ** 3,
    s = s_ ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const toOklch = (hex) => {
  const [L, a, b] = oklabFromLin(toLin(hex));
  return { L, C: Math.hypot(a, b), H: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360 };
};
function hexFromOklch(L, C, H) {
  const rad = (H * Math.PI) / 180;
  const [r, g, b] = linFromOklab([L, C * Math.cos(rad), C * Math.sin(rad)]);
  const clipped = [r, g, b].some((c) => c < -0.001 || c > 1.001);
  const toByte = (c) =>
    Math.round(lin2s(c) * 255)
      .toString(16)
      .padStart(2, "0");
  return { hex: `#${toByte(r)}${toByte(g)}${toByte(b)}`.toUpperCase(), clipped };
}

function maxChromaAt(L, H) {
  let lo = 0;
  let hi = 0.5;
  for (let i = 0; i < 40; i += 1) {
    const mid = (lo + hi) / 2;
    if (!hexFromOklch(L, mid, H).clipped) lo = mid;
    else hi = mid;
  }
  return lo;
}

function contrastWithDarkBg(hex) {
  const toLinChannel = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const relLum = (h) => {
    const [r, g, b] = hex2srgb(h).map((c) => toLinChannel(c));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const la = relLum(hex);
  const lb = relLum(DARK_BG);
  const [hi, lo] = [la, lb].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

function generateDarkField(stops) {
  const topOld = toOklch(stops[3]);
  const sL = TOP_TARGET_L / topOld.L;
  const out = [stops[0]];
  for (let i = 1; i < FIELD_POSITIONS.length; i += 1) {
    const old = toOklch(stops[i]);
    const t = FIELD_POSITIONS[i] / 62;
    const L = old.L * sL;
    const desiredC = old.C * (1 + TOP_CHROMA_BOOST * t);
    const C = Math.min(desiredC, maxChromaAt(L, old.H));
    out.push(hexFromOklch(L, C, old.H).hex);
  }
  return out;
}

const requested = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const names = requested.length ? requested : Object.keys(gradientStops);

const result = {};
for (const name of names) {
  if (!gradientStops[name]) {
    console.error(`unknown ramp: ${name} (available: ${Object.keys(gradientStops).join(", ")})`);
    process.exit(2);
  }
  const dark = generateDarkField(gradientStops[name]);
  result[name] = dark;

  console.log(`\n${name}`);
  console.log("  stop  light      dark       L (target 0.62)   contrast-vs-darkbg");
  for (let i = 0; i < FIELD_POSITIONS.length; i += 1) {
    const L = i === 0 ? toOklch(dark[i]).L : toOklch(dark[i]).L;
    console.log(
      `  ${String(FIELD_POSITIONS[i]).padEnd(5)} ${gradientStops[name][i]}   ${dark[i]}   ${L.toFixed(3).padStart(6)}            ${contrastWithDarkBg(dark[i]).toFixed(2)}`,
    );
  }
}

console.log("\n--- paste into colors.ts's darkGradientStops ---\n");
console.log(JSON.stringify(result, null, 2));
