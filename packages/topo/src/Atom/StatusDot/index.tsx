import React from "react";

import { Box, type BoxProps } from "../Box";

export interface StatusDotProps extends Omit<BoxProps, "children"> {
  size?: number | string;
  online?: boolean;
  away?: boolean;
  pending?: boolean;
  offline?: boolean;
  /**
   * Always paired with a text label — colour is never the only signal.
   * Required, not optional.
   */
  label: React.ReactNode;
}

// Repointed to the new palette's 600 stops (dark fills),
// and now always renders with its text label rather than just the dot.
export const StatusDot = React.forwardRef<HTMLDivElement, StatusDotProps>(
  ({ size = 3, online, away, pending, offline, label, ...props }, ref) => {
    const status = (online && "online") || (away && "away") || (pending && "pending") || "offline";
    const color = (online && "green.600") || ((away || pending) && "orange.600") || "red.600";
    return (
      <Box ref={ref} display="inline-flex" alignItems="center" gap="1.5" {...props}>
        <Box
          width={size}
          height={size}
          display="inline-block"
          bg={color}
          borderRadius="full"
          flexShrink={0}
          title={status}
        />
        <Box as="span" fontSize="sm">
          {label}
        </Box>
      </Box>
    );
  },
);
StatusDot.displayName = "StatusDot";
