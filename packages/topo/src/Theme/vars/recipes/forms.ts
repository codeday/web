import { defineRecipe, defineSlotRecipe } from "@chakra-ui/react";

// .spec.md §4.4 — Forms. Focus ring takes the section gradient's 62% stop;
// error is the only place a form uses a semantic hue.
const focusRing = {
  borderColor: "{colors.colorPalette.mid}",
  boxShadow: "0 0 0 3px {colors.colorPalette.mid/18}",
  outline: "0",
};

const controlBase = {
  fontSize: "14.5px",
  paddingInline: "12px",
  paddingBlock: "10px",
  borderRadius: "9px",
  borderWidth: "1.5px",
  borderColor: "current.border",
  _focusVisible: focusRing,
  _invalid: {
    borderColor: "red.600",
  },
};

export const inputRecipe = defineRecipe({ base: controlBase });
export const textareaRecipe = defineRecipe({ base: controlBase });

export const nativeSelectSlotRecipe = defineSlotRecipe({
  slots: ["root", "field", "indicator", "icon"],
  base: {
    field: controlBase,
  },
});

// Checked fill is the flat 62% stop, not a gradient (.spec.md §4.4). Ramps
// (e.g. "hibiscus") don't have the `.solid`/`.contrast` sub-keys a normal
// Chakra color scale does, so the default recipes' `colorPalette.solid`
// checked-fill needs overriding — at the exact same variant/selector the
// built-ins use (`checkmarkRecipe`/`radiomarkRecipe`'s "solid" variant), so
// the override merges cleanly instead of racing the default on cascade order.
const CHECKED_SELECTOR = "&:is([data-state=checked], [data-state=indeterminate])";

export const checkboxSlotRecipe = defineSlotRecipe({
  slots: ["root", "label", "control", "indicator", "group"],
  base: {
    control: {
      width: "19px",
      height: "19px",
      borderRadius: "6px",
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
            bg: "{colors.colorPalette.mid}",
            color: "white",
            borderColor: "{colors.colorPalette.mid}",
          },
        },
      },
    },
  },
});

export const radioGroupSlotRecipe = defineSlotRecipe({
  slots: ["root", "label", "item", "itemText", "itemControl", "indicator", "itemAddon", "itemIndicator"],
  base: {
    itemControl: {
      width: "19px",
      height: "19px",
      borderRadius: "50%",
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
            bg: "{colors.colorPalette.mid}",
            color: "white",
            borderColor: "{colors.colorPalette.mid}",
          },
        },
      },
    },
  },
});

// .spec.md §4.4 — Switch (restyled in place; `Atom/Input/Switch.tsx`'s
// v2/v3-compat wrapper is unchanged). 38x22px track, off gray.300, on the
// 62% stop. Thumb 17px white, inset 2.5px (22-17)/2. Overriding under the
// same "solid" variant path Chakra's own switch recipe uses, since
// `colorPalette.solid`/`.contrast` are undefined for our ramps.
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
            bg: "{colors.colorPalette.mid}",
          },
        },
        thumb: {
          width: "17px",
          height: "17px",
          insetInlineStart: "2.5px",
          bg: "white",
          transitionProperty: "translate",
          transitionDuration: "0.15s",
          _checked: {
            bg: "white",
          },
        },
      },
    },
  },
});
