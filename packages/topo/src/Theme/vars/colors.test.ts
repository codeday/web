import { describe, expect, it } from "vitest";

import colors, { gradientStops, rampScaleStops } from "./colors";
import darkColors from "./darkColors";
import { contrastRatio } from "./gradients";
import system from "./index";

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
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ];
}

describe("semantic palette stop contract", () => {
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
    expect(
      contrastRatio(hexToRgb(colors[hue][900]), hexToRgb(colors[hue][100])),
    ).toBeGreaterThanOrEqual(4.5);
  });

  it.each(HUES)(
    "%s.800 clears 4.5:1 against white (it's a dark fill under white text, like .600)",
    (hue) => {
      expect(contrastRatio(hexToRgb(colors[hue][800]), WHITE)).toBeGreaterThanOrEqual(4.5);
    },
  );

  const ALL_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
  it.each(HUES)("%s defines the full ten-stop scale (50-900)", (hue) => {
    for (const stop of ALL_STOPS) {
      expect(colors[hue][stop]).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it.each(HUES)("%s's dark-mode counterparts (darkColors.ts) cover the same ten stops", (hue) => {
    const dark = darkColors[hue as keyof typeof darkColors] as unknown as Record<number, string>;
    for (const stop of ALL_STOPS) {
      expect(dark[stop]).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(dark[stop]).not.toBe(colors[hue][stop]);
    }
  });
});

describe("gray.1100 removal (step 5 of the palette migration)", () => {
  it("is gone from the palette entirely", () => {
    expect(colors.gray[1100]).toBeUndefined();
  });

  it("dark-mode background/foreground is the warm near-black ground", () => {
    expect(colors.modes.dark.bg).toBe("#1E1119");
    expect(colors.modes.dark.background).toBe("#1E1119");
  });
});

const RAMP_NAMES = Object.keys(gradientStops) as Array<keyof typeof gradientStops>;

describe("ramp scale stop contract", () => {
  it.each(RAMP_NAMES)("%s.600 is pinned to the ramp's 62% (mid) gradient stop", (name) => {
    expect(rampScaleStops[name][600]).toBe(gradientStops[name][3]);
  });

  it.each(RAMP_NAMES)("%s.800 is pinned to the ramp's 40% (deep) gradient stop", (name) => {
    expect(rampScaleStops[name][800]).toBe(gradientStops[name][2]);
  });

  it.each(RAMP_NAMES)(
    "%s.500 clears 4.5:1 against black (it's a light fill under black text)",
    (name) => {
      expect(contrastRatio(hexToRgb(rampScaleStops[name][500]), BLACK)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each(RAMP_NAMES)(
    "%s.600 clears 4.5:1 against white (it's a dark fill under white text)",
    (name) => {
      expect(contrastRatio(hexToRgb(rampScaleStops[name][600]), WHITE)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each(RAMP_NAMES)("%s.700 clears 4.5:1 against white", (name) => {
    expect(contrastRatio(hexToRgb(rampScaleStops[name][700]), WHITE)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(RAMP_NAMES)(
    "%s.900 clears 4.5:1 against its own %s.100 (near-black text on a wash)",
    (name) => {
      expect(
        contrastRatio(hexToRgb(rampScaleStops[name][900]), hexToRgb(rampScaleStops[name][100])),
      ).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each(RAMP_NAMES)("%s's bg-anchored stops differ between light and dark", (name) => {
    for (const stop of [100, 200, 300, 400, 700]) {
      expect(darkColors[name][stop as 100]).not.toBe(rampScaleStops[name][stop]);
    }
  });

  it.each(RAMP_NAMES)("%s's fill stops invert between light and dark modes", (name) => {
    for (const stop of [500, 600, 800, 900]) {
      expect(darkColors[name][stop as 500]).not.toBe(rampScaleStops[name][stop]);
    }
  });

  it.each(RAMP_NAMES)(
    "%s.500's dark counterpart clears 4.5:1 against white (light fill under black text becomes a dark fill under white text)",
    (name) => {
      expect(contrastRatio(hexToRgb(darkColors[name][500]), WHITE)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each(RAMP_NAMES)(
    "%s.600's dark counterpart clears 4.5:1 against black (dark fill under white text becomes a light fill under black text)",
    (name) => {
      expect(contrastRatio(hexToRgb(darkColors[name][600]), BLACK)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each(RAMP_NAMES)("%s.800's dark counterpart clears 4.5:1 against black", (name) => {
    expect(contrastRatio(hexToRgb(darkColors[name][800]), BLACK)).toBeGreaterThanOrEqual(4.5);
  });
});

describe("brand alias", () => {
  it("is the Hibiscus accent, not red.600", () => {
    expect(colors.brand).toBe("#A83A5C");
    expect(colors.brand).not.toBe(colors.red[600]);
  });
});

describe("every color family exposes the same token shapes", () => {
  const FAMILIES = [...HUES, ...Object.keys(rampScaleStops)];
  const EXPECTED_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const isGradient = (prop: string) => /(^|\.)(gradient|badgeGradient)(\.|$)/.test(prop);
  const shapeOf = (prop: string) => prop.replace(/^true\.\d+$/, "true.N").replace(/^\d+$/, "N");

  const propsOf = (family: string) =>
    system.tokens.allTokens
      .filter((t) => t.name.startsWith(`colors.${family}.`) && !t.extensions.virtual)
      .map((t) => t.name.slice(`colors.${family}.`.length));

  const shapesOf = (family: string) =>
    [
      ...new Set(
        propsOf(family)
          .filter((p) => !isGradient(p))
          .map(shapeOf),
      ),
    ].sort();

  const reference = shapesOf("gray");

  it("gray (the reference family) exposes the expected shapes", () => {
    expect(reference).toEqual([
      "N",
      "border",
      "contrast",
      "emphasized",
      "fg",
      "focusRing",
      "muted",
      "solid",
      "subtle",
      "true.N",
    ]);
  });

  it.each(FAMILIES)("%s exposes the same shapes as gray", (family) => {
    expect(shapesOf(family)).toEqual(reference);
  });

  it.each(FAMILIES)("%s has exactly the 50-900 stops, nothing extra", (family) => {
    const stops = [
      ...new Set(
        propsOf(family)
          .filter((p) => /^\d+$/.test(p))
          .map(Number),
      ),
    ].sort((a, b) => a - b);
    expect(stops).toEqual(EXPECTED_STOPS);
  });
});

describe("built system emits every semantic-hue stop as a mode-aware token", () => {
  const STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
  const cases = HUES.flatMap((hue) => STOPS.map((stop) => [hue, stop] as const));

  it.each(cases)("%s.%s flips between the light and dark palettes", (hue, stop) => {
    const token = system.tokens.getByName(`colors.${hue}.${stop}`);
    expect(token?.extensions.conditions).toEqual({
      base: colors[hue][stop],
      _dark: darkColors[hue][stop],
    });
  });

  const darkByName = darkColors as Record<string, Record<string, string>>;
  const rampCases = Object.entries(rampScaleStops).flatMap(([ramp, stops]) =>
    Object.entries(stops).map(([stop, light]) => [ramp, stop, light] as const),
  );

  it.each(rampCases)("%s.%s flips between the light and dark ramps", (ramp, stop, light) => {
    const token = system.tokens.getByName(`colors.${ramp}.${stop}`);
    expect(token?.extensions.conditions).toEqual({
      base: light,
      _dark: darkByName[ramp][stop],
    });
  });
});
