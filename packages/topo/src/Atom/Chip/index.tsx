import { createSlotRecipeContext } from "@chakra-ui/react";
import React from "react";

// Chip. Named `Chip`, not `Tag`, and built directly on the
// "chip" slot recipe (registered in `../../Theme/vars/recipes/chip.ts`)
// rather than wrapping Chakra's `Tag` compound, whose `Root`/`Label`/
// `CloseTrigger` are bound internally to the "tag" recipe key.
const { withProvider, withContext } = createSlotRecipeContext({ key: "chip" });

export interface ChipProps extends React.ComponentProps<typeof ChipRoot> {
  /** Renders the 19px circular remove control. */
  onRemove?: () => void;
}

const ChipRoot = withProvider<
  HTMLSpanElement,
  { colorPalette?: string; children?: React.ReactNode }
>("span", "root");
const ChipLabel = withContext<HTMLSpanElement, { children?: React.ReactNode }>("span", "label");
const ChipCloseTrigger = withContext<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>("button", "closeTrigger");

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ children, onRemove, ...props }, ref) => (
    <ChipRoot ref={ref} {...props}>
      <ChipLabel>{children}</ChipLabel>
      {onRemove && (
        <ChipCloseTrigger type="button" aria-label="Remove" onClick={onRemove}>
          &times;
        </ChipCloseTrigger>
      )}
    </ChipRoot>
  ),
);
Chip.displayName = "Chip";
