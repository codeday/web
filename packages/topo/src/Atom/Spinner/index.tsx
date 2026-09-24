import {
  Spinner as ChakraSpinner,
  type SpinnerProps as ChakraSpinnerProps,
} from "@chakra-ui/react";
import * as m from "@codeday/i18n/messages";
import React from "react";

export interface SpinnerProps extends ChakraSpinnerProps {
  colorPalette?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ colorPalette = "hibiscus", ...props }, ref) => (
    <ChakraSpinner
      ref={ref}
      colorPalette={colorPalette}
      color="colorPalette.600"
      aria-label={m.topo_spinner_loading()}
      {...props}
    />
  ),
);
Spinner.displayName = "Spinner";
