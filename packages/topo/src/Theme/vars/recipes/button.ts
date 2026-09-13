import { defineRecipe } from "@chakra-ui/react";

// .spec.md §4.1 — Button. `variant="primary"`/`"icon"` render the active
// `colorPalette`'s gradient (default Hibiscus; a section wrapper sets
// `colorPalette="figjam"` etc. to switch, per the per-section primary fills
// table — see `colors.<ramp>.gradient.button` in `../index.ts`).
export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: "600",
    fontSize: "14.5px",
    lineHeight: "1",
    borderRadius: "9px",
    paddingInline: "17px",
    paddingBlock: "11px",
    gap: "8px",
    letterSpacing: "0",
    transitionProperty: "filter",
    transitionDuration: "0.15s",
    _hover: {
      filter: "brightness(.94)",
    },
    _disabled: {
      opacity: 0.42,
      _hover: {
        filter: "none",
      },
    },
  },
  variants: {
    size: {
      sm: {
        fontSize: "13px",
        paddingInline: "13px",
        paddingBlock: "8px",
        borderRadius: "7px",
      },
      md: {},
      lg: {
        fontSize: "16px",
        paddingInline: "22px",
        paddingBlock: "14px",
        borderRadius: "11px",
      },
    },
    variant: {
      primary: {
        color: "white",
        border: "none",
        backgroundImage: "linear-gradient(110deg, {colors.colorPalette.gradient.button})",
      },
      // The square, gradient-filled icon-only form (.spec.md §4.1).
      icon: {
        color: "white",
        border: "none",
        backgroundImage: "linear-gradient(110deg, {colors.colorPalette.gradient.button})",
        borderRadius: "26%",
        width: "40px",
        height: "40px",
        padding: "0",
        minWidth: "unset",
      },
      secondary: {
        bg: "transparent",
        color: "{colors.colorPalette.mid}",
        boxShadow: "inset 0 0 0 1.5px {colors.colorPalette.mid}",
      },
      ghost: {
        bg: "transparent",
        color: "current.text",
        _hover: {
          bg: "{colors.colorPalette.mid/9}",
          filter: "none",
        },
      },
      // Outlined, not solid — a collision fix as much as convention: a
      // solid red button beside a solid Hibiscus primary is hard to tell
      // apart at a glance (Hibiscus is a rose-maroon). Outlining separates
      // them by form, and a destructive action can never read as a
      // decorative gradient button.
      danger: {
        bg: "transparent",
        color: "red.700",
        boxShadow: "inset 0 0 0 1.5px {colors.red.600}",
        _hover: {
          bg: "red.100",
          filter: "none",
        },
      },
      // Confirmation dialogs only — see danger's note above.
      dangerSolid: {
        bg: "red.600",
        color: "white",
        border: "none",
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
