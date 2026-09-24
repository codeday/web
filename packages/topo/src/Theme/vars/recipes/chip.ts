import { defineSlotRecipe } from "@chakra-ui/react";

export const chipSlotRecipe = defineSlotRecipe({
  className: "topo-chip",
  slots: ["root", "label", "closeTrigger"],
  base: {
    root: {
      height: "7",
      paddingInlineStart: "3",
      paddingInlineEnd: "1.5",
      borderRadius: "full",
      bg: "transparent",
      boxShadow: "inset 0 0 0 1.5px {colors.current.border}",
      fontSize: "xs",
      fontWeight: "600",
      lineHeight: "1",
      display: "inline-flex",
      alignItems: "center",
      gap: "1.5",
    },
    closeTrigger: {
      width: "5",
      height: "5",
      borderRadius: "full",
      fontSize: "2xs",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      _hover: {
        bg: "gray.100",
      },
    },
  },
});
