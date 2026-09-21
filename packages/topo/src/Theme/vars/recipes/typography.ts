import { defineRecipe } from "@chakra-ui/react";

// Display leading for every heading size. Chakra's default `size` variants
// each pull in a fixed-rem `lineHeight` via `textStyle`, which only matches
// their paired default `fontSize` — any call site that overrides `fontSize`
// directly (e.g. a fluid `clamp()` for a hero/section statement) keeps that
// fixed rem value, so the leading no longer scales with the actual rendered
// size. A unitless line-height recomputes from whatever font-size is
// actually in effect, so it stays right even under a `fontSize` override.
// This needs to live on each `size` variant, not `base`: a variant's
// `textStyle` is merged in after base and would otherwise win.
const TIGHT_LEADING = "1.08";

// Headline tracking goes to 0. Chakra's default `textStyle`
// tokens for large sizes carry -0.025em letter-spacing; the old look's
// coldness came from Black weight at tight tracking, not the typeface, so
// this is reset at the recipe level rather than per call site.
export const headingRecipe = defineRecipe({
  base: {
    letterSpacing: "0",
  },
  variants: {
    size: {
      xs: { lineHeight: TIGHT_LEADING },
      sm: { lineHeight: TIGHT_LEADING },
      md: { lineHeight: TIGHT_LEADING },
      lg: { lineHeight: TIGHT_LEADING },
      xl: { lineHeight: TIGHT_LEADING },
      "2xl": { lineHeight: TIGHT_LEADING },
      "3xl": { lineHeight: TIGHT_LEADING },
      "4xl": { lineHeight: TIGHT_LEADING },
      "5xl": { lineHeight: TIGHT_LEADING },
      "6xl": { lineHeight: TIGHT_LEADING },
      "7xl": { lineHeight: TIGHT_LEADING },
    },
  },
});
