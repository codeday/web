import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

import { defaultFontSizes } from "../../utils";
import colors, { type GradientName, rampScaleStops } from "./colors";
import darkColors from "./darkColors";
import fonts from "./fonts";
import { buildGradientTokens } from "./gradients";
import { recipes, slotRecipes } from "./recipes";

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

const SEMANTIC_HUES: Record<string, Record<string, string>> = {
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
const MODE_AWARE_PALETTES: Record<string, Record<string, string>> = {
  ...SEMANTIC_HUES,
  ...rampScaleStops,
};
const darkModePaletteTokens = Object.fromEntries(
  Object.entries(MODE_AWARE_PALETTES).map(([key, lightStops]) => [
    key,
    Object.fromEntries(
      Object.entries(lightStops).map(([stop, lightHex]) => [
        stop,
        {
          value: {
            base: lightHex,
            _dark: (darkColors as Record<string, Record<string, string>>)[key][stop],
          },
        },
      ]),
    ),
  ]),
);

const gradientTokenSets = buildGradientTokens();
const rampColorTokens = Object.fromEntries(
  Object.entries(gradientTokenSets).map(
    ([name, { full, button, badgeGradient, criticalField, emptyState, rail, modal }]) => [
      name,
      {
        badgeGradient: { value: badgeGradient },
        gradient: {
          full: { value: full },
          button: { value: button },
          critical: { value: criticalField },
          emptyState: { value: emptyState },
          rail: { value: rail },
          modal: { value: modal },
        },
        true: toColorScale(
          rampScaleStops[name as GradientName] as Record<string | number, unknown>,
        ),
      },
    ],
  ),
);

const colorTokens = {
  ...rampColorTokens,

  brand: { value: colors.brand as string },

  trueBlack: { value: colors.black as string },
  trueWhite: { value: colors.white as string },

  ...Object.fromEntries(
    Object.entries(SEMANTIC_HUES).map(([key, stops]) => [
      key,
      { true: toColorScale(stops as Record<string | number, unknown>) },
    ]),
  ),

  blackAlpha: toColorScale(colors.blackAlpha as Record<string | number, unknown>),
  whiteAlpha: toColorScale(colors.whiteAlpha as Record<string | number, unknown>),
};

const semanticColorTokens = {
  ...darkModePaletteTokens,

  black: {
    value: {
      base: colors.black as string,
      _dark: "{colors.whiteAlpha.900}",
    },
  },
  white: {
    value: {
      base: colors.white as string,
      _dark: "#1E1119",
    },
  },

  status: {
    open: { value: { base: "{colors.teal.600}", _dark: "{colors.teal.500}" } },
    interest: { value: { base: "{colors.gray.500}", _dark: "#B8A7A1" } },
  },

  current: {
    bg: { value: "{colors.white}" },
    background: { value: "{colors.white}" },

    text: { value: "{colors.black}" },
    textColor: { value: "{colors.black}" },
    textLight: {
      value: {
        base: "{colors.gray.600}",
        _dark: "{colors.whiteAlpha.600}",
      },
    },

    primary: {
      value: {
        base: "{colors.brand}",
        _dark: "{colors.brand}",
      },
    },

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

    placeholder: {
      value: {
        base: "{colors.gray.600}",
        _dark: "{colors.whiteAlpha.400}",
      },
    },
  },

  // ---------------------------------------------------------------------------
  // Chakra's OWN built-in semantic tokens (`bg.*`/`fg.*`/`border.*` and the
  // per-hue `<hue>.fg/subtle/muted/emphasized/solid/focusRing/border/
  // contrast` groups shipped in `@chakra-ui/react`'s `defaultConfig`)
  // reference raw numbered stops like `gray.50`/`red.700`, expecting
  // Chakra's OWN native monotonic light-to-dark scale. Our semantic palette
  // repurposes those same stop numbers under a completely different,
  // role-based contract (`colors.ts`'s "stop contract") — now that every
  // hue covers the full 50-900 range, Chakra's own defaults silently
  // resolve to the WRONG role. E.g. its `fg.DEFAULT` dark value references
  // `{colors.gray.50}` expecting a near-white, readable text colour, but
  // our `gray.50` is a bg-anchored wash deliberately close to the page
  // background. Anything that falls through to a Chakra-default recipe
  // instead of one of our own fully-specified recipes (`Atom/Card`'s
  // `body`/`root` slots, for instance, which never set their own `color`)
  // silently inherits an unreadable colour as a result — see the Card dark
  // mode contrast bug this was written to fix.
  //
  // `createSystem(defaultConfig, config)` deep-merges configs (see
  // `styled-system/merge-config.js`'s recursive `mergeWith`), so a plain
  // `{ value: "..." }` string here cleanly *replaces* Chakra's own
  // `{ value: { _light, _dark } }` object at the same key (the merge falls
  // through to `Object.assign` once one side isn't an object) rather than
  // partially merging alongside it. Every value below is a single
  // reference into our own already mode-aware tokens, so it resolves
  // correctly in both modes without needing an explicit `_light`/`_dark`
  // split here.
  // ---------------------------------------------------------------------------
  bg: {
    DEFAULT: { value: "{colors.white}" },
    subtle: { value: "{colors.gray.50}" },
    muted: { value: "{colors.gray.100}" },
    emphasized: { value: "{colors.gray.200}" },
    inverted: { value: "{colors.black}" },
    panel: { value: "{colors.white}" },
    error: { value: "{colors.red.100}" },
    warning: { value: "{colors.orange.100}" },
    success: { value: "{colors.green.100}" },
    info: { value: "{colors.blue.100}" },
  },
  fg: {
    DEFAULT: { value: "{colors.black}" },
    muted: { value: "{colors.gray.600}" },
    subtle: { value: "{colors.gray.500}" },
    inverted: { value: "{colors.white}" },
    error: { value: "{colors.red.700}" },
    warning: { value: "{colors.orange.700}" },
    success: { value: "{colors.green.700}" },
    info: { value: "{colors.blue.700}" },
  },
  border: {
    DEFAULT: { value: { _light: "{colors.gray.300}", _dark: "{colors.whiteAlpha.300}" } },
    muted: { value: { _light: "{colors.gray.100}", _dark: "{colors.whiteAlpha.100}" } },
    subtle: { value: { _light: "{colors.gray.50}", _dark: "{colors.whiteAlpha.50}" } },
    emphasized: { value: { _light: "{colors.gray.400}", _dark: "{colors.whiteAlpha.400}" } },
    inverted: { value: { _light: "{colors.whiteAlpha.400}", _dark: "{colors.gray.300}" } },
    error: { value: "{colors.red.500}" },
    warning: { value: "{colors.orange.500}" },
    success: { value: "{colors.green.500}" },
    info: { value: "{colors.blue.500}" },
  },

  // Per-family groups (`colorPalette.fg`/`.subtle`/etc, and the bare
  // `gray.fg`/`red.solid`/etc paths Chakra's own defaults use directly) —
  // for every family, the eleven semantic hues *and* the six brand ramps
  // alike, so a `colorPalette` can be set to any of the seventeen and
  // behave identically. (For the ten hues Chakra also ships, this doubles
  // as the override of Chakra's own stock group, which references its own
  // stop roles.) One consistent formula across all of them: `.600` is
  // every family's "dark fill / white text" stop (verified by
  // `colors.test.ts` for hues and ramps alike) — it also
  // role-inverts to a *light* fill in dark mode, so `contrast`'s text must
  // invert right along with it, which is exactly what our own
  // self-inverting `white` token already does (light mode: white; dark
  // mode: `#1E1119`, i.e. dark-ish — the correct polarity for text sitting
  // on a fill that just flipped from dark-under-white-text to
  // light-under-black-text).
  //
  // Spread *into* each hue's existing mode-aware `50`-`900` stops (registered
  // via `darkModePaletteTokens` above) rather than as a fresh object: this is
  // a top-level spread onto the same `gray`/`red`/... key, so a bare object
  // literal here would replace the numbered stops wholesale, and those hues
  // would silently fall back to Chakra's own flat stock scale in both modes.
  ...Object.fromEntries(
    Object.keys(MODE_AWARE_PALETTES).map((hue) => [
      hue,
      {
        ...darkModePaletteTokens[hue],
        contrast: { value: "{colors.white}" },
        fg: { value: `{colors.${hue}.700}` },
        subtle: { value: `{colors.${hue}.100}` },
        muted: { value: `{colors.${hue}.200}` },
        emphasized: { value: `{colors.${hue}.300}` },
        solid: { value: `{colors.${hue}.600}` },
        focusRing: { value: `{colors.${hue}.500}` },
        border: { value: `{colors.${hue}.500}` },
      },
    ]),
  ),
};

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

const config = defineConfig({
  theme: {
    // Custom keyframes referenced by name in component `animation` props.
    // Must be registered here, not declared inline in a component's own
    // `css` prop — Chakra v3 only emits a real `@keyframes` rule for names
    // it knows about via this theme config, so an ad hoc
    // `css={{ "@keyframes foo": {...} }}` silently produces no rule at all:
    // `animation-name` ends up pointing at a keyframes list that doesn't
    // exist, which still registers as a "running" Animation (its timeline
    // ticks normally) but animates nothing, since there's no effect to
    // interpolate.
    keyframes: {
      "skelly-load": {
        from: { backgroundPosition: "200% 0" },
        to: { backgroundPosition: "-200% 0" },
      },
    },

    tokens: {
      colors: colorTokens as any,

      sizes: {
        container: {
          sm: { value: "640px" },
          md: { value: "768px" },
          lg: { value: "1024px" },
          xl: { value: "1280px" },
        },
      },

      fonts: {
        body: { value: fonts.body },
        heading: { value: fonts.heading },
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

  globalCss: {
    html: {
      bg: "current.bg",
    },
    body: {
      bg: "current.bg",
      color: "black",
      lineHeight: "1.6",
      fontFamily: "body",
      transition: "background-color 0.3s",
    },
  },
});

const stockColors = (defaultConfig.theme?.tokens?.colors ?? {}) as Record<string, unknown>;
const stockColorsWithout950 = Object.fromEntries(
  Object.entries(stockColors).map(([hue, scale]) => {
    if (!(hue in SEMANTIC_HUES) || typeof scale !== "object" || scale === null) {
      return [hue, scale];
    }
    const trimmed: Record<string, unknown> = { ...scale };
    delete trimmed[950];
    return [hue, trimmed];
  }),
) as typeof stockColors;

export default createSystem(
  {
    ...defaultConfig,
    theme: {
      ...defaultConfig.theme,
      tokens: { ...defaultConfig.theme?.tokens, colors: stockColorsWithout950 },
    },
  } as typeof defaultConfig,
  config,
);
