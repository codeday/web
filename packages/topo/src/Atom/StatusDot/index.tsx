import React from "react";

import { Box, type BoxProps } from "../Box";

export interface StatusDotProps extends Omit<BoxProps, "children"> {
  size?: number | string;
  online?: boolean;
  away?: boolean;
  pending?: boolean;
  offline?: boolean;
  /**
   * Always paired with a text label — colour is never the only signal
   * (.spec.md §4.2). Required, not optional.
   */
  label: React.ReactNode;
}

// .spec.md §4.2 — repointed to the new palette's 600 stops (dark fills),
// and now always renders with its text label rather than just the dot.
export const StatusDot = React.forwardRef<HTMLDivElement, StatusDotProps>(
  ({ size = 3, online, away, pending, offline, label, ...props }, ref) => {
    const status = (online && "online") || (away && "away") || (pending && "pending") || "offline";
    const color = (online && "green.600") || ((away || pending) && "orange.600") || "red.600";
    return (
      <Box ref={ref} display="inline-flex" alignItems="center" gap="6px" {...props}>
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
