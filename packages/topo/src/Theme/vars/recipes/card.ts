import { defineSlotRecipe } from "@chakra-ui/react";

// .spec.md §4.5 — Card. The heading sits inside the gradient field; body
// and actions sit below it. A `plain` variant drops the field entirely for
// dense lists.
export const cardSlotRecipe = defineSlotRecipe({
  slots: ["root", "header", "body", "footer", "title", "description"],
  base: {
    root: {
      borderRadius: "14px",
      borderWidth: "1px",
      borderColor: "current.border",
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
    body: {
      padding: "16px",
    },
    footer: {
      padding: "0 16px 16px",
      display: "flex",
      alignItems: "center",
      gap: "2",
    },
  },
  variants: {
    // No field — for dense lists.
    variant: {
      plain: {
        header: {
          display: "none",
        },
      },
    },
  },
});
