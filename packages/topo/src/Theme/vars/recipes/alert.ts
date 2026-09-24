import { defineSlotRecipe } from "@chakra-ui/react";

import { SQUIRCLE_CORNER_SHAPE } from "../cornerShape";

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
      rail: {
        root: {
          bg: "current.bg",
          color: "black",
          position: "relative",
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
