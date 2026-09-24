import { defineRecipe } from "@chakra-ui/react";

import { SQUIRCLE_CORNER_SHAPE } from "../cornerShape";

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
      solid: {
        bg: "colorPalette.500",
        color: "colorPalette.900",
      },
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
      dot: {
        bg: "transparent",
        boxShadow: "inset 0 0 0 1px {colors.colorPalette.600}",
        color: "black",
      },
      squircle: {
        bg: "colorPalette.500",
        color: "black",
        borderRadius: "md",
        cornerShape: SQUIRCLE_CORNER_SHAPE,
        paddingInline: "3",
      },
    },
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
