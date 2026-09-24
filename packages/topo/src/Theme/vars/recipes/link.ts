import { defineRecipe } from "@chakra-ui/react";

export const linkRecipe = defineRecipe({
  base: {
    color: "inherit",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
    textDecorationColor: "currentColor/30",
    _hover: {
      textDecorationColor: "currentColor",
    },
  },
  variants: {
    variant: {
      plain: {
        color: "inherit",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        textDecorationColor: "currentColor/30",
        _hover: {
          textDecoration: "underline",
          textDecorationColor: "currentColor",
        },
      },
      underline: {
        color: "inherit",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        textDecorationColor: "currentColor/30",
        _hover: {
          textDecorationColor: "currentColor",
        },
      },
    },
  },
});
