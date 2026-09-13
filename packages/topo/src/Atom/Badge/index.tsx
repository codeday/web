import { Badge as ChakraBadge, type BadgeProps as ChakraBadgeProps } from "@chakra-ui/react";
import React from "react";

import { useGrainDataUri } from "../../Theme/vars/grain";
import { Box } from "../Box";

export type BadgeVariant = "solid" | "gradient" | "outline" | "dot" | "squircle";

export interface BadgeProps extends Omit<ChakraBadgeProps, "variant"> {
  variant?: BadgeVariant;
  /** Renders the two-segment count form (.spec.md §4.2 `splitCount`). */
  count?: React.ReactNode;
}

// .spec.md §4.2 — Badge. The `gradient` variant's grain overlay and the
// `dot`/`splitCount` forms all need markup a plain recipe can't add, so
// Badge is a thin wrapper rather than a pure re-export.
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, count, children, css, ...props }, ref) => {
    const isGradient = variant === "gradient";
    const isDot = variant === "dot";
    const isSplitCount = count !== undefined;
    const grainUri = useGrainDataUri(34, "badge");

    return (
      <ChakraBadge
        ref={ref}
        {...({ variant, splitCount: isSplitCount || undefined } as any)}
        css={{
          ...(isGradient && grainUri
            ? {
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url("${grainUri}")`,
                  backgroundSize: "34px 34px",
                  opacity: 0.3,
                  mixBlendMode: "overlay",
                  pointerEvents: "none",
                },
              }
            : {}),
          ...(css as object),
        }}
        {...props}
      >
        {isDot && (
          <Box as="span" boxSize="6px" borderRadius="full" bg="colorPalette.600" flexShrink={0} />
        )}
        {isSplitCount ? (
          <>
            <Box as="span" paddingInline="9px" display="inline-flex" alignItems="center">
              {children}
            </Box>
            <Box
              as="span"
              paddingInline="9px"
              display="inline-flex"
              alignItems="center"
              bg="colorPalette.600"
              color="white"
            >
              {count}
            </Box>
          </>
        ) : (
          children
        )}
      </ChakraBadge>
    );
  },
);
Badge.displayName = "Badge";
