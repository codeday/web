import { defineSlotRecipe } from "@chakra-ui/react";

// .spec.md §4.5 — Tooltip. Never a gradient.
export const tooltipSlotRecipe = defineSlotRecipe({
  slots: ["trigger", "arrow", "arrowTip", "positioner", "content"],
  base: {
    content: {
      bg: "gray.900",
      color: "white",
      fontSize: "12.5px",
      fontWeight: "600",
      borderRadius: "8px",
    },
    arrowTip: {
      bg: "gray.900",
    },
  },
});
