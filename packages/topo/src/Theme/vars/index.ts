import { createSystem, defaultConfig, defineConfig, defineRecipe } from "@chakra-ui/react";

import { defaultFontSizes } from "../../utils";
import colors from "./colors";
import fonts from "./fonts";

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

const colorTokens = {
  ...paletteTokens,

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
    bg: {
      value: {
        base: "{colors.white}",
        _dark: "{colors.gray.1100}",
      },
    },
    background: {
      value: {
        base: "{colors.white}",
        _dark: "{colors.gray.1100}",
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
        base: "{colors.gray.200}",
        _dark: "{colors.whiteAlpha.300}",
      },
    },
    borderColor: {
      value: {
        base: "{colors.gray.200}",
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
// Link recipe override
// Chakra v3's default Link recipe forces color: "colorPalette.fg" on every
// variant, which overrides the inherited text colour. We reset it to
// "inherit" so a Link inside a coloured heading or button uses the same
// colour as its parent without any extra prop needed.
// ---------------------------------------------------------------------------
const linkRecipe = defineRecipe({
  // Put shared styles in base so they apply to all variants.
  base: {
    color: "inherit",
    // Always-visible underline at low opacity; brightens to full on hover.
    textDecoration: "underline",
    textUnderlineOffset: "3px",
    textDecorationColor: "currentColor/30",
    _hover: {
      textDecorationColor: "currentColor",
    },
  },
  variants: {
    variant: {
      // Override every property the default recipe sets so nothing leaks through.
      plain: {
        color: "inherit",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        textDecorationColor: "currentColor/30",
        _hover: {
          textDecoration: "underline",
          textDecorationColor: "currentColor",
        },
      },
      underline: {
        color: "inherit",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        textDecorationColor: "currentColor/30",
        _hover: {
          textDecorationColor: "currentColor",
        },
      },
    },
  },
});

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

    recipes: {
      link: linkRecipe,
    },
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
