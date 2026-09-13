import { describe, expect, it } from "vitest";

import colors from "./colors";
import { contrastRatio } from "./gradients";

// The eleven semantic-palette hues (.spec.md §2); `gray` is included, per the
// spec's own scale table, alongside the ten colour hues.
const HUES = [
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "purple",
  "pink",
] as const;

const BLACK: [number, number, number] = [0, 0, 0];
const WHITE: [number, number, number] = [255, 255, 255];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [Number.parseInt(h.slice(0, 2), 16), Number.parseInt(h.slice(2, 4), 16), Number.parseInt(h.slice(4, 6), 16)];
}

// .spec.md §6.1 — the stop contract's contrast rules.
describe("semantic palette stop contract (.spec.md §2, §6.1)", () => {
  it.each(HUES)("%s.500 clears 4.5:1 against black (it's a light fill under black text)", (hue) => {
    expect(contrastRatio(hexToRgb(colors[hue][500]), BLACK)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(HUES)("%s.600 clears 4.5:1 against white (it's a dark fill under white text)", (hue) => {
    expect(contrastRatio(hexToRgb(colors[hue][600]), WHITE)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(HUES)("%s.700 clears 4.5:1 against white (it's a dark fill under white text)", (hue) => {
    expect(contrastRatio(hexToRgb(colors[hue][700]), WHITE)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(HUES)("%s.900 clears 4.5:1 against its own %s.100 (near-black text on a wash)", (hue) => {
    expect(contrastRatio(hexToRgb(colors[hue][900]), hexToRgb(colors[hue][100]))).toBeGreaterThanOrEqual(4.5);
  });
});

describe("gray.1100 removal (.spec.md §2.1 step 5)", () => {
  it("is gone from the palette entirely", () => {
    expect(colors.gray[1100]).toBeUndefined();
  });

  it("dark-mode background/foreground still hardcodes the old gray.1100 value", () => {
    expect(colors.modes.dark.bg).toBe("#292929");
    expect(colors.modes.dark.background).toBe("#292929");
  });
});

describe("brand alias (.spec.md §2.1)", () => {
  it("is the Hibiscus accent, not red.600", () => {
    expect(colors.brand).toBe("#A83A5C");
    expect(colors.brand).not.toBe(colors.red[600]);
  });
});
