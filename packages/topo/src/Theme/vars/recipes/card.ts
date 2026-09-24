import { defineSlotRecipe } from "@chakra-ui/react";

import { SQUIRCLE_CORNER_SHAPE } from "../cornerShape";

export const cardSlotRecipe = defineSlotRecipe({
  slots: ["root", "header", "body", "footer", "title", "description"],
  base: {
    root: {
      bg: "gray.50",
      borderRadius: "2xl",
      cornerShape: SQUIRCLE_CORNER_SHAPE,
      borderWidth: "1px",
      borderColor: "current.border",
      overflow: "hidden",
    },
    header: {
      minHeight: "20",
      padding: "{spacing.4.5} {spacing.4}",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-end",
      position: "relative",
      backgroundImage: "linear-gradient(110deg, {colors.colorPalette.gradient.critical})",
    },
    title: {
      color: "trueWhite",
      fontSize: "md",
      fontWeight: "800",
      letterSpacing: "tight",
      position: "relative",
      zIndex: "1",
    },
    body: {
      padding: "4",
    },
    footer: {
      padding: "0 {spacing.4} {spacing.4}",
      display: "flex",
      alignItems: "center",
      gap: "2",
    },
  },
  variants: {
    variant: {
      plain: {
        header: {
          display: "none",
        },
      },
    },
  },
});
