import React from "react";

import { SQUIRCLE_CORNER_SHAPE } from "../../Theme/vars/cornerShape";
import { useGrainOverlay } from "../../Theme/vars/grain";
import { Box, type BoxProps } from "../Box";

export interface StatTileProps extends BoxProps {
  number: React.ReactNode;
  label: React.ReactNode;
  colorPalette?: string;
}

export const StatTile = React.forwardRef<HTMLDivElement, StatTileProps>(
  ({ number, label, colorPalette = "hibiscus", css, ...props }, forwardedRef) => {
    const { containerRef, canvas } = useGrainOverlay("stat-tile");
    return (
      <Box
        ref={(node: HTMLDivElement | null) => {
          containerRef(node);
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef)
            (forwardedRef as React.RefObject<HTMLDivElement | null>).current = node;
        }}
        colorPalette={colorPalette}
        position="relative"
        overflow="hidden"
        borderRadius="2xl"
        padding="{spacing.4.5} {spacing.4}"
        color="trueWhite"
        backgroundImage="radial-gradient(125% 135% at 20% 12%, {colors.colorPalette.gradient.critical})"
        css={{ cornerShape: SQUIRCLE_CORNER_SHAPE, ...(css as object) }}
        {...props}
      >
        <Box position="relative" zIndex={1} fontSize="3xl" fontWeight="800" letterSpacing="tight">
          {number}
        </Box>
        <Box
          position="relative"
          zIndex={1}
          fontSize="xs"
          textTransform="uppercase"
          letterSpacing="widest"
          color="whiteAlpha.800"
        >
          {label}
        </Box>
        {canvas}
      </Box>
    );
  },
);
StatTile.displayName = "StatTile";
