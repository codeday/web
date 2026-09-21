import React from "react";

import { type GradientName, gradientStops } from "../../Theme/vars/colors";
import { accentOnWhite } from "../../Theme/vars/gradients";
import { Box, type BoxProps } from "../Box";

export interface EyebrowProps extends BoxProps {
  ramp?: GradientName;
}

// Eyebrow. Colored with `accentOnWhite`, not the raw 62%
// stop (so it stays legible for ramps like Marmalade whose 62% stop fails
// on white). Uses the heading face, not `fontFamily="mono"` — that token
// is Fira Code, a programming face with ligatures that reads as code in a
// short all-caps tracked label. `mono` is still right for genuinely
// monospaced content elsewhere (e.g. a press byline) — this is specific to
// the eyebrow style itself.
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
