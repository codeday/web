import { defineSlotRecipe } from "@chakra-ui/react";

import { SQUIRCLE_CORNER_SHAPE } from "../cornerShape";

export const dialogSlotRecipe = defineSlotRecipe({
  slots: [
    "backdrop",
    "positioner",
    "content",
    "header",
    "body",
    "footer",
    "title",
    "description",
    "closeTrigger",
  ],
  base: {
    content: {
      borderRadius: "2xl",
      cornerShape: SQUIRCLE_CORNER_SHAPE,
      overflow: "hidden",
    },
    header: {
      minHeight: "20",
      height: "auto",
      padding: "{spacing.4.5} {spacing.4}",
      display: "flex",
      alignItems: "flex-end",
      position: "relative",
      backgroundImage: "linear-gradient(110deg, {colors.colorPalette.gradient.modal})",
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
      padding: "{spacing.3.5} {spacing.4}",
      fontSize: "sm",
      color: "current.textLight",
    },
  },
});
