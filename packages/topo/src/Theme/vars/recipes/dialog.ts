import { defineSlotRecipe } from "@chakra-ui/react";

// .spec.md §4.5 — Modal doesn't exist yet in Topo (the app uses
// react-responsive-modal directly); built here on Chakra v3's Dialog
// (v3's renamed Modal), following the same "heading in the field" rule as
// Card.
export const dialogSlotRecipe = defineSlotRecipe({
  slots: ["backdrop", "positioner", "content", "header", "body", "footer", "title", "description", "closeTrigger"],
  base: {
    content: {
      borderRadius: "14px",
      overflow: "hidden",
    },
    header: {
      minHeight: "76px",
      padding: "18px 16px",
      display: "flex",
      alignItems: "flex-end",
      position: "relative",
      backgroundImage: "linear-gradient(110deg, {colors.colorPalette.gradient.full})",
    },
    title: {
      color: "white",
      fontSize: "15.5px",
      fontWeight: "800",
      letterSpacing: "-0.015em",
      position: "relative",
      zIndex: "1",
    },
  },
});
