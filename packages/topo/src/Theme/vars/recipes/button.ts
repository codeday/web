import { defineRecipe } from "@chakra-ui/react";

import { SQUIRCLE_CORNER_SHAPE } from "../cornerShape";

// Button. `variant="primary"`/`"icon"` render the active
// `colorPalette`'s gradient (default Hibiscus; a section wrapper sets
// `colorPalette="figjam"` etc. to switch, per the per-section primary fills
// table — see `colors.<ramp>.gradient.button` in `../index.ts`).
export const buttonRecipe = defineRecipe({
  base: {
    fontWeight: "600",
    fontSize: "14.5px",
    lineHeight: "1",
    borderRadius: "lg",
    cornerShape: SQUIRCLE_CORNER_SHAPE,
    paddingInline: "17px",
    paddingBlock: "3",
    gap: "2",
    letterSpacing: "0",
    transitionProperty: "filter",
    transitionDuration: "fast",
    _hover: {
      filter: "brightness(.94)",
    },
    // Chakra's own default recipe sets `_disabled: { layerStyle: "disabled" }`,
    // which dims unconditionally — cancel it here so only our own,
    // loading-aware rule below controls disabled opacity.
    _disabled: {
      opacity: 1,
    },
    // Chakra's Button sets the native `disabled` attribute for BOTH the
    // loading and the truly-disabled state (`disabled: loading ||
    // rest.disabled`), so `_disabled` alone would dim both identically.
    // `data-loading` is set as `data-loading=""` (presence, not "true") only
    // for the loading state — excluding it keeps opacity .42 on disabled
    // alone (loading holds the ramp still, only disabled fades).
    "&:disabled:not([data-loading])": {
      opacity: 0.42,
      _hover: {
        filter: "none",
      },
    },
  },
  variants: {
    // Chakra's own default button recipe sets `h`/`minW`/`textStyle`/`px`/`gap`
    // under these same `variants.size.*` keys. Panda applies variant-level
    // styles after base regardless of which recipe object contributed them,
    // so leaving any of those untouched here lets the default's value win
    // over a base-level override of the same underlying property (this is
    // why every one of these needed restating here, not just in `base`).
    size: {
      sm: {
        fontSize: "sm",
        lineHeight: "1",
        paddingInline: "3.5",
        paddingBlock: "2",
        borderRadius: "lg",
        height: "auto",
        minWidth: "unset",
        textStyle: "unset",
      },
      md: {
        fontSize: "14.5px",
        lineHeight: "1",
        paddingInline: "17px",
        paddingBlock: "3",
        height: "auto",
        minWidth: "unset",
        textStyle: "unset",
      },
      lg: {
        fontSize: "md",
        lineHeight: "1",
        paddingInline: "6",
        paddingBlock: "3.5",
        borderRadius: "xl",
        height: "auto",
        minWidth: "unset",
        textStyle: "unset",
      },
    },
    variant: {
      primary: {
        color: "trueWhite",
        border: "none",
        backgroundImage: "linear-gradient(110deg, {colors.colorPalette.gradient.button})",
        position: "relative",
        overflow: "hidden",
      },
      // The square, gradient-filled icon-only form.
      icon: {
        color: "trueWhite",
        border: "none",
        backgroundImage: "linear-gradient(110deg, {colors.colorPalette.gradient.button})",
        borderRadius: "md",
        width: "10",
        height: "10",
        padding: "0",
        minWidth: "unset",
        position: "relative",
        overflow: "hidden",
      },
      secondary: {
        bg: "transparent",
        color: "{colors.colorPalette.600}",
        boxShadow: "inset 0 0 0 1.5px {colors.colorPalette.600}",
      },
      ghost: {
        bg: "transparent",
        color: "black",
        _hover: {
          bg: "colorPalette.200",
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
      // For an action sitting on a coloured ground (a `solid`/`critical`
      // Alert, the nav header's deep-field mode) — a gradient button
      // disappears against a flat or field background of the same family,
      // so these invert instead: solid white ground, label colour supplied
      // by the caller (e.g. `color="colorPalette.900"` or
      // `color="colorPalette.800"`, whichever token the ground itself
      // uses) since it varies by which palette/ramp the ground is drawn
      // from.
      onColor: {
        bg: "trueWhite",
        border: "none",
      },
      // The paired secondary/dismiss action beside `onColor` — always a
      // fixed white-on-white treatment, never colour-palette-dependent.
      onColorOutline: {
        bg: "transparent",
        color: "trueWhite",
        boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,.45)",
        _hover: {
          bg: "whiteAlpha.200",
          filter: "none",
        },
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
