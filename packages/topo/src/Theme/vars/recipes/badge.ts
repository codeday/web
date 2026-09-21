import { defineRecipe } from "@chakra-ui/react";

import { SQUIRCLE_CORNER_SHAPE } from "../cornerShape";

// Badge. `solid`/`outline`/`dot` use `colorPalette` against
// a semantic hue (e.g. `colorPalette="green"`); `gradient`/`squircle` use it
// against a brand ramp (e.g. `colorPalette="hibiscus"`).
export const badgeRecipe = defineRecipe({
  base: {
    fontSize: "xs",
    fontWeight: "700",
    paddingInline: "3",
    paddingBlock: "1",
    borderRadius: "full",
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    gap: "1.5",
  },
  variants: {
    // Chakra's own default badge recipe sets `textStyle`/`px`/`minH` under
    // these same keys (default size is "sm") — restated here so a caller
    // that doesn't pass `size` (i.e. everyone, since Topo's Badge has no
    // size variants of its own) still gets the spec's fixed padding/font
    // size rather than Chakra's, which otherwise wins at the same
    // variant-level cascade priority (see button.ts for the full story).
    size: {
      xs: {
        textStyle: "unset",
        fontSize: "xs",
        paddingInline: "3",
        paddingBlock: "1",
        minHeight: "unset",
      },
      sm: {
        textStyle: "unset",
        fontSize: "xs",
        paddingInline: "3",
        paddingBlock: "1",
        minHeight: "unset",
      },
      md: {
        textStyle: "unset",
        fontSize: "xs",
        paddingInline: "3",
        paddingBlock: "1",
        minHeight: "unset",
      },
      lg: {
        textStyle: "unset",
        fontSize: "xs",
        paddingInline: "3",
        paddingBlock: "1",
        minHeight: "unset",
      },
    },
    variant: {
      // The stop contract: 500 is a light fill, taking the SAME hue's 900
      // stop as its label (near-black, but hue-tinted) rather than flat
      // black — the "state badge" pattern in a feed row,
      // e.g. `orange.500` ground / `orange.900` label for "Blocker".
      solid: {
        bg: "colorPalette.500",
        color: "colorPalette.900",
      },
      // The other half of that same stop contract: 600 is a dark fill,
      // taking white — the "event badge" pattern, e.g.
      // `indigo.600` ground / white label for "Standup".
      solidDark: {
        bg: "colorPalette.600",
        color: "white",
      },
      gradient: {
        backgroundImage: "linear-gradient(100deg, {colors.colorPalette.badgeGradient})",
        color: "trueWhite",
        position: "relative",
        overflow: "hidden",
      },
      outline: {
        bg: "transparent",
        boxShadow: "inset 0 0 0 1px {colors.colorPalette.600}",
        color: "colorPalette.700",
      },
      // No background tint — the only colour is the dot itself, rendered
      // by the wrapper component (a plain recipe can't add a child node).
      dot: {
        bg: "transparent",
        boxShadow: "inset 0 0 0 1px {colors.colorPalette.600}",
        color: "black",
      },
      // Same badge, the shape language's corner instead of a pill — native
      // CSS `corner-shape` on top of a plain border-radius (Chromium-only;
      // other browsers just see the border-radius arc).
      squircle: {
        bg: "colorPalette.500",
        color: "black",
        borderRadius: "md",
        cornerShape: SQUIRCLE_CORNER_SHAPE,
        paddingInline: "3",
      },
    },
    // The two-segment count form — the count segment
    // stretches to full height; each segment gets its own inline padding
    // via the wrapper's markup.
    splitCount: {
      true: {
        paddingInline: "0",
        paddingBlock: "0",
        overflow: "hidden",
        alignItems: "stretch",
        height: "6",
        gap: "0",
      },
    },
  },
  defaultVariants: {
    variant: "solid",
  },
});
