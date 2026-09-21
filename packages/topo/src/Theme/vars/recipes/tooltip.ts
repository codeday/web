import { defineSlotRecipe } from "@chakra-ui/react";

import { SQUIRCLE_CORNER_SHAPE } from "../cornerShape";

// Tooltip. Never a gradient.
export const tooltipSlotRecipe = defineSlotRecipe({
  slots: ["trigger", "arrow", "arrowTip", "positioner", "content"],
  base: {
    content: {
      bg: "gray.900",
      color: "white",
      fontSize: "xs",
      fontWeight: "600",
      borderRadius: "lg",
      cornerShape: SQUIRCLE_CORNER_SHAPE,
    },
    arrowTip: {
      bg: "gray.900",
    },
  },
});
