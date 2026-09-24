import { defineSlotRecipe } from "@chakra-ui/react";

export const fieldSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "errorText",
    "helperText",
    "input",
    "label",
    "select",
    "textarea",
    "requiredIndicator",
  ],
  base: {
    root: {
      marginBlock: "4",
    },
    label: {
      fontSize: "sm",
      fontWeight: "700",
    },
    helperText: {
      fontSize: "xs",
      color: "current.textLight",
    },
    errorText: {
      color: "red.700",
      fontSize: "xs",
      fontWeight: "600",
    },
  },
});
