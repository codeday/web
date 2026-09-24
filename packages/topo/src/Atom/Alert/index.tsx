import { Alert as ChakraAlert, Box, type BoxProps, type AlertRootProps } from "@chakra-ui/react";
import React from "react";

import { useGrainOverlay } from "../../Theme/vars/grain";

const CRITICAL_ALERT_GRAIN_OPACITY = 0.5;

export type AlertVariant = "hairline" | "solid" | "rail" | "critical";

export interface AlertProps extends Omit<AlertRootProps, "variant"> {
  variant?: AlertVariant;
  index?: React.ReactNode;
}

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
export const AlertContent = ChakraAlert.Content;

export const AlertActions = React.forwardRef<HTMLDivElement, BoxProps>((props, ref) => (
  <Box ref={ref} marginTop="2.5" display="flex" gap="2" {...props} />
));
AlertActions.displayName = "AlertActions";
