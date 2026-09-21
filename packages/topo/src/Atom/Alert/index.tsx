import { Alert as ChakraAlert, Box, type BoxProps, type AlertRootProps } from "@chakra-ui/react";
import React from "react";

import { useGrainOverlay } from "../../Theme/vars/grain";

// The critical field's grain runs at .5 opacity, not the system default
// .38 — heavier than every other grain consumer because a single flat
// gradient field with white text over it reads as flatter/more "printed"
// than a card or button, and needs more texture to hold up.
const CRITICAL_ALERT_GRAIN_OPACITY = 0.5;

export type AlertVariant = "hairline" | "solid" | "rail" | "critical";

export interface AlertProps extends Omit<AlertRootProps, "variant"> {
  variant?: AlertVariant;
  /**
   * The hairline variant borrows the full rule + margin index sectioning
   * device, not just the rule — pass the index content (e.g. "01") to
   * render it. Ignored by the other variants.
   */
  index?: React.ReactNode;
}

// Four variants, none generic (see the recipe at
// `../../Theme/vars/recipes/alert.ts` for the styling itself). `critical` is
// the only variant with a full gradient field — the others are flat/
// hairline/a thin 4px rail, none of which read as a "field" that grain
// belongs on.
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ variant, index, children, ...props }, forwardedRef) => {
    const isGradient = variant === "critical";
    const { containerRef, canvas } = useGrainOverlay("alert", CRITICAL_ALERT_GRAIN_OPACITY);

    return (
      <ChakraAlert.Root
        ref={(node: HTMLDivElement | null) => {
          if (isGradient) containerRef(node);
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef)
            (forwardedRef as React.RefObject<HTMLDivElement | null>).current = node;
        }}
        {...({ variant } as any)}
        {...props}
      >
        {variant === "hairline" && index !== undefined && (
          <Box flexShrink={0} width="9" fontFamily="mono" fontSize="xs" color="current.textLight">
            {index}
          </Box>
        )}
        {children}
        {isGradient && canvas}
      </ChakraAlert.Root>
    );
  },
);
Alert.displayName = "Alert";

export const AlertIcon = ChakraAlert.Indicator;
export const AlertTitle = ChakraAlert.Title;
export const AlertDescription = ChakraAlert.Description;
// The title/description column (the recipe's `content` slot) — required
// whenever an alert has more than a bare title (a description, and/or
// actions), so they stack in a column beside the icon rather than all
// competing as flat siblings in the root's row layout.
export const AlertContent = ChakraAlert.Content;

// Actions sit inside the text column, below the description — never
// floated right. `hairline`/`rail` are notices, not decisions, and don't
// take this; only `solid`/`critical` do.
export const AlertActions = React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => (
  <Box ref={ref} marginTop="2.5" display="flex" gap="2" {...props} />
));
AlertActions.displayName = "AlertActions";
