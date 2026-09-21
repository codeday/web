import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
  CloseButton,
  Spinner,
} from "@chakra-ui/react";
import React from "react";

import { useGrainOverlay } from "../../Theme/vars/grain";

// The custom variant set the `button` recipe defines
// (`../../Theme/vars/recipes/button.ts`), which Chakra's own generated
// `ButtonProps` type doesn't know about.
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

// Loading state: label swaps for a spinner, but the gradient
// itself never animates. The spinner is a distinct look from Chakra's
// default (currentColor ring with a transparent track) — a translucent
// white track with a solid white leading edge — so it's rendered directly
// rather than fought through the shared, globally-used `spinner` recipe.
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

// Defaults `colorPalette` to Hibiscus — a section wrapper can set a
// different `colorPalette` (e.g. "figjam") to switch the primary/icon
// variants' gradient per the per-section primary fills table. `primary`/
// `icon` are the only variants with a gradient field — `secondary`/
// `ghost`/`danger`/`dangerSolid` are flat/outlined, none of which read as
// a "field" that grain belongs on.
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
