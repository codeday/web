import { defineRecipe } from "@chakra-ui/react";

// .spec.md §4.9 — headline tracking goes to 0. Chakra's default `textStyle`
// tokens for large sizes carry -0.025em letter-spacing; the old look's
// coldness came from Black weight at tight tracking, not the typeface, so
// this is reset at the recipe level rather than per call site.
export const headingRecipe = defineRecipe({
  base: {
    letterSpacing: "0",
  },
});
