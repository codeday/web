import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
  CloseButton,
  Spinner,
} from "@chakra-ui/react";
import React from "react";

import { useGrainOverlay } from "../../Theme/vars/grain";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "dangerSolid"
  | "icon"
  | "onColor"
  | "onColorOutline";

export interface ButtonProps extends Omit<ChakraButtonProps, "variant"> {
  variant?: ButtonVariant;
}

const loadingSpinner = (
  <Spinner
    width="4"
    height="4"
    borderWidth="2px"
    animationDuration="0.7s"
    css={{
      borderColor: "rgba(255,255,255,.35)",
      borderTopColor: "#fff",
      animationTimingFunction: "linear",
      "@media (prefers-reduced-motion: reduce)": {
        animation: "none",
      },
    }}
  />
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, children, ...props }, forwardedRef) => {
    const isGradient = variant === undefined || variant === "primary" || variant === "icon";
    const { containerRef, canvas } = useGrainOverlay("button");

    return (
      <ChakraButton
        colorPalette="hibiscus"
        spinner={loadingSpinner}
        variant={variant as any}
        ref={(node: HTMLButtonElement | null) => {
          if (isGradient) containerRef(node);
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef)
            (forwardedRef as React.RefObject<HTMLButtonElement | null>).current = node;
        }}
        {...(props as any)}
      >
        {children}
        {isGradient && canvas}
      </ChakraButton>
    );
  },
);
Button.displayName = "Button";

export { CloseButton };
