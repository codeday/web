import { Alert as ChakraAlert, type AlertRootProps } from "@chakra-ui/react";
import React from "react";

export type AlertVariant = "hairline" | "solid" | "rail" | "critical";

export interface AlertProps extends Omit<AlertRootProps, "variant"> {
  variant?: AlertVariant;
}

// .spec.md §4.2 — four variants, none generic (see the recipe at
// `../../Theme/vars/recipes/alert.ts` for the styling itself).
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(({ variant, ...props }, ref) => (
  <ChakraAlert.Root ref={ref} {...({ variant } as any)} {...props} />
));
Alert.displayName = "Alert";

export const AlertIcon = ChakraAlert.Indicator;
export const AlertTitle = ChakraAlert.Title;
export const AlertDescription = ChakraAlert.Description;
