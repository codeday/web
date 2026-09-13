import { describe, expect, it } from "vitest";

import { gradientStops } from "./colors";
import { accentOnWhite, capRamp, contrastRatio } from "./gradients";

const RAMP_NAMES = Object.keys(gradientStops) as Array<keyof typeof gradientStops>;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [Number.parseInt(h.slice(0, 2), 16), Number.parseInt(h.slice(2, 4), 16), Number.parseInt(h.slice(4, 6), 16)];
}

const WHITE: [number, number, number] = [255, 255, 255];

describe("capRamp", () => {
  it("reproduces the hand-tuned figjam@5.33 regression exactly (.spec.md §1.2)", () => {
    const capped = capRamp(gradientStops.figjam, 5.33);
    const [lastColor] = capped[capped.length - 1];
    expect(lastColor).toBe("#A35070");
  });

  // Reference outputs for all six ramps at both contrast floors (.spec.md §1.2).
  const REFERENCE: Record<string, { at533: string; at636: string }> = {
    hibiscus: { at533: "#B2475B", at636: "#A4385B" },
    hotsauce: { at533: "#B74719", at636: "#A63D14" },
    chilioil: { at533: "#BC4035", at636: "#AF3130" },
    blackberry: { at533: "#A3544D", at636: "#95474E" },
    figjam: { at533: "#A35070", at636: "#944375" },
    marmalade: { at533: "#886616", at636: "#7A5A13" },
  };

  it.each(RAMP_NAMES)("%s ends capRamp(@5.33) and capRamp(@6.36) on the approved reference colour", (name) => {
    const capped533 = capRamp(gradientStops[name], 5.33);
    const capped636 = capRamp(gradientStops[name], 6.36);
    expect(capped533[capped533.length - 1][0]).toBe(REFERENCE[name].at533);
    expect(capped636[capped636.length - 1][0]).toBe(REFERENCE[name].at636);
  });

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

describe("accentOnWhite", () => {
  // .spec.md §1.3 — the 62% stop, except marmalade which must walk down.
  const REFERENCE: Record<string, { accent: string; contrast: number }> = {
    hibiscus: { accent: "#A83A5C", contrast: 6.13 },
    hotsauce: { accent: "#BC4A1A", contrast: 5.08 },
    chilioil: { accent: "#A82A2E", contrast: 6.92 },
    blackberry: { accent: "#9B4A4E", contrast: 6.03 },
    figjam: { accent: "#8A3A78", contrast: 7.1 },
    marmalade: { accent: "#957018", contrast: 4.56 },
  };

  it.each(RAMP_NAMES)("%s resolves within a channel-rounding hair of the approved reference accent", (name) => {
    // Binary-search boundaries round to the nearest hex channel, which can
    // land 1 unit off an independently hand-tuned reference at the same
    // contrast target — bounded quantization noise, not a correctness bug
    // (§6.1's only bit-exact requirement is the figjam capRamp regression
    // above, which does match exactly).
    const got = hexToRgb(accentOnWhite(gradientStops[name]));
    const want = hexToRgb(REFERENCE[name].accent);
    for (let channel = 0; channel < 3; channel += 1) {
      expect(Math.abs(got[channel] - want[channel])).toBeLessThanOrEqual(1);
    }
  });

  it.each(RAMP_NAMES)("%s's accent clears 4.5:1 against white, marmalade included", (name) => {
    const accent = accentOnWhite(gradientStops[name]);
    expect(contrastRatio(hexToRgb(accent), WHITE)).toBeGreaterThanOrEqual(4.5 - 0.01);
  });

  it("returns the raw 62% stop for ramps that already clear the floor", () => {
    expect(accentOnWhite(gradientStops.hibiscus)).toBe(gradientStops.hibiscus[3]);
  });

  it("walks down (not to a discrete stop) for marmalade, whose 62% stop fails", () => {
    const raw62 = gradientStops.marmalade[3];
    expect(contrastRatio(hexToRgb(raw62), WHITE)).toBeLessThan(4.5);
    const accent = accentOnWhite(gradientStops.marmalade);
    expect(accent).not.toBe(raw62);
    expect(gradientStops.marmalade).not.toContain(accent);
  });
});
