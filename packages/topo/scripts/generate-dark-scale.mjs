#!/usr/bin/env node
/**
 * Generates dark-mode counterparts for a palette's stops computationally
 * (OKLCH search + WCAG contrast targets) instead of hand-picking or
 * mechanically inverting the light-mode scale.
 *
 *   - 100, 300 relate to the *page* background (wash, light accent) — this
 *     flips between modes, so the dark stop is solved to hit the same
 *     contrast ratio against the dark surface that the light stop hits
 *     against the light surface.
 *   - 700 is the on-wash / on-page text role (button.ts's danger hover text,
 *     field.ts's error text, StatementBlock's body text) — its counterpart
 *     is solved against the *new* dark 100, which also happens to sit close
 *     enough to the real page background (#292929) that this covers the
 *     direct-on-page-bg text cases too.
 *   - 500, 600, 900 are fills whose job is contrast against a *fixed* text
 *     color (black or white) or, for 900, a fixed dark bubble bg — every
 *     stop inverts its ROLE for dark mode instead of staying identical: a
 *     light fill built for black text (500) becomes a dark fill built for
 *     white text, and a dark fill built for white text (600, 900) becomes a
 *     light fill built for black text — each solved to hold the *same*
 *     contrast ratio the light stop held against its own paired text color,
 *     now against the opposite one. Consumers that paired one of these with
 *     a fixed `trueWhite`/`trueBlack` label need that label switched back to
 *     the self-inverting `white`/`black`, since the fill now flips with it.
 *
 * Usage:
 *   node scripts/generate-dark-scale.mjs            # gray + red
 *   node scripts/generate-dark-scale.mjs red        # just one palette
 *
 * Prints a report (target vs. achieved contrast, hue drift, chroma) and a
 * paste-ready object literal for `Theme/vars/darkColors.ts`. Re-run this
 * whenever a light-mode stop in `Theme/vars/colors.ts` changes.
 */

import colors from "../src/Theme/vars/colors.ts";

// -- constants -------------------------------------------------------------
const DARK_BG = "#292929";
const LIGHT_BG = "#ffffff";
const BLACK_TEXT = colors.black; // "#252222" — not pure black
const WHITE_TEXT = "#ffffff";
const CHROMA_CAP = 0.155; // matches the doc'd cap in colors.ts
const DARK_CHROMA_SCALE = 0.85; // simultaneous-contrast: same chroma reads more saturated on a dark surface

// -- color math (OKLCH via Björn Ottosson's OKLab, sRGB D65) ---------------
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

// Scans L (fine-grained, gamut-clip-safe — no monotonicity assumed) within
// the given half of the range to find the stop whose contrast against `ref`
// best matches `targetRatio`, holding hue/chroma fixed.
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

// -- role rules --------------------------------------------------------------
// 100/300: "wash" and "light accent" relate to the page background, which
// flips — solve for a dark hex that's *lighter* than the dark surface by the
// same contrast margin the light stop holds against the light surface.
// 700: the on-wash / on-page text role — solved against the *new* dark 100,
// lighter than it by the same margin the light 700 holds against light 100.
// 500/600/900: fills whose contrast requirement is against a fixed text
// color (black/white) or, for 900, a fixed dark bubble bg — held identical,
// just sanity-checked against the dark surface.
function generatePalette(name, stops) {
  const dark100 = generateDarkStop(stops[100], {
    ref: DARK_BG,
    targetRatio: contrast(stops[100], LIGHT_BG),
    side: "lighter",
  });
  const dark300 = generateDarkStop(stops[300], {
    ref: DARK_BG,
    targetRatio: contrast(stops[300], LIGHT_BG),
    side: "lighter",
  });
  const dark700 = generateDarkStop(stops[700], {
    ref: dark100.hex,
    targetRatio: contrast(stops[700], stops[100]),
    side: "lighter",
  });

  // Fill stops invert their role rather than staying identical: solved
  // against the *opposite* fixed text color, holding the same contrast
  // ratio the light stop held against its own paired text.
  const invertFill = (hex, lightTextRef, darkTextRef, side) =>
    generateDarkStop(hex, {
      ref: darkTextRef,
      targetRatio: contrast(hex, lightTextRef),
      side,
    });

  return {
    100: dark100,
    300: dark300,
    500: invertFill(stops[500], BLACK_TEXT, WHITE_TEXT, "darker"),
    600: invertFill(stops[600], WHITE_TEXT, BLACK_TEXT, "lighter"),
    700: dark700,
    900: invertFill(stops[900], WHITE_TEXT, BLACK_TEXT, "lighter"),
  };
}

// -- report ------------------------------------------------------------------
function hueDelta(a, b) {
  const d = Math.abs(a - b) % 360;
  return Math.min(d, 360 - d);
}

function report(name, lightStops, darkStops) {
  console.log(`\n${name}`);
  console.log(
    "  stop  role                    light      dark       target   achieved  Δhue   chroma(L/D)  flags",
  );
  for (const stop of [100, 300, 500, 600, 700, 900]) {
    const d = darkStops[stop];
    const lightOklch = toOklch(lightStops[stop]);
    const flags = [];
    if (Math.abs(d.achieved - d.target) > 0.15) flags.push("WARN:contrast-drift");
    if (hueDelta(lightOklch.H, d.H) > 8) flags.push("WARN:hue-drift");
    if (d.C > CHROMA_CAP + 1e-6) flags.push("FAIL:chroma-cap");
    const role =
      stop === 500 || stop === 600 || stop === 900
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

// -- main ----------------------------------------------------------------------
const PALETTES = { gray: colors.gray, red: colors.red };
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
