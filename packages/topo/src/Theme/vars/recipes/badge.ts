import { defineRecipe } from "@chakra-ui/react";

// .spec.md §4.2 — Badge. `solid`/`outline`/`dot` use `colorPalette` against
// a semantic hue (e.g. `colorPalette="green"`); `gradient`/`squircle` use it
// against a brand ramp (e.g. `colorPalette="hibiscus"`).
export const badgeRecipe = defineRecipe({
  base: {
    fontSize: "12px",
    fontWeight: "700",
    paddingInline: "10px",
    paddingBlock: "4px",
    borderRadius: "999px",
    letterSpacing: "0.01em",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  variants: {
    variant: {
      solid: {
        bg: "colorPalette.500",
        color: "black",
      },
      gradient: {
        backgroundImage: "linear-gradient(100deg, {colors.colorPalette.badgeGradient})",
        color: "white",
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
        color: "current.text",
      },
      // Same badge, the shape language's corner instead of a pill. A fixed
      // radius (rather than a true generated squircle mask) is a deliberate
      // simplification — badges are small/text-sized, so the visible
      // difference from a true superellipse is negligible at this scale.
      squircle: {
        bg: "colorPalette.500",
        color: "black",
        borderRadius: "8px",
      },
    },
    // The two-segment count form (.spec.md §4.2) — the count segment
    // stretches to full height; each segment gets its own inline padding
    // via the wrapper's markup.
    splitCount: {
      true: {
        paddingInline: "0",
        paddingBlock: "0",
        overflow: "hidden",
        alignItems: "stretch",
        height: "24px",
        gap: "0",
      },
    },
  },
  defaultVariants: {
    variant: "solid",
  },
});
