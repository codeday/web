import { defineRecipe } from "@chakra-ui/react";

// ---------------------------------------------------------------------------
// Link recipe override
// Chakra v3's default Link recipe forces color: "colorPalette.fg" on every
// variant, which overrides the inherited text colour. We reset it to
// "inherit" so a Link inside a coloured heading or button uses the same
// colour as its parent without any extra prop needed.
// ---------------------------------------------------------------------------
export const linkRecipe = defineRecipe({
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
