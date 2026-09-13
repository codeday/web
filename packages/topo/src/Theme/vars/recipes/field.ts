import { defineSlotRecipe } from "@chakra-ui/react";

// .spec.md §4.4/§7 — carries the defaults `Atom/Form`'s old FormControl/
// FormLabel wrapper components applied via inline props
// (marginBottom/marginTop={4}, label fontWeight={600}) as a recipe instead,
// now that the v3 `Field` compound is exported directly. Label 13px/700,
// help 12.5px muted, error red.700/12.5px/600 (the only place a form uses
// a semantic hue) — .spec.md §4.4.
export const fieldSlotRecipe = defineSlotRecipe({
  slots: ["root", "errorText", "helperText", "input", "label", "select", "textarea", "requiredIndicator"],
  base: {
    root: {
      marginBlock: "4",
    },
    label: {
      fontSize: "13px",
      fontWeight: "700",
    },
    helperText: {
      fontSize: "12.5px",
      color: "current.textLight",
    },
    errorText: {
      color: "red.700",
      fontSize: "12.5px",
      fontWeight: "600",
    },
  },
});
