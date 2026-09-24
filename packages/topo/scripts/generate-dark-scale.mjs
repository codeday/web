#!/usr/bin/env node

import colors from "../src/Theme/vars/colors.ts";

const DARK_BG = "#1E1119";
const LIGHT_BG = "#ffffff";
const BLACK_TEXT = colors.black;
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

function solveL({ H, C, ref, targetRatio, side }) {
  const refL = toOklch(ref).L;
  const [lo, hi] = side === "lighter" ? [refL, 0.99] : [0.01, refL];
  let best = null;
  for (let L = lo; L <= hi; L += 0.002) {
    const { hex } = hexFromOklch(L, C, H);
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

const ANCHOR_STOPS = [100, 300, 500, 600, 700, 900];
function deriveFullLightScale(allStops, canonicalL) {
  const out = { ...allStops };
  const cAt = (stops, k) => {
    if (stops[k] !== undefined) return toOklch(stops[k]).C;
    if (k === 200) return (toOklch(stops[100]).C + toOklch(stops[300]).C) / 2;
    if (k === 400) return (toOklch(stops[300]).C + toOklch(stops[500]).C) / 2;
    if (k === 800) return (toOklch(stops[700]).C + toOklch(stops[900]).C) / 2;
    if (k === 50) return toOklch(stops[100]).C * 0.7;
    throw new Error(`no chroma rule for stop ${k}`);
  };
  for (const [hue, stops] of Object.entries(out)) {
    const H = toOklch(stops[500]).H;
    const full = {};
    for (const k of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
      if (stops[k] !== undefined) {
        full[k] = stops[k];
      } else {
        const C = Math.min(Math.max(cAt(stops, k), 0), CHROMA_CAP);
        full[k] = hexFromOklch(canonicalL[k], C, H).hex;
      }
    }
    out[hue] = full;
  }
  return out;
}
function canonicalLightnessCurve(palettes) {
  const hues = Object.keys(palettes);
  const avgL = {};
  for (const k of ANCHOR_STOPS) {
    avgL[k] = hues.reduce((sum, h) => sum + toOklch(palettes[h][k]).L, 0) / hues.length;
  }
  const L = {
    ...avgL,
    200: (avgL[100] + avgL[300]) / 2,
    400: (avgL[300] + avgL[500]) / 2,
    800: (avgL[700] + avgL[900]) / 2,
  };
  L[50] = avgL[100] + (avgL[100] - L[200]);
  return L;
}

const WASH_STOPS = [50, 100, 200, 300, 400];
function generatePalette(name, stops) {
  const dark = {};
  for (const stop of WASH_STOPS) {
    dark[stop] = generateDarkStop(stops[stop], {
      ref: DARK_BG,
      targetRatio: contrast(stops[stop], LIGHT_BG),
      side: "lighter",
    });
  }
  dark[700] = generateDarkStop(stops[700], {
    ref: dark[100].hex,
    targetRatio: contrast(stops[700], stops[100]),
    side: "lighter",
  });

  const invertFill = (hex, lightTextRef, darkTextRef, side) =>
    generateDarkStop(hex, {
      ref: darkTextRef,
      targetRatio: contrast(hex, lightTextRef),
      side,
    });

  dark[500] = invertFill(stops[500], BLACK_TEXT, WHITE_TEXT, "darker");
  dark[600] = invertFill(stops[600], WHITE_TEXT, BLACK_TEXT, "lighter");
  dark[800] = invertFill(stops[800], WHITE_TEXT, BLACK_TEXT, "lighter");
  dark[900] = invertFill(stops[900], WHITE_TEXT, BLACK_TEXT, "lighter");

  return dark;
}

function hueDelta(a, b) {
  const d = Math.abs(a - b) % 360;
  return Math.min(d, 360 - d);
}

function report(name, lightStops, darkStops) {
  console.log(`\n${name}`);
  console.log(
    "  stop  role                    light      dark       target   achieved  Δhue   chroma(L/D)  flags",
  );
  for (const stop of [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]) {
    const d = darkStops[stop];
    const lightOklch = toOklch(lightStops[stop]);
    const flags = [];
    if (Math.abs(d.achieved - d.target) > 0.15) flags.push("WARN:contrast-drift");
    if (hueDelta(lightOklch.H, d.H) > 8) flags.push("WARN:hue-drift");
    if (d.C > CHROMA_CAP + 1e-6) flags.push("FAIL:chroma-cap");
    const role =
      stop === 500 || stop === 600 || stop === 800 || stop === 900
        ? "fill (role-inverted)"
        : stop === 700
          ? "text vs wash (bg-anchored)"
          : "wash/accent (bg-anchored)";
    console.log(
      `  ${String(stop).padEnd(5)} ${role.padEnd(23)} ${lightStops[stop]}   ${d.hex}   ` +
        `${d.target ? d.target.toFixed(2) : "  -  "}    ${d.achieved.toFixed(2)}      ` +
        `${hueDelta(lightOklch.H, d.H).toFixed(0).padStart(3)}°   ${lightOklch.C.toFixed(3)}/${d.C.toFixed(3)}   ${flags.join(", ") || "ok"}`,
    );
  }
}

const FULL_HUES = {
  gray: colors.gray,
  red: colors.red,
  orange: colors.orange,
  yellow: colors.yellow,
  green: colors.green,
  teal: colors.teal,
  cyan: colors.cyan,
  blue: colors.blue,
  indigo: colors.indigo,
  purple: colors.purple,
  pink: colors.pink,
};
const ANCHORS_ONLY = Object.fromEntries(
  Object.entries(FULL_HUES).map(([hue, stops]) => [
    hue,
    Object.fromEntries(ANCHOR_STOPS.map((k) => [k, stops[k]])),
  ]),
);
const canonicalL = canonicalLightnessCurve(ANCHORS_ONLY);
const PALETTES = deriveFullLightScale(ANCHORS_ONLY, canonicalL);
const requested = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const names = requested.length ? requested : Object.keys(PALETTES);

const result = {};
for (const name of names) {
  if (!PALETTES[name]) {
    console.error(`unknown palette: ${name} (available: ${Object.keys(PALETTES).join(", ")})`);
    process.exit(2);
  }
  const dark = generatePalette(name, PALETTES[name]);
  result[name] = Object.fromEntries(Object.entries(dark).map(([stop, v]) => [stop, v.hex]));
  report(name, PALETTES[name], dark);
}

console.log("\n--- paste into darkColors.ts ---\n");
console.log(JSON.stringify(result, null, 2));
