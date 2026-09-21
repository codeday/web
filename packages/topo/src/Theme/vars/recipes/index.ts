import { alertSlotRecipe } from "./alert";
import { badgeRecipe } from "./badge";
import { buttonRecipe } from "./button";
import { cardSlotRecipe } from "./card";
import { chipSlotRecipe } from "./chip";
import { dialogSlotRecipe } from "./dialog";
import { fieldSlotRecipe } from "./field";
import {
  checkboxSlotRecipe,
  inputRecipe,
  nativeSelectSlotRecipe,
  radioGroupSlotRecipe,
  switchSlotRecipe,
  textareaRecipe,
} from "./forms";
import { linkRecipe } from "./link";
import { separatorRecipe } from "./separator";
import {
  avatarSlotRecipe,
  breadcrumbSlotRecipe,
  emptyStateSlotRecipe,
  fileUploadSlotRecipe,
  paginationSlotRecipe,
  progressSlotRecipe,
  tableSlotRecipe,
  tabsSlotRecipe,
} from "./misc";
import { tooltipSlotRecipe } from "./tooltip";
import { headingRecipe } from "./typography";

// Recipes live here (split into per-component files once this
// got long), not in `vars/components.ts` (which stays the empty stub the
// v3 migration left it as).
export const recipes = {
  link: linkRecipe,
  button: buttonRecipe,
  badge: badgeRecipe,
  input: inputRecipe,
  textarea: textareaRecipe,
  heading: headingRecipe,
  separator: separatorRecipe,
};

export const slotRecipes = {
  alert: alertSlotRecipe,
  card: cardSlotRecipe,
  dialog: dialogSlotRecipe,
  tooltip: tooltipSlotRecipe,
  checkbox: checkboxSlotRecipe,
  radioGroup: radioGroupSlotRecipe,
  nativeSelect: nativeSelectSlotRecipe,
  chip: chipSlotRecipe,
  tabs: tabsSlotRecipe,
  breadcrumb: breadcrumbSlotRecipe,
  pagination: paginationSlotRecipe,
  avatar: avatarSlotRecipe,
  emptyState: emptyStateSlotRecipe,
  fileUpload: fileUploadSlotRecipe,
  table: tableSlotRecipe,
  progress: progressSlotRecipe,
  switch: switchSlotRecipe,
  field: fieldSlotRecipe,
};
