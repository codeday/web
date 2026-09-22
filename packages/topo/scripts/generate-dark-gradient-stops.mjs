#!/usr/bin/env node
/**
 * Generates each ramp's dark-mode "field" stop set — the 0/20/40/62% run,
 * the only part of a ramp that ever carries a contrast requirement (82%/100%
 * stay the shared decorative sand tail per `colors.ts`'s own stop-role
 * comment, and don't get a dark counterpart).
 *
 * Method, in OKLCH:
 *   - 0% (the shared near-black anchor, `#120510`) is pinned — copied
 *     verbatim, not recomputed. Moving it would break the "shared anchor"
 *     read across all six ramps.
 *   - Every other stop keeps its own light-mode hue exactly (the ramp's own
 *     hue path is unchanged) and has its lightness scaled up by a single
 *     per-ramp factor chosen so the 62% stop's L lands at 0.62 — bright
 *     enough to read as a foreground accent against the new dark ground
 *     (`current.bg`, #1E1119) rather than the deep fill role it plays in
 *     light mode.
 *   - Chroma rises alongside it: 0% boost at the anchor (unchanged) to +25%
 *     at the 62% stop, linear in position in between. A flat brightness
 *     lift alone reads washed-out on a dark ground; the extra saturation is
 *     what keeps the accent feeling like the same brand colour instead of a
 *     pastel of it.
 *   - The desired (boosted) chroma is then clamped to the sRGB gamut at
 *     each stop's own L/H — hotsauce and marmalade's naive +25% top
 *     overshoots the gamut at L 0.62 for their hues, so those two land
 *     slightly under +25% rather than being allowed to clip.
 *
 * Usage:
 *   node scripts/generate-dark-gradient-stops.mjs             # all six ramps
 *   node scripts/generate-dark-gradient-stops.mjs hibiscus    # just one
 *
 * Prints a report (target vs achieved L, chroma boost, contrast against the
 * dark ground) and a paste-ready object literal for `Theme/vars/colors.ts`'s
 * `darkGradientStops`. Re-run whenever a ramp's light-mode `gradientStops`
 * change.
 */

import { gradientStops } from "../src/Theme/vars/colors.ts";

// -- constants ---------------------------------------------------------------
// Duplicated rather than imported from `generate-ramp-scale.mjs` /
// `generate-dark-scale.mjs` so each generator script stays a standalone,
// copy-pasteable tool.
const DARK_BG = "#1E1119"; // colors.ts's `colors.modes.dark.bg`
const FIELD_POSITIONS = [0, 20, 40, 62]; // colors.ts's `STOP_POSITIONS`, up to the 62% accent
const TOP_TARGET_L = 0.62;
const TOP_CHROMA_BOOST = 0.25; // +25% at the 62% stop, 0% at the anchor, linear between

// -- color math (OKLCH via Björn Ottosson's OKLab, sRGB D65) — identical to
// the other two generator scripts. ------------------------------------------
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

// Binary search for the largest in-gamut chroma at a given L/H.
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

// -- generation ----------------------------------------------------------------
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

// -- main ----------------------------------------------------------------------
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
