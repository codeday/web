import { defineSlotRecipe } from "@chakra-ui/react";

// .spec.md §4.3 — Tabs. Active marker is a 2.5px bar in the 62% stop, inset
// 8px from each edge of the tab, sitting on the 1px bottom rule.
export const tabsSlotRecipe = defineSlotRecipe({
  slots: ["root", "trigger", "list", "content", "contentGroup", "indicator"],
  base: {
    list: {
      borderBottomWidth: "1px",
      borderColor: "current.border",
    },
    trigger: {
      color: "current.textLight",
      _selected: {
        color: "current.text",
      },
    },
    indicator: {
      height: "2.5px",
      insetInline: "8px",
      bg: "{colors.colorPalette.mid}",
    },
  },
});

// .spec.md §4.3 — Breadcrumb. Muted links, last crumb in ink.
export const breadcrumbSlotRecipe = defineSlotRecipe({
  slots: ["link", "currentLink", "item", "list", "root", "ellipsis", "separator"],
  base: {
    list: {
      fontSize: "13.5px",
    },
    link: {
      color: "current.textLight",
    },
    currentLink: {
      color: "current.text",
    },
  },
});

// .spec.md §4.3 — Pagination. Ships with zero default Chakra styling, so
// this recipe is authored from scratch.
const paginationItemBase = {
  minWidth: "33px",
  height: "33px",
  borderRadius: "8px",
  borderWidth: "1px",
  borderColor: "current.border",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};
export const paginationSlotRecipe = defineSlotRecipe({
  slots: ["root", "ellipsis", "item", "nextTrigger", "prevTrigger"],
  base: {
    root: {
      display: "flex",
      gap: "2",
    },
    ellipsis: paginationItemBase,
    item: {
      ...paginationItemBase,
      // Current page.
      '&[aria-current="page"]': {
        bg: "{colors.colorPalette.mid}",
        color: "white",
        borderColor: "transparent",
      },
    },
    nextTrigger: paginationItemBase,
    prevTrigger: paginationItemBase,
  },
});

// .spec.md §4.6 — Avatar. Squircle at small sizes.
export const avatarSlotRecipe = defineSlotRecipe({
  slots: ["root", "image", "fallback"],
  base: {
    fallback: {
      fontWeight: "800",
      color: "white",
    },
  },
  variants: {
    size: {
      sm: {
        root: {
          "--avatar-size": "34px",
          "--avatar-radius": "11px",
        },
      },
    },
  },
});

// .spec.md §4.5 — EmptyState. Left-aligned, not centred, capped ramp field.
export const emptyStateSlotRecipe = defineSlotRecipe({
  slots: ["root", "content", "indicator", "title", "description"],
  base: {
    root: {
      padding: "26px 22px",
      borderRadius: "12px",
      backgroundImage: "linear-gradient(110deg, {colors.colorPalette.gradient.emptyState})",
      color: "white",
    },
    content: {
      alignItems: "flex-start",
      textAlign: "start",
    },
  },
});

// .spec.md §4.3 — new to Topo, re-export + recipe (no bespoke restyle called
// for beyond Chakra's sensible defaults).
export const fileUploadSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "dropzone",
    "item",
    "itemDeleteTrigger",
    "itemGroup",
    "itemName",
    "itemPreview",
    "itemPreviewImage",
    "itemSizeText",
    "label",
    "trigger",
    "clearTrigger",
    "itemContent",
    "dropzoneContent",
    "fileText",
  ],
  base: {
    dropzone: {
      borderColor: "current.border",
    },
  },
});

// .spec.md §4.6 — Table. No fields, runs on the semantic palette alone.
export const tableSlotRecipe = defineSlotRecipe({
  slots: ["root", "header", "body", "row", "columnHeader", "cell", "footer", "caption"],
  base: {
    columnHeader: {
      fontSize: "10.5px",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      fontWeight: "600",
      color: "current.textLight",
      borderBottomWidth: "1px",
      borderColor: "current.border",
    },
    cell: {
      fontSize: "13.5px",
      borderBottomWidth: "1px",
      borderColor: "current.border",
    },
  },
});

// .spec.md §4.6 — Progress. The fill is the one small element that earns a
// ramp: `linear-gradient(90deg, <deep>, <mid>)`.
export const progressSlotRecipe = defineSlotRecipe({
  slots: ["root", "label", "track", "range", "valueText", "view", "circle", "circleTrack", "circleRange"],
  base: {
    track: {
      height: "9px",
      borderRadius: "99px",
      bg: "gray.300",
    },
    range: {
      backgroundImage: "linear-gradient(90deg, {colors.colorPalette.deep}, {colors.colorPalette.mid})",
    },
  },
});
