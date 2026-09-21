import { defineSlotRecipe } from "@chakra-ui/react";

import { SQUIRCLE_CORNER_SHAPE } from "../cornerShape";

// Tabs. Active marker is a 2.5px bar in the 62% stop, inset
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
        color: "black",
      },
    },
    indicator: {
      // Zag's inline style only sets `left`/`top` (the axis it slides along)
      // — it never sets `bottom`, so without an explicit value here the
      // indicator's own CSS `top: auto` falls back to its in-flow static
      // position, which (given the indicator's default height spans the
      // full trigger) pins our short 2.5px bar to the TOP of that box
      // instead of the bottom rule it's meant to sit on.
      top: "auto",
      bottom: 0,
      height: "2.5px",
      insetInline: "2",
      bg: "{colors.colorPalette.600}",
    },
  },
  variants: {
    // Chakra's own default "line" variant (the recipe's own default,
    // unset here means it's still active) puts a SECOND underline on the
    // selected trigger — a `::before` pseudo-element via
    // `layerStyle: "indicator.bottom"`, defaulting to a neutral/black
    // colour — entirely separate from our own `indicator` slot (the real
    // `Tabs.Indicator` element, the coloured 2.5px sliding bar above).
    // Left alone, both render at once. Cancel the pseudo-element one so
    // only the coloured indicator remains.
    //
    // Chakra sets that `layerStyle` nested under `_selected._horizontal`
    // (and `_selected._vertical`) — NOT directly on `_selected` — so a
    // bare `_selected: { layerStyle: "unset" }` here is a sibling key that
    // never touches the real one and silently no-ops. Has to match the
    // exact nesting to actually cancel it.
    variant: {
      line: {
        trigger: {
          _selected: {
            _horizontal: {
              layerStyle: "unset",
            },
            _vertical: {
              layerStyle: "unset",
            },
          },
        },
      },
    },
  },
});

// Breadcrumb. Muted links, last crumb in ink.
export const breadcrumbSlotRecipe = defineSlotRecipe({
  slots: ["link", "currentLink", "item", "list", "root", "ellipsis", "separator"],
  base: {
    list: {
      fontSize: "sm",
    },
    link: {
      color: "current.textLight",
    },
    currentLink: {
      color: "black",
    },
  },
  // Chakra's own default sets `textStyle` on `list` under `variants.size.*`
  // (default "md"), which wins over a base-level fontSize the same way it
  // did for Input/Alert/Table — neutralize it and restate at the same stage.
  variants: {
    size: {
      sm: { list: { textStyle: "none", fontSize: "sm" } },
      md: { list: { textStyle: "none", fontSize: "sm" } },
      lg: { list: { textStyle: "none", fontSize: "sm" } },
    },
  },
});

// Pagination. Ships with zero default Chakra styling, so
// this recipe is authored from scratch.
const paginationItemBase = {
  minWidth: "8",
  height: "8",
  borderRadius: "lg",
  cornerShape: SQUIRCLE_CORNER_SHAPE,
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
        bg: "{colors.colorPalette.600}",
        color: "white",
        borderColor: "transparent",
      },
    },
    nextTrigger: paginationItemBase,
    prevTrigger: paginationItemBase,
  },
});

// Avatar. Squircle at small sizes.
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
          "--avatar-size": "{sizes.9}",
          "--avatar-radius": "{radii.xl}",
          cornerShape: SQUIRCLE_CORNER_SHAPE,
        },
        image: { cornerShape: SQUIRCLE_CORNER_SHAPE },
        fallback: { cornerShape: SQUIRCLE_CORNER_SHAPE },
      },
    },
  },
});

// EmptyState. Left-aligned, not centred, capped ramp field.
const emptyStatePadding = { paddingInline: "6", paddingBlock: "7" };
export const emptyStateSlotRecipe = defineSlotRecipe({
  slots: ["root", "content", "indicator", "title", "description"],
  base: {
    root: {
      paddingInline: "6",
      paddingBlock: "7",
      borderRadius: "xl",
      cornerShape: SQUIRCLE_CORNER_SHAPE,
      backgroundImage: "linear-gradient(110deg, {colors.colorPalette.gradient.emptyState})",
      color: "trueWhite",
      position: "relative",
    },
    content: {
      alignItems: "flex-start",
      textAlign: "start",
    },
  },
  // Chakra's own default sets `px`/`py` on `root` under `variants.size.*`
  // (default "md") — same fix as elsewhere.
  variants: {
    size: {
      sm: { root: emptyStatePadding },
      md: { root: emptyStatePadding },
      lg: { root: emptyStatePadding },
    },
  },
});

// New to Topo, re-export + recipe (no bespoke restyle called
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

// Table. No fields, runs on the semantic palette alone.
const tableCellPadding = {
  paddingBlock: "2.5",
  paddingInlineEnd: "2.5",
  paddingInlineStart: "0",
};
export const tableSlotRecipe = defineSlotRecipe({
  slots: ["root", "header", "body", "row", "columnHeader", "cell", "footer", "caption"],
  base: {
    columnHeader: {
      fontSize: "2xs",
      textTransform: "uppercase",
      letterSpacing: "widest",
      fontWeight: "600",
      color: "current.textLight",
      borderBottomWidth: "1px",
      borderColor: "current.border",
    },
    cell: {
      fontSize: "sm",
      borderBottomWidth: "1px",
      borderColor: "current.border",
    },
  },
  // Chakra's own default table recipe sets `px`/`py` on `cell`/`columnHeader`
  // under `variants.size.*` (default "md") — restated here (see forms.ts /
  // alert.ts for why this needs to be at the same "size" stage with
  // matching longhand names, not a base-level override).
  variants: {
    size: {
      sm: { columnHeader: tableCellPadding, cell: tableCellPadding },
      md: { columnHeader: tableCellPadding, cell: tableCellPadding },
      lg: { columnHeader: tableCellPadding, cell: tableCellPadding },
    },
  },
});

// Progress. The fill is the one small element that earns a
// ramp: `linear-gradient(90deg, <deep>, <mid>)`.
export const progressSlotRecipe = defineSlotRecipe({
  slots: [
    "root",
    "label",
    "track",
    "range",
    "valueText",
    "view",
    "circle",
    "circleTrack",
    "circleRange",
  ],
  base: {
    track: {
      height: "2.5",
      borderRadius: "full",
      bg: "gray.300",
    },
    range: {
      backgroundImage:
        "linear-gradient(90deg, {colors.colorPalette.800}, {colors.colorPalette.600})",
    },
  },
});
