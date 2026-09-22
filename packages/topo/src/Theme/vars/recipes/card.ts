import { defineSlotRecipe } from "@chakra-ui/react";

import { SQUIRCLE_CORNER_SHAPE } from "../cornerShape";

// Card. The heading sits inside the gradient field; body
// and actions sit below it. A `plain` variant drops the field entirely for
// dense lists.
export const cardSlotRecipe = defineSlotRecipe({
  slots: ["root", "header", "body", "footer", "title", "description"],
  base: {
    root: {
      // A `.50` wash rather than the flat page `background` — gives the
      // card a surface subtly distinct from the page it sits on, in both
      // modes (mode-aware via the palette's own `_dark` condition, not a
      // fixed value).
      bg: "gray.50",
      borderRadius: "2xl",
      cornerShape: SQUIRCLE_CORNER_SHAPE,
      borderWidth: "1px",
      borderColor: "current.border",
      overflow: "hidden",
    },
    header: {
      minHeight: "20",
      padding: "{spacing.4.5} {spacing.4}",
      display: "flex",
      // Chakra's own default header sets flexDirection:"column" at this
      // same base level — without restating "row" here, alignItems:
      // "flex-end" controls the CROSS axis of a column flex (horizontal),
      // pushing the heading to the right instead of the bottom.
      flexDirection: "row",
      alignItems: "flex-end",
      position: "relative",
      // Capped at 6.36 ("content sitting inside a field") — the same
      // floor Alert's `critical` variant already uses correctly. The
      // uncapped full ramp puts white text on the sand end.
      backgroundImage: "linear-gradient(110deg, {colors.colorPalette.gradient.critical})",
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
      padding: "4",
    },
    footer: {
      padding: "0 {spacing.4} {spacing.4}",
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
