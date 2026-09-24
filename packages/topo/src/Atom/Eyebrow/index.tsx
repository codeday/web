import React from "react";

import { type GradientName, gradientStops } from "../../Theme/vars/colors";
import { accentOnWhite } from "../../Theme/vars/gradients";
import { Box, type BoxProps } from "../Box";

export interface EyebrowProps extends BoxProps {
  ramp?: GradientName;
}

export const Eyebrow = React.forwardRef<HTMLElement, EyebrowProps>(
  ({ ramp = "hibiscus", ...props }, ref) => (
    <Box
      as="span"
      ref={ref as any}
      fontFamily="heading"
      fontSize="2xs"
      letterSpacing="0.14em"
      textTransform="uppercase"
      fontWeight="500"
      color={accentOnWhite(gradientStops[ramp])}
      {...props}
    />
  ),
);
Eyebrow.displayName = "Eyebrow";
