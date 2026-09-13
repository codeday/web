import { defineSlotRecipe } from "@chakra-ui/react";

// .spec.md §4.2 — Chip (removable). Named Chip, not Tag — and namespaced
// (`topo-chip`, not a bare `.tag`) per the spec's own war story: a generic
// `.tag` class name collided with unrelated page styling and the remove
// button swallowed the label.
export const chipSlotRecipe = defineSlotRecipe({
  className: "topo-chip",
  slots: ["root", "label", "closeTrigger"],
  base: {
    root: {
      height: "28px",
      paddingInlineStart: "11px",
      paddingInlineEnd: "5px",
      borderRadius: "999px",
      bg: "transparent",
      boxShadow: "inset 0 0 0 1.5px {colors.current.border}",
      fontSize: "12.5px",
      fontWeight: "600",
      lineHeight: "1",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
    },
    closeTrigger: {
      width: "19px",
      height: "19px",
      borderRadius: "full",
      fontSize: "10px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      _hover: {
        bg: "gray.100",
      },
    },
  },
});
