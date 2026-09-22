import { defineRecipe } from "@chakra-ui/react";

// ---------------------------------------------------------------------------
// Separator (Divider) recipe override
// Chakra's default separator recipe borders with its own stock `border`
// semantic token (gray.200 light / gray.800 dark), which we never overrode —
// gray.800 (#27272a) sits almost on top of our dark-mode page background
// (`current.bg`), so the rule was effectively invisible in dark
// mode. `current.border` is our own mode-aware border token and already
// contrasts against `current.bg` in both modes.
// ---------------------------------------------------------------------------
export const separatorRecipe = defineRecipe({
  base: {
    borderColor: "current.border",
  },
});
