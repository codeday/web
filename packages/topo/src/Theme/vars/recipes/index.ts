import { linkRecipe } from "./link";
import { alertSlotRecipe } from "./alert";
import { badgeRecipe } from "./badge";
import { buttonRecipe } from "./button";
import { cardSlotRecipe } from "./card";
import { dialogSlotRecipe } from "./dialog";
import {
  checkboxSlotRecipe,
  inputRecipe,
  nativeSelectSlotRecipe,
  radioGroupSlotRecipe,
  textareaRecipe,
} from "./forms";
import { tooltipSlotRecipe } from "./tooltip";

// .spec.md §0 — recipes live here (split into per-component files once this
// got long), not in `vars/components.ts` (which stays the empty stub the
// v3 migration left it as).
export const recipes = {
  link: linkRecipe,
  button: buttonRecipe,
  badge: badgeRecipe,
  input: inputRecipe,
  textarea: textareaRecipe,
};

export const slotRecipes = {
  alert: alertSlotRecipe,
  card: cardSlotRecipe,
  dialog: dialogSlotRecipe,
  tooltip: tooltipSlotRecipe,
  checkbox: checkboxSlotRecipe,
  radioGroup: radioGroupSlotRecipe,
  nativeSelect: nativeSelectSlotRecipe,
};
