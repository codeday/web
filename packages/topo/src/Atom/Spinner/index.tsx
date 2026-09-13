import { Spinner as ChakraSpinner, type SpinnerProps as ChakraSpinnerProps } from "@chakra-ui/react";
import * as m from "@codeday/i18n/messages";
import React from "react";

export interface SpinnerProps extends ChakraSpinnerProps {
  colorPalette?: string;
}

// .spec.md §4.6 — "Single colour — the section midpoint. Never
// multi-stop." Previously an external <img> pointing at a hosted SVG/GIF
// asset; now a plain CSS spinner colored from the active ramp, matching
// the rest of the system rather than a shipped asset.
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ colorPalette = "hibiscus", ...props }, ref) => (
    <ChakraSpinner
      ref={ref}
      colorPalette={colorPalette}
      color="colorPalette.mid"
      aria-label={m.topo_spinner_loading()}
      {...props}
    />
  ),
);
Spinner.displayName = "Spinner";
