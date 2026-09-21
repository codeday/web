import { defineSlotRecipe } from "@chakra-ui/react";

import { SQUIRCLE_CORNER_SHAPE } from "../cornerShape";

// Alert. Four variants, none generic. `colorPalette` picks
// the ramp (default set by the wrapper component, see `../../../Atom/Alert`).
export const alertSlotRecipe = defineSlotRecipe({
  slots: ["root", "title", "description", "indicator", "content"],
  base: {
    root: {
      display: "flex",
      gap: "3.5",
      paddingInline: "4.5",
      paddingBlock: "4",
      borderRadius: "xl",
      cornerShape: SQUIRCLE_CORNER_SHAPE,
      fontSize: "sm",
      lineHeight: "short",
      alignItems: "flex-start",
    },
    // The icon gets the critical-full-field treatment (no background
    // gradient of its own) rather than reading as a second coloured square
    // inside a coloured box.
    indicator: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      width: "4",
      height: "4",
      lineHeight: "shorter",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      flex: "1",
      gap: "1",
    },
    title: {
      fontSize: "md",
      fontWeight: "800",
    },
    description: {
      fontSize: "sm",
    },
  },
  variants: {
    // Chakra's own default alert recipe sets `px`/`py`/`gap`/`textStyle`
    // under `variants.size.*` (default size is "md"). Panda merges every
    // matching variant's styles into ONE compiled CSS rule per class, and
    // for two DIFFERENT property names that both affect padding (my
    // `padding` shorthand vs. their `px`/`py`, which expand to
    // `padding-inline`/`padding-block`), whichever is serialized LATER in
    // that one rule wins — not simply "later-registered recipe wins".
    // Empirically, `size` styles serialize after `variant` styles, and
    // longhand beats an earlier shorthand for the same box side. Matching
    // Chakra's own longhand property names here, at the same `size` stage,
    // is what actually overrides it (a `padding` shorthand restated at
    // `variant` level, tried first, did not).
    size: {
      sm: {
        root: { paddingInline: "4.5", paddingBlock: "4", fontSize: "sm", lineHeight: "short" },
      },
      md: {
        root: { paddingInline: "4.5", paddingBlock: "4", fontSize: "sm", lineHeight: "short" },
      },
      lg: {
        root: { paddingInline: "4.5", paddingBlock: "4", fontSize: "sm", lineHeight: "short" },
      },
    },
    variant: {
      // The quietest form — a hairline top rule instead of a filled
      // background, borrowing the section-rule device.
      hairline: {
        root: {
          bg: "transparent",
          borderTop: "{borders.sm} {colors.colorPalette.600}",
          borderRadius: "0",
          paddingBlockStart: "4",
          color: "black",
        },
        indicator: {
          color: "{colors.colorPalette.600}",
        },
      },
      // Critical's layout, on a flat colour — no gradient. Ground is a
      // semantic 700 stop (e.g. `orange.700` = `#713400`), not the 600 stop
      // `rail`'s indicator/`hairline`'s rule use — 700 is the deeper of the
      // two dark-fill/white-text stops, and reads as "grounded" rather than
      // "accented" the way 600 does elsewhere in this recipe.
      solid: {
        root: {
          bg: "{colors.colorPalette.700}",
          color: "white",
        },
        indicator: {
          color: "white",
        },
        description: {
          color: "rgba(255,255,255,.84)",
        },
      },
      // A gradient rail down the leading edge, stopping at the 62% stop —
      // it never reaches sand. A real vertical gradient strip (the ramp's
      // own 0/20/40/62% stops, rescaled — `gradient.rail`), not a flat
      // border in the ramp's mid colour.
      rail: {
        root: {
          bg: "current.bg",
          color: "black",
          position: "relative",
          // base paddingInline (18px) + the 4px accent bar's own width.
          paddingInlineStart: "calc({spacing.4.5} + {spacing.1})",
          "&::before": {
            content: '""',
            position: "absolute",
            insetBlock: 0,
            insetInlineStart: 0,
            width: "1",
            backgroundImage: "linear-gradient(180deg, {colors.colorPalette.gradient.rail})",
          },
        },
        indicator: {
          color: "{colors.colorPalette.600}",
        },
      },
      // The only alert that takes a full field — capped at 6.36 (the
      // "content sitting inside a field" floor) so white text stays
      // legible even where the field runs toward the light end.
      critical: {
        root: {
          backgroundImage: "linear-gradient(112deg, {colors.colorPalette.gradient.critical})",
          color: "trueWhite",
          position: "relative",
          overflow: "hidden",
        },
        indicator: {
          color: "trueWhite",
        },
        description: {
          color: "rgba(255,255,255,.82)",
        },
      },
    },
  },
  defaultVariants: {
    variant: "hairline",
  },
});
