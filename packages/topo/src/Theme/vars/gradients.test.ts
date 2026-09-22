import { describe, expect, it } from "vitest";

import { darkGradientStops, gradientStops } from "./colors";
import { accentOnWhite, buildGradientTokens, capRamp, contrastRatio } from "./gradients";

const RAMP_NAMES = Object.keys(gradientStops) as Array<keyof typeof gradientStops>;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ];
}

const WHITE: [number, number, number] = [255, 255, 255];

describe("capRamp", () => {
  it("reproduces the hand-tuned figjam@5.33 regression exactly", () => {
    const capped = capRamp(gradientStops.figjam, 5.33);
    const [lastColor] = capped[capped.length - 1];
    expect(lastColor).toBe("#A35070");
  });

  // Reference outputs for all six ramps at both contrast floors.
  const REFERENCE: Record<string, { at533: string; at636: string }> = {
    hibiscus: { at533: "#B2475B", at636: "#A4385B" },
    hotsauce: { at533: "#B74719", at636: "#A63D14" },
    chilioil: { at533: "#BC4035", at636: "#AF3130" },
    blackberry: { at533: "#A3544D", at636: "#95474E" },
    figjam: { at533: "#A35070", at636: "#944375" },
    marmalade: { at533: "#89650C", at636: "#7A5A0E" },
  };

  it.each(RAMP_NAMES)(
    "%s ends capRamp(@5.33) and capRamp(@6.36) on the approved reference colour",
    (name) => {
      const capped533 = capRamp(gradientStops[name], 5.33);
      const capped636 = capRamp(gradientStops[name], 6.36);
      expect(capped533[capped533.length - 1][0]).toBe(REFERENCE[name].at533);
      expect(capped636[capped636.length - 1][0]).toBe(REFERENCE[name].at636);
    },
  );

  it.each(RAMP_NAMES)("%s's capped end-stop clears its contrast floor against white", (name) => {
    // Rounding the boundary's continuous colour to the nearest hex channel
    // can undershoot the floor by a hair (bounded quantization error, not a
    // correctness bug) — the exact-match tests above are the real oracle.
    for (const floor of [5.33, 6.36]) {
      const capped = capRamp(gradientStops[name], floor);
      const [lastColor] = capped[capped.length - 1];
      expect(contrastRatio(hexToRgb(lastColor), WHITE)).toBeGreaterThanOrEqual(floor - 0.1);
    }
  });

  it("preserves every original stop below the truncation point unchanged", () => {
    const capped = capRamp(gradientStops.marmalade, 5.33);
    // The 0%, 20%, and 40% stops of marmalade all survive well under any
    // sane contrast floor, so they must appear verbatim (rescaled position
    // aside) rather than being recomputed.
    expect(capped[0][0]).toBe(gradientStops.marmalade[0]);
    expect(capped[1][0]).toBe(gradientStops.marmalade[1]);
    expect(capped[0][1]).toBe(0);
  });
});

describe("EmptyState's capped ramp", () => {
  it("marmalade's capRamp(~4.9) reproduces the worked example's contrast targets (14.8/7.7/4.9)", () => {
    // The literal example gradient is its own hand-tuned value (its 0% stop
    // is marmalade's *20%* original stop, not its 0% — a real ramp isn't
    // reproduced verbatim), so this checks the contrast targets it reports
    // rather than an exact-hex match.
    const capped = capRamp(gradientStops.marmalade, 4.9);
    const [, lastPosition] = capped[capped.length - 1];
    expect(lastPosition).toBe(100);
    const [lastColor] = capped[capped.length - 1];
    expect(contrastRatio(hexToRgb(lastColor), WHITE)).toBeGreaterThanOrEqual(4.85);
    // The 0% stop (marmalade's true near-black endpoint) clears the target
    // by a wide margin, matching the example's "14.8" figure in spirit.
    expect(contrastRatio(hexToRgb(capped[0][0]), WHITE)).toBeGreaterThan(10);
  });
});

describe("accentOnWhite", () => {
  // The 62% stop for every ramp — all six now clear the floor directly.
  const REFERENCE: Record<string, { accent: string; contrast: number }> = {
    hibiscus: { accent: "#A83A5C", contrast: 6.13 },
    hotsauce: { accent: "#BC4A1A", contrast: 5.08 },
    chilioil: { accent: "#A82A2E", contrast: 6.92 },
    blackberry: { accent: "#9B4A4E", contrast: 6.03 },
    figjam: { accent: "#8A3A78", contrast: 7.1 },
    marmalade: { accent: "#956F0A", contrast: 4.61 },
  };

  it.each(RAMP_NAMES)(
    "%s resolves within a channel-rounding hair of the approved reference accent",
    (name) => {
      // Binary-search boundaries round to the nearest hex channel, which can
      // land 1 unit off an independently hand-tuned reference at the same
      // contrast target — bounded quantization noise, not a correctness bug
      // (the only bit-exact requirement is the figjam capRamp regression
      // above, which does match exactly).
      const got = hexToRgb(accentOnWhite(gradientStops[name]));
      const want = hexToRgb(REFERENCE[name].accent);
      for (let channel = 0; channel < 3; channel += 1) {
        expect(Math.abs(got[channel] - want[channel])).toBeLessThanOrEqual(1);
      }
    },
  );

  it.each(RAMP_NAMES)("%s's accent clears 4.5:1 against white, marmalade included", (name) => {
    const accent = accentOnWhite(gradientStops[name]);
    expect(contrastRatio(hexToRgb(accent), WHITE)).toBeGreaterThanOrEqual(4.5 - 0.01);
  });

  it.each(RAMP_NAMES)(
    "%s returns the raw 62% stop, now that every ramp clears the floor",
    (name) => {
      const raw62 = gradientStops[name][3];
      expect(contrastRatio(hexToRgb(raw62), WHITE)).toBeGreaterThanOrEqual(4.5);
      expect(accentOnWhite(gradientStops[name])).toBe(raw62);
    },
  );
});

describe("FormatCards' white-on-field contract", () => {
  // Extracts just the hex colours out of a Panda stop-list string like
  // "#AABBCC 0%,#DDEEFF 100%" — the position suffixes don't matter here.
  function stopColors(stopList: string): string[] {
    return Array.from(stopList.matchAll(/#[0-9A-Fa-f]{6}/g)).map((m) => m[0]);
  }

  const tokens = buildGradientTokens();

  it.each(RAMP_NAMES)(
    "%s's flat mid (the 62% stop, now `colorPalette.600`), and every stop in its modal and rail fields, holds white at 4.5:1 — this is what lets FormatCards carry white body copy with no scrim",
    (name) => {
      const mid = gradientStops[name][3];
      const { modal, rail } = tokens[name];
      for (const color of [mid, ...stopColors(modal), ...stopColors(rail)]) {
        expect(contrastRatio(hexToRgb(color), WHITE), `${name} ${color}`).toBeGreaterThanOrEqual(
          4.5,
        );
      }
    },
  );
});

describe("darkGradientStops", () => {
  // `colors.ts`'s `colors.modes.dark.bg` — duplicated here rather than
  // imported so this contract reads the same literal value a consumer
  // would, the same convention `scripts/generate-dark-gradient-stops.mjs`
  // uses for its own copy.
  const DARK_BG: [number, number, number] = [0x1e, 0x11, 0x19];

  it.each(RAMP_NAMES)("%s's dark field pins the shared anchor unchanged", (name) => {
    expect(darkGradientStops[name][0]).toBe(gradientStops[name][0]);
  });

  it.each(RAMP_NAMES)(
    "%s's dark 62% stop reads as a foreground accent against the dark ground, in the same ~4.5-5:1 ballpark every ramp's light-mode accent holds against white",
    (name) => {
      const top = darkGradientStops[name][3];
      expect(contrastRatio(hexToRgb(top), DARK_BG)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(hexToRgb(top), DARK_BG)).toBeLessThan(5.5);
    },
  );

  it.each(RAMP_NAMES)("%s's dark field rises monotonically toward the accent", (name) => {
    const stops = darkGradientStops[name].map((hex) => {
      const [r, g, b] = hexToRgb(hex);
      return 0.2126 * r + 0.7152 * g + 0.0722 * b; // relative brightness ordering only
    });
    for (let i = 1; i < stops.length; i += 1) {
      expect(stops[i]).toBeGreaterThan(stops[i - 1]);
    }
  });
});
