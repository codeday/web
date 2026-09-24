import { defineRecipe } from "@chakra-ui/react";

const TIGHT_LEADING = "1.08";

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
