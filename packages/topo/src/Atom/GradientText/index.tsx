import React from "react";

import { type GradientName, gradientStops } from "../../Theme/vars/colors";
import { Box, type BoxProps } from "../Box";

export interface GradientTextProps extends BoxProps {
  ramp?: GradientName;
}

// .spec.md §4.9 — gradient fill on text. A real `color` fallback (the deep
// stop) is always set, so it degrades to a solid if `background-clip: text`
// isn't supported.
export const GradientText = React.forwardRef<HTMLElement, GradientTextProps>(
  ({ ramp = "hibiscus", css, ...props }, ref) => {
    const [, , deep, mid, light] = gradientStops[ramp];
    return (
      <Box
        as="span"
        ref={ref as any}
        color={deep}
        css={{
          backgroundImage: `linear-gradient(96deg, ${deep}, ${mid} 60%, ${light})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          ...(css as object),
        }}
        {...props}
      />
    );
  },
);
GradientText.displayName = "GradientText";
