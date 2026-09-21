import { defineSlotRecipe } from "@chakra-ui/react";

// Chip (removable). Named Chip, not Tag — and namespaced
// (`topo-chip`, not a bare `.tag`) per the spec's own war story: a generic
// `.tag` class name collided with unrelated page styling and the remove
// button swallowed the label.
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
