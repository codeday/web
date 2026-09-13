import React from "react";

import { type GradientName, gradientStops } from "../../Theme/vars/colors";
import { Box, type BoxProps } from "../Box";

export interface PullQuoteProps extends BoxProps {
  ramp?: GradientName;
}

// .spec.md §4.9 — Pull quote.
export const PullQuote = React.forwardRef<HTMLElement, PullQuoteProps>(({ ramp = "hibiscus", ...props }, ref) => (
  <Box
    as="blockquote"
    ref={ref as any}
    borderLeft={`3px solid ${gradientStops[ramp][3]}`}
    paddingLeft="14px"
    fontSize="16px"
    fontStyle="italic"
    {...props}
  />
));
PullQuote.displayName = "PullQuote";
