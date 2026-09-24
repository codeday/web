import { defineRecipe } from "@chakra-ui/react";

import { SQUIRCLE_CORNER_SHAPE } from "../cornerShape";

export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: "600",
    fontSize: "14.5px",
    lineHeight: "1",
    borderRadius: "lg",
    cornerShape: SQUIRCLE_CORNER_SHAPE,
    paddingInline: "17px",
    paddingBlock: "3",
    gap: "2",
    letterSpacing: "0",
    transitionProperty: "filter",
    transitionDuration: "fast",
    _hover: {
      filter: "brightness(.94)",
    },
    _disabled: {
      opacity: 1,
    },
    "&:disabled:not([data-loading])": {
      opacity: 0.42,
      _hover: {
        filter: "none",
      },
    },
  },
  variants: {
    // Chakra's own default button recipe sets `h`/`minW`/`textStyle`/`px`/`gap`
    // under these same `variants.size.*` keys. Panda applies variant-level
    // styles after base regardless of which recipe object contributed them,
    // so leaving any of those untouched here lets the default's value win
    // over a base-level override of the same underlying property (this is
    // why every one of these needed restating here, not just in `base`).
    size: {
      sm: {
        fontSize: "sm",
        lineHeight: "1",
        paddingInline: "3.5",
        paddingBlock: "2",
        borderRadius: "lg",
        height: "auto",
        minWidth: "unset",
        textStyle: "unset",
      },
      md: {
        fontSize: "14.5px",
        lineHeight: "1",
        paddingInline: "17px",
        paddingBlock: "3",
        height: "auto",
        minWidth: "unset",
        textStyle: "unset",
      },
      lg: {
        fontSize: "md",
        lineHeight: "1",
        paddingInline: "6",
        paddingBlock: "3.5",
        borderRadius: "xl",
        height: "auto",
        minWidth: "unset",
        textStyle: "unset",
      },
    },
    variant: {
      primary: {
        color: "trueWhite",
        border: "none",
        backgroundImage: "linear-gradient(110deg, {colors.colorPalette.gradient.button})",
        position: "relative",
        overflow: "hidden",
      },
      icon: {
        color: "trueWhite",
        border: "none",
        backgroundImage: "linear-gradient(110deg, {colors.colorPalette.gradient.button})",
        borderRadius: "md",
        width: "10",
        height: "10",
        padding: "0",
        minWidth: "unset",
        position: "relative",
        overflow: "hidden",
      },
      secondary: {
        bg: "transparent",
        color: "{colors.colorPalette.600}",
        boxShadow: "inset 0 0 0 1.5px {colors.colorPalette.600}",
      },
      ghost: {
        bg: "transparent",
        color: "black",
        _hover: {
          bg: "colorPalette.200",
          filter: "none",
        },
      },
      danger: {
        bg: "transparent",
        color: "red.700",
        boxShadow: "inset 0 0 0 1.5px {colors.red.600}",
        _hover: {
          bg: "red.100",
          filter: "none",
        },
      },
      dangerSolid: {
        bg: "red.600",
        color: "white",
        border: "none",
      },
      onColor: {
        bg: "trueWhite",
        border: "none",
      },
      onColorOutline: {
        bg: "transparent",
        color: "trueWhite",
        boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.45)",
        _hover: {
          bg: "whiteAlpha.200",
          filter: "none",
        },
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
