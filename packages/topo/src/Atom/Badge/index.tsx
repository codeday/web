import { Badge as ChakraBadge, type BadgeProps as ChakraBadgeProps } from "@chakra-ui/react";
import React from "react";

import { useGrainOverlay } from "../../Theme/vars/grain";
import { Box } from "../Box";

export type BadgeVariant = "solid" | "solidDark" | "gradient" | "outline" | "dot" | "squircle";

export interface BadgeProps extends Omit<ChakraBadgeProps, "variant"> {
  variant?: BadgeVariant;
  /** Renders the two-segment count form (`splitCount`). */
  count?: React.ReactNode;
}

// Badge. The `gradient` variant's grain overlay and the
// `dot`/`splitCount` forms need markup a plain recipe can't add, so Badge is
// a thin wrapper rather than a pure re-export. The `squircle` variant's
// shape is plain CSS (`corner-shape`, see badge.ts) and needs no wrapper
// logic of its own.
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, count, children, css, ...props }, forwardedRef) => {
    const isGradient = variant === "gradient";
    const isDot = variant === "dot";
    const isSplitCount = count !== undefined;
    const { containerRef, canvas } = useGrainOverlay("badge");

    return (
      <ChakraBadge
        ref={(node: HTMLSpanElement | null) => {
          if (isGradient) containerRef(node);
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef)
            (forwardedRef as React.RefObject<HTMLSpanElement | null>).current = node;
        }}
        {...({ variant, splitCount: isSplitCount || undefined } as any)}
        css={css as object}
        {...props}
      >
        {isDot && (
          <Box as="span" boxSize="1.5" borderRadius="full" bg="colorPalette.600" flexShrink={0} />
        )}
        {isSplitCount ? (
          <>
            <Box as="span" paddingInline="2.5" display="inline-flex" alignItems="center">
              {children}
            </Box>
            <Box
              as="span"
              paddingInline="2.5"
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
        {isGradient && canvas}
      </ChakraBadge>
    );
  },
);
Badge.displayName = "Badge";
