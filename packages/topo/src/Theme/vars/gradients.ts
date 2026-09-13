import {
  GRADIENT_BUTTON_POSITIONS,
  STOP_POSITIONS,
  type GradientName,
  gradientButtonStops,
  gradientStops,
} from "./colors";

// ---------------------------------------------------------------------------
// Colour-space helpers. Ramps are interpolated in sRGB exactly as a CSS
// `linear-gradient()` would interpolate them — no gamma correction beyond the
// standard sRGB -> linear step used for WCAG contrast.
// ---------------------------------------------------------------------------
type Rgb = readonly [number, number, number];

const WHITE: Rgb = [255, 255, 255];

function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ];
}

function rgbToHex([r, g, b]: Rgb): string {
  const c = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}

function srgbChannelToLinear(c: number): number {
  const cs = c / 255;
  return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([r, g, b]: Rgb): number {
  return (
    0.2126 * srgbChannelToLinear(r) + 0.7152 * srgbChannelToLinear(g) + 0.0722 * srgbChannelToLinear(b)
  );
}

/** WCAG contrast ratio between two sRGB colours (1:1 to 21:1). */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

function contrastWithWhite(hex: string): number {
  return contrastRatio(hexToRgb(hex), WHITE);
}

/**
 * Interpolate a set of stops (positioned at `STOP_POSITIONS`, in % / 100) at
 * fractional position `u`, channel-linear in sRGB — exactly how a CSS
 * `linear-gradient()` stop list interpolates.
 */
function rampAt(stops: readonly string[], u: number): Rgb {
  const pos = u * 100;
  for (let i = 0; i < STOP_POSITIONS.length - 1; i += 1) {
    const p0 = STOP_POSITIONS[i];
    const p1 = STOP_POSITIONS[i + 1];
    if (pos >= p0 && pos <= p1) {
      const t = p1 === p0 ? 0 : (pos - p0) / (p1 - p0);
      const c0 = hexToRgb(stops[i]);
      const c1 = hexToRgb(stops[i + 1]);
      return [c0[0] + (c1[0] - c0[0]) * t, c0[1] + (c1[1] - c0[1]) * t, c0[2] + (c1[2] - c0[2]) * t];
    }
  }
  return hexToRgb(stops[stops.length - 1]);
}

const SEARCH_ITERATIONS = 60; // far more precision than a hex channel needs

/**
 * Truncate a ramp at the last point where white text still clears
 * `minContrast`, then rescale the surviving stops back across 0-100%.
 * (.spec.md §1.2)
 */
export function capRamp(stops: readonly string[], minContrast: number): Array<[string, number]> {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < SEARCH_ITERATIONS; i += 1) {
    const mid = (lo + hi) / 2;
    if (contrastRatio(rampAt(stops, mid), WHITE) >= minContrast) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  const u = lo;
  const result: Array<[string, number]> = [];
  for (let i = 0; i < STOP_POSITIONS.length; i += 1) {
    const position = STOP_POSITIONS[i];
    if (position / 100 < u) {
      result.push([stops[i], position / u]);
    }
  }
  result.push([rgbToHex(rampAt(stops, u)), 100]);
  return result;
}

/**
 * The 62% stop, unless it fails `minContrast` on white, in which case walk
 * back down the ramp (continuously, not stop-to-stop) until it passes.
 * (.spec.md §1.3)
 */
export function accentOnWhite(stops: readonly string[], minContrast = 4.5): string {
  const MID = 0.62;
  if (contrastRatio(rampAt(stops, MID), WHITE) >= minContrast) {
    return stops[3];
  }
  let lo = 0;
  let hi = MID;
  for (let i = 0; i < SEARCH_ITERATIONS; i += 1) {
    const mid = (lo + hi) / 2;
    if (contrastRatio(rampAt(stops, mid), WHITE) >= minContrast) {
      lo = mid; // still passes — walk back up toward the 62% stop
    } else {
      hi = mid; // fails — need to go darker
    }
  }
  return rgbToHex(rampAt(stops, lo));
}

function stopList(stops: readonly string[], positions: readonly number[]): string {
  return stops.map((color, i) => `${color} ${positions[i]}%`).join(",");
}

export interface GradientTokenSet {
  full: string;
  button: string;
  deep: string;
  mid: string;
}

/** Build the full token set (.spec.md §1.1) for every named ramp. */
export function buildGradientTokens(): Record<GradientName, GradientTokenSet> {
  const names = Object.keys(gradientStops) as GradientName[];
  return Object.fromEntries(
    names.map((name) => {
      const stops = gradientStops[name];
      return [
        name,
        {
          full: stopList(stops, STOP_POSITIONS),
          button: stopList(gradientButtonStops[name], GRADIENT_BUTTON_POSITIONS),
          deep: stops[2], // 40% stop
          mid: stops[3], // 62% stop
        },
      ];
    }),
  ) as Record<GradientName, GradientTokenSet>;
}

export function buildAccentsOnWhite(minContrast = 4.5): Record<GradientName, string> {
  const names = Object.keys(gradientStops) as GradientName[];
  return Object.fromEntries(names.map((name) => [name, accentOnWhite(gradientStops[name], minContrast)])) as Record<
    GradientName,
    string
  >;
}

export { contrastWithWhite };
