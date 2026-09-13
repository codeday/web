import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

import { defaultFontSizes } from "../../utils";
import colors from "./colors";
import fonts from "./fonts";
import { buildGradientTokens } from "./gradients";
import { recipes, slotRecipes } from "./recipes";

// ---------------------------------------------------------------------------
// Helper: recursively convert a nested colour object into Chakra v3 token
// format where every leaf string becomes { value: "..." }.
// Non-string leaves (functions, arrays, objects that aren't colour scales)
// are skipped so that composite entries like `grad`, `modes`, `current`,
// `success`, and `failure` are not accidentally tokenised.
// ---------------------------------------------------------------------------
function toColorScale(obj: Record<string | number, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "string") {
      out[String(k)] = { value: v };
    } else if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      const nested = toColorScale(v as Record<string | number, unknown>);
      if (Object.keys(nested).length > 0) {
        out[String(k)] = nested;
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Colour tokens
// The full CodeDay palette overrides Chakra v3's built-in defaults so that
// references like `bg="red.700"` or `color="gray.1100"` resolve to our brand
// values rather than the Chakra defaults.
// ---------------------------------------------------------------------------
const PALETTE_KEYS = [
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

const paletteTokens = Object.fromEntries(
  PALETTE_KEYS.map((key) => [key, toColorScale(colors[key] as Record<string | number, unknown>)]),
);

// ---------------------------------------------------------------------------
// The six brand gradients (.spec.md §1.1): `<name>.deep` / `.mid` (the
// 40%/62% stops as flat colours) and `<name>.gradient.full` / `.button`
// (stop lists, angle stays at the call site). Nested under each ramp name
// (rather than a separate top-level `gradient.*` namespace) so Chakra's
// `colorPalette` prop can address them — a section wrapper sets
// `colorPalette="figjam"` once and every descendant recipe referencing
// `colorPalette.gradient.button` picks it up (.spec.md §4.1's per-section
// primary fills).
// ---------------------------------------------------------------------------
const gradientTokenSets = buildGradientTokens();
const rampColorTokens = Object.fromEntries(
  Object.entries(gradientTokenSets).map(([name, { deep, mid, full, button, badgeGradient, criticalField }]) => [
    name,
    {
      deep: { value: deep },
      mid: { value: mid },
      badgeGradient: { value: badgeGradient },
      gradient: {
        full: { value: full },
        button: { value: button },
        critical: { value: criticalField },
      },
    },
  ]),
);

const colorTokens = {
  ...paletteTokens,
  ...rampColorTokens,

  // Scalar colours
  black: { value: colors.black as string },
  white: { value: colors.white as string },
  brand: { value: colors.brand as string },

  // Alpha ramps (already defined locally in colors.ts as plain objects)
  blackAlpha: toColorScale(colors.blackAlpha as Record<string | number, unknown>),
  whiteAlpha: toColorScale(colors.whiteAlpha as Record<string | number, unknown>),
};

// ---------------------------------------------------------------------------
// Semantic tokens — colour-mode-aware aliases
//
// `current.*` mirrors the old v2 `theme.colors.modes.{light,dark}` pattern.
// They flip automatically between the `base` (light) and `_dark` values when
// next-themes adds the `.dark` class to <html>.
// ---------------------------------------------------------------------------
const semanticColorTokens = {
  current: {
    // Backgrounds
    // gray.1100 is removed from the palette (.spec.md §2.1 step 5) — the
    // dark-mode ground is hardcoded here at its old value rather than being
    // a palette stop; picking a new one is a separate decision.
    bg: {
      value: {
        base: "{colors.white}",
        _dark: "#292929",
      },
    },
    background: {
      value: {
        base: "{colors.white}",
        _dark: "#292929",
      },
    },

    // Foreground text
    text: {
      value: {
        base: "{colors.black}",
        _dark: "{colors.whiteAlpha.900}",
      },
    },
    // Alias used in a few legacy call-sites
    textColor: {
      value: {
        base: "{colors.black}",
        _dark: "{colors.whiteAlpha.900}",
      },
    },
    textLight: {
      value: {
        base: "#717171",
        _dark: "#717171",
      },
    },

    // Brand / primary
    primary: {
      value: {
        base: "{colors.brand}",
        _dark: "{colors.brand}",
      },
    },

    // Borders
    border: {
      value: {
        base: "{colors.gray.300}",
        _dark: "{colors.whiteAlpha.300}",
      },
    },
    borderColor: {
      value: {
        base: "{colors.gray.300}",
        _dark: "{colors.whiteAlpha.300}",
      },
    },

    // Placeholder text
    placeholder: {
      value: {
        base: "{colors.gray.600}",
        _dark: "{colors.whiteAlpha.400}",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Legacy theme object
// Kept for the handful of non-Chakra consumers that call useTheme() and
// access colours / fontSizes / radii directly (CognitoForm style generator,
// Html prose renderer, DataCollection icon sizing, etc.).
// ---------------------------------------------------------------------------
export const Theme: Record<string, any> = {
  colors,
  fonts,
  fontSizes: defaultFontSizes,
  cognito: {
    id: "7hYXr3TPxk6yIpJxjqVoFQ",
  },
  config: {
    initialColorMode: "system",
    useSystemColorMode: true,
  },
};

// ---------------------------------------------------------------------------
// Chakra v3 system
// ---------------------------------------------------------------------------
const config = defineConfig({
  theme: {
    // Custom keyframes referenced by name in component `animation` props
    keyframes: {
      "skelly-load": {
        from: { backgroundPosition: "200% 0" },
        to: { backgroundPosition: "-200% 0" },
      },
    },

    tokens: {
      colors: colorTokens as any,

      // Restores the v2 `container.*` size namespace (removed in v3)
      sizes: {
        container: {
          sm: { value: "640px" },
          md: { value: "768px" },
          lg: { value: "1024px" },
          xl: { value: "1280px" },
        },
      },

      // Custom typefaces
      fonts: {
        body: { value: fonts.body },
        heading: { value: fonts.heading },
        accent: { value: fonts.accent },
        mono: { value: fonts.mono },
        logo: { value: fonts.logo },
      },
    },

    semanticTokens: {
      colors: semanticColorTokens,
    },

    recipes,
    slotRecipes,
  },

  // ---------------------------------------------------------------------------
  // Global CSS
  // Body background and text colour track the active colour mode via the
  // semantic tokens above, so the page flips correctly when next-themes
  // toggles the `.dark` class on <html>.
  // ---------------------------------------------------------------------------
  globalCss: {
    body: {
      bg: "current.bg",
      color: "current.text",
      lineHeight: "1.6",
      fontFamily: "body",
      transition: "background-color 0.3s",
    },
  },
});

export default createSystem(defaultConfig, config);
