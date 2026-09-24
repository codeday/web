#!/usr/bin/env node

import { gradientStops } from "../src/Theme/vars/colors.ts";

const DARK_BG = "#1E1119";
const LIGHT_BG = "#ffffff";
const BLACK_TEXT = "#252222";
const WHITE_TEXT = "#ffffff";
const CHROMA_CAP = 0.155;
const DARK_CHROMA_SCALE = 0.85;

const hex2srgb = (h) => {
  h = h.trim().replace(/^#/, "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
};
const s2lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lin2s = (c) => {
  c = Math.max(0, Math.min(1, c));
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
};
const toLin = (hex) => hex2srgb(hex).map(s2lin);
const relLum = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const contrast = (a, b) => {
  const [hi, lo] = [relLum(toLin(a)), relLum(toLin(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

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
  return { hex: `#${toByte(r)}${toByte(g)}${toByte(b)}`, clipped };
}

function hexFromOklchInGamut(L, C, H) {
  let c = C;
  for (let i = 0; i < 40; i += 1) {
    const result = hexFromOklch(L, c, H);
    if (!result.clipped) return { ...result, C: c };
    c *= 0.95;
  }
  return { ...hexFromOklch(L, c, H), C: c };
}

function solveL({ H, C, ref, targetRatio, side }) {
  const refL = toOklch(ref).L;
  const [lo, hi] = side === "lighter" ? [refL, 0.99] : [0.01, refL];
  let best = null;
  for (let L = lo; L <= hi; L += 0.002) {
    const { hex } = hexFromOklchInGamut(L, C, H);
    const achieved = contrast(hex, ref);
    const diff = Math.abs(achieved - targetRatio);
    if (!best || diff < best.diff) best = { L, hex, achieved, diff };
  }
  return best;
}

function generateDarkStop(lightHex, { ref, targetRatio, side }) {
  const { C: lightC, H } = toOklch(lightHex);
  const C = Math.min(lightC * DARK_CHROMA_SCALE, CHROMA_CAP);
  const solved = solveL({ H, C, ref, targetRatio, side });
  return { hex: solved.hex, H, C, achieved: solved.achieved, target: targetRatio };
}

function hueLerp(h1, h2, t) {
  let diff = ((h2 - h1 + 540) % 360) - 180;
  return (h1 + diff * t + 360) % 360;
}

const CHROMA_SHAPE = {
  50: 0.035,
  100: 0.2,
  200: 0.28,
  300: 0.36,
  400: 0.68,
  500: 1.0,
  700: 0.92,
  900: 0.57,
};

function generateLightScale(stops) {
  const deepHex = stops[2];
  const midHex = stops[3];
  const deep = toOklch(deepHex);
  const mid = toOklch(midHex);

  const L = {
    600: mid.L,
    800: deep.L,
    500: mid.L + 0.24,
    700: mid.L - 0.1,
  };
  L[900] = L[700] - 0.15;
  L[300] = L[500] + 0.15;
  L[100] = L[300] + 0.043;
  L[200] = (L[100] + L[300]) / 2;
  L[400] = (L[300] + L[500]) / 2;
  for (const k of Object.keys(L)) L[k] = Math.min(0.97, Math.max(0.03, L[k]));
  L[50] = Math.min(0.98, L[100] + 0.05);

  const peakC = Math.min(Math.max(mid.C, deep.C), CHROMA_CAP);
  const hue = (stop) => (stop === 900 ? deep.H : mid.H);

  const light = { 600: { hex: midHex, ...mid }, 800: { hex: deepHex, ...deep } };
  for (const stop of [50, 100, 200, 300, 400, 500, 700, 900]) {
    const H =
      stop === 700 ? hueLerp(mid.H, deep.H, (mid.L - L[700]) / (mid.L - deep.L)) : hue(stop);
    const C = Math.min(peakC * CHROMA_SHAPE[stop], CHROMA_CAP);
    const { hex, C: achievedC } = hexFromOklchInGamut(L[stop], C, H);
    light[stop] = { hex, L: L[stop], C: achievedC, H };
  }
  return light;
}

function generateDarkScale(light) {
  const dark = {};
  for (const stop of [50, 100, 200, 300, 400]) {
    dark[stop] = generateDarkStop(light[stop].hex, {
      ref: DARK_BG,
      targetRatio: contrast(light[stop].hex, LIGHT_BG),
      side: "lighter",
    });
  }
  dark[700] = generateDarkStop(light[700].hex, {
    ref: dark[100].hex,
    targetRatio: contrast(light[700].hex, light[100].hex),
    side: "lighter",
  });
  const invertFill = (hex, lightTextRef, darkTextRef, side) =>
    generateDarkStop(hex, {
      ref: darkTextRef,
      targetRatio: contrast(hex, lightTextRef),
      side,
    });
  dark[500] = invertFill(light[500].hex, BLACK_TEXT, WHITE_TEXT, "darker");
  dark[600] = invertFill(light[600].hex, WHITE_TEXT, BLACK_TEXT, "lighter");
  dark[800] = invertFill(light[800].hex, WHITE_TEXT, BLACK_TEXT, "lighter");
  dark[900] = invertFill(light[900].hex, WHITE_TEXT, BLACK_TEXT, "lighter");
  return dark;
}

function hueDelta(a, b) {
  const d = Math.abs(a - b) % 360;
  return Math.min(d, 360 - d);
}

function report(name, light, dark) {
  console.log(`\n${name}`);
  console.log(
    "  stop  role                    light      dark       target   achieved  Δhue   chroma(L/D)  flags",
  );
  for (const stop of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
    const d = dark[stop];
    const l = light[stop];
    const flags = [];
    if (Math.abs(d.achieved - d.target) > 0.15) flags.push("WARN:contrast-drift");
    if (hueDelta(l.H, d.H) > 8) flags.push("WARN:hue-drift");
    if (d.C > CHROMA_CAP + 1e-6) flags.push("FAIL:chroma-cap");
    const role =
      stop === 500 || stop === 600 || stop === 800 || stop === 900
        ? "fill (role-inverted)"
        : stop === 700
          ? "text vs wash (bg-anchored)"
          : "wash/accent (bg-anchored)";
    console.log(
      `  ${String(stop).padEnd(5)} ${role.padEnd(23)} ${l.hex}   ${d.hex}   ` +
        `${d.target ? d.target.toFixed(2) : "  -  "}    ${d.achieved.toFixed(2)}      ` +
        `${hueDelta(l.H, d.H).toFixed(0).padStart(3)}°   ${l.C.toFixed(3)}/${d.C.toFixed(3)}   ${flags.join(", ") || "ok"}`,
    );
  }
}

const requested = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const names = requested.length ? requested : Object.keys(gradientStops);

const lightResult = {};
const darkResult = {};
for (const name of names) {
  if (!gradientStops[name]) {
    console.error(`unknown ramp: ${name} (available: ${Object.keys(gradientStops).join(", ")})`);
    process.exit(2);
  }
  const light = generateLightScale(gradientStops[name]);
  const dark = generateDarkScale(light);
  lightResult[name] = Object.fromEntries(Object.entries(light).map(([stop, v]) => [stop, v.hex]));
  darkResult[name] = Object.fromEntries(Object.entries(dark).map(([stop, v]) => [stop, v.hex]));
  report(name, light, dark);
}

console.log("\n--- paste into colors.ts (light, `rampScaleStops`) ---\n");
console.log(JSON.stringify(lightResult, null, 2));
console.log("\n--- paste into darkColors.ts (dark) ---\n");
console.log(JSON.stringify(darkResult, null, 2));
