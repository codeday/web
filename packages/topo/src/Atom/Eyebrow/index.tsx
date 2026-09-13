import React from "react";

import { type GradientName, gradientStops } from "../../Theme/vars/colors";
import { accentOnWhite } from "../../Theme/vars/gradients";
import { Box, type BoxProps } from "../Box";

export interface EyebrowProps extends BoxProps {
  ramp?: GradientName;
}

// .spec.md §4.9 — Eyebrow. Colored with `accentOnWhite`, not the raw 62%
// stop (so it stays legible for ramps like Marmalade whose 62% stop fails
// on white).
export const Eyebrow = React.forwardRef<HTMLElement, EyebrowProps>(({ ramp = "hibiscus", ...props }, ref) => (
  <Box
    as="span"
    ref={ref as any}
    fontFamily="mono"
    fontSize="10.5px"
    letterSpacing="0.14em"
    textTransform="uppercase"
    fontWeight="500"
    color={accentOnWhite(gradientStops[ramp])}
    {...props}
  />
));
Eyebrow.displayName = "Eyebrow";
