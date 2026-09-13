import { defineSlotRecipe } from "@chakra-ui/react";

// .spec.md §4.2 — Alert. Four variants, none generic. `colorPalette` picks
// the ramp (default set by the wrapper component, see `../../../Atom/Alert`).
export const alertSlotRecipe = defineSlotRecipe({
  slots: ["root", "title", "description", "indicator", "content"],
  base: {
    root: {
      display: "flex",
      gap: "11px",
      padding: "13px 15px",
      borderRadius: "11px",
      fontSize: "14px",
      alignItems: "flex-start",
    },
    // The icon gets the critical-full-field treatment (no background
    // gradient of its own) rather than reading as a second coloured square
    // inside a coloured box.
    indicator: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      width: "1.2em",
      height: "1.2em",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      flex: "1",
      gap: "1",
    },
  },
  variants: {
    variant: {
      // The quietest form — a hairline top rule instead of a filled
      // background, borrowing the section-rule device (.spec.md §4.9).
      hairline: {
        root: {
          bg: "transparent",
          borderTop: "1px solid {colors.colorPalette.600}",
          borderRadius: "0",
          paddingTop: "15px",
          color: "current.text",
        },
        indicator: {
          color: "{colors.colorPalette.600}",
        },
      },
      // Critical's layout, on a flat colour — no gradient.
      solid: {
        root: {
          bg: "{colors.colorPalette.600}",
          color: "white",
        },
        indicator: {
          color: "white",
        },
      },
      // A gradient rail down the leading edge, stopping at the 62% stop —
      // it never reaches sand. Built from the ramp's own 20%/40%/62% stops
      // directly (rather than the full 6-stop ramp) so it never travels
      // past the midpoint.
      rail: {
        root: {
          bg: "current.bg",
          color: "current.text",
          borderInlineStart: "4px solid {colors.colorPalette.mid}",
          backgroundImage:
            "linear-gradient(to right, {colors.colorPalette.deep}/6, transparent 4px)",
        },
        indicator: {
          color: "{colors.colorPalette.600}",
        },
      },
      // The only alert that takes a full field — capped at 6.36 (.spec.md
      // §1.2's "content sitting inside a field" floor) so white text stays
      // legible even where the field runs toward the light end.
      critical: {
        root: {
          backgroundImage: "linear-gradient(110deg, {colors.colorPalette.gradient.critical})",
          color: "white",
        },
        indicator: {
          color: "white",
        },
      },
    },
  },
  defaultVariants: {
    variant: "hairline",
  },
});
