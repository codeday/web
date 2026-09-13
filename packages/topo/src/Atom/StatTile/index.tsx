import React from "react";

import { useGrainDataUri } from "../../Theme/vars/grain";
import { Box, type BoxProps } from "../Box";

export interface StatTileProps extends BoxProps {
  number: React.ReactNode;
  label: React.ReactNode;
  colorPalette?: string;
}

// .spec.md §4.6 — StatTile, the one home for the radial geometry. No
// gradient elsewhere in the dashboard group — the rest runs on the
// semantic palette alone.
export const StatTile = React.forwardRef<HTMLDivElement, StatTileProps>(
  ({ number, label, colorPalette = "hibiscus", css, ...props }, ref) => {
    const grainUri = useGrainDataUri(48, "stat-tile");
    return (
      <Box
        ref={ref}
        colorPalette={colorPalette}
        position="relative"
        overflow="hidden"
        borderRadius="14px"
        padding="18px 16px"
        color="white"
        backgroundImage="radial-gradient(125% 135% at 20% 12%, {colors.colorPalette.gradient.full})"
        css={{
          ...(grainUri
            ? {
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url("${grainUri}")`,
                  backgroundSize: "7% auto",
                  opacity: 0.5,
                  mixBlendMode: "overlay",
                  pointerEvents: "none",
                },
              }
            : {}),
          ...(css as object),
        }}
        {...props}
      >
        <Box position="relative" zIndex={1} fontSize="31px" fontWeight="800" letterSpacing="-0.02em">
          {number}
        </Box>
        <Box
          position="relative"
          zIndex={1}
          fontSize="12px"
          textTransform="uppercase"
          letterSpacing="0.1em"
          color="whiteAlpha.800"
        >
          {label}
        </Box>
      </Box>
    );
  },
);
StatTile.displayName = "StatTile";
