import { defineSlotRecipe } from "@chakra-ui/react";

import { SQUIRCLE_CORNER_SHAPE } from "../cornerShape";

// Modal doesn't exist yet in Topo (the app uses
// react-responsive-modal directly); built here on Chakra v3's Dialog
// (v3's renamed Modal), following the same "heading in the field" rule as
// Card.
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
      // The heading-only field is short — never travels far enough toward
      // sand to need `gradient.critical`'s contrast cap, so the plain
      // 20%->62% two-stop compression (`gradient.modal`) is fine uncapped.
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
