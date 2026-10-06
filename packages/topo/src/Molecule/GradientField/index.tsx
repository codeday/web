import { Box, type BoxProps } from "@codeday/topo/Atom";
import React from "react";

import type { GradientName } from "../../Theme/vars/colors";
import { useGrainOverlay } from "../../Theme/vars/grain";

export interface GradientFieldProps extends BoxProps {
  ramp: GradientName;
}

export const GradientField = React.forwardRef<HTMLDivElement, GradientFieldProps>(
  ({ ramp, children, ...props }, forwardedRef) => {
    const { containerRef, canvas } = useGrainOverlay("gradient-field");

    return (
      <Box
        ref={(node: HTMLDivElement | null) => {
          containerRef(node);
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef)
            (forwardedRef as React.RefObject<HTMLDivElement | null>).current = node;
        }}
        colorPalette={ramp}
        position="relative"
        overflow="hidden"
        isolation="isolate"
        color="trueWhite"
        backgroundImage="linear-gradient(115deg, {colors.colorPalette.gradient.critical})"
        {...props}
      >
        <Box position="relative" zIndex={1}>
          {children}
        </Box>
        {canvas}
      </Box>
    );
  },
);
GradientField.displayName = "GradientField";
