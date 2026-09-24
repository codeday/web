import React from "react";

import { type GradientName, gradientStops } from "../../Theme/vars/colors";
import { Box, type BoxProps } from "../Box";

export interface GradientTextProps extends BoxProps {
  ramp?: GradientName;
}

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
