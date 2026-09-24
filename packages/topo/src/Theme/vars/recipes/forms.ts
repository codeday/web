import { defineRecipe, defineSlotRecipe } from "@chakra-ui/react";

import { SQUIRCLE_CORNER_SHAPE } from "../cornerShape";

const focusRing = {
  borderColor: "{colors.colorPalette.600}",
  boxShadow: "0 0 0 3px {colors.colorPalette.300}",
  outline: "0",
};

const controlBase = {
  fontSize: "14.5px",
  paddingInline: "3",
  paddingBlock: "2.5",
  borderRadius: "lg",
  cornerShape: SQUIRCLE_CORNER_SHAPE,
  borderWidth: "1.5px",
  borderColor: "current.border",
  _focusVisible: focusRing,
  _invalid: {
    borderColor: "red.600",
  },
};

// Chakra's own default input/textarea recipes set `px`/`textStyle`/
// `--input-height` under `variants.size.*` (default "md"), and `borderWidth`/
// `borderColor`/`focusRingColor` under `variants.variant.*` (default
// "outline") — both stages apply AFTER `base` in the one compiled CSS rule
// Panda produces per class, so a base-level override alone loses (see
// alert.ts for the full story of how this was diagnosed). Restating the
// conflicting properties at the SAME variant paths, with matching longhand
// property names, is what actually wins.
const sizeOverride = {
  // `textStyle` (Chakra's own default `size.*` sets it) is a composite
  // token that Panda expands into fontSize/lineHeight/etc as a final pass —
  // it wins over an explicit fontSize even when ours is merged in later, so
  // it has to be neutralized directly, not just have its outputs restated.
  textStyle: "none",
  fontSize: "14.5px",
  lineHeight: "short",
  paddingInline: "3",
  paddingBlock: "2.5",
  height: "auto",
};
const variantOverride = {
  borderWidth: "1.5px",
  borderColor: "current.border",
  _focusVisible: focusRing,
};

const controlVariants = {
  size: {
    "2xs": sizeOverride,
    xs: sizeOverride,
    sm: sizeOverride,
    md: sizeOverride,
    lg: sizeOverride,
    xl: sizeOverride,
    "2xl": sizeOverride,
  },
  variant: {
    outline: variantOverride,
    subtle: variantOverride,
    flushed: variantOverride,
  },
};

export const inputRecipe = defineRecipe({ base: controlBase, variants: controlVariants });
export const textareaRecipe = defineRecipe({ base: controlBase, variants: controlVariants });

export const nativeSelectSlotRecipe = defineSlotRecipe({
  slots: ["root", "field", "indicator", "icon"],
  base: {
    field: controlBase,
  },
  variants: {
    size: {
      "2xs": { field: sizeOverride },
      xs: { field: sizeOverride },
      sm: { field: sizeOverride },
      md: { field: sizeOverride },
      lg: { field: sizeOverride },
      xl: { field: sizeOverride },
      "2xl": { field: sizeOverride },
    },
  },
});

const CHECKED_SELECTOR = "&:is([data-state=checked], [data-state=indeterminate])";

export const checkboxSlotRecipe = defineSlotRecipe({
  slots: ["root", "label", "control", "indicator", "group"],
  base: {
    control: {
      width: "5",
      height: "5",
      borderRadius: "md",
      cornerShape: SQUIRCLE_CORNER_SHAPE,
      borderWidth: "1.5px",
      borderColor: "current.border",
      _focusVisible: focusRing,
    },
  },
  variants: {
    variant: {
      solid: {
        control: {
          [CHECKED_SELECTOR]: {
            bg: "{colors.colorPalette.600}",
            color: "white",
            borderColor: "{colors.colorPalette.600}",
          },
        },
      },
    },
  },
});

export const radioGroupSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "label",
    "item",
    "itemText",
    "itemControl",
    "indicator",
    "itemAddon",
    "itemIndicator",
  ],
  base: {
    itemControl: {
      width: "5",
      height: "5",
      borderRadius: "full",
      borderWidth: "1.5px",
      borderColor: "current.border",
      _focusVisible: focusRing,
    },
  },
  variants: {
    variant: {
      solid: {
        itemControl: {
          _checked: {
            bg: "{colors.colorPalette.600}",
            color: "white",
            borderColor: "{colors.colorPalette.600}",
          },
        },
      },
    },
  },
});

export const switchSlotRecipe = defineSlotRecipe({
  slots: ["root", "label", "control", "indicator", "thumb"],
  base: {
    root: {
      "--switch-width": "38px",
      "--switch-height": "22px",
    },
  },
  variants: {
    variant: {
      solid: {
        control: {
          bg: "gray.300",
          _checked: {
            bg: "{colors.colorPalette.600}",
          },
        },
        thumb: {
          width: "17px",
          height: "17px",
          insetInlineStart: "2.5px",
          bg: "trueWhite",
          transitionProperty: "translate",
          transitionDuration: "fast",
          _checked: {
            bg: "trueWhite",
          },
        },
      },
    },
  },
});
