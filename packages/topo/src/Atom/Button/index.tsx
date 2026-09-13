import { Button as ChakraButton, type ButtonProps as ChakraButtonProps, CloseButton, Spinner } from "@chakra-ui/react";
import React from "react";

// .spec.md §4.1 — the custom variant set the `button` recipe defines
// (`../../Theme/vars/recipes/button.ts`), which Chakra's own generated
// `ButtonProps` type doesn't know about.
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "dangerSolid" | "icon";

export interface ButtonProps extends Omit<ChakraButtonProps, "variant"> {
  variant?: ButtonVariant;
}

// .spec.md §4.1 loading state: label swaps for a spinner, but the gradient
// itself never animates. The spinner is a distinct look from Chakra's
// default (currentColor ring with a transparent track) — a translucent
// white track with a solid white leading edge — so it's rendered directly
// rather than fought through the shared, globally-used `spinner` recipe.
const loadingSpinner = (
  <Spinner
    width="14px"
    height="14px"
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

// Defaults `colorPalette` to Hibiscus (.spec.md §1, §4.1) — a section
// wrapper can set a different `colorPalette` (e.g. "figjam") to switch the
// primary/icon variants' gradient per the per-section primary fills table.
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <ChakraButton colorPalette="hibiscus" spinner={loadingSpinner} ref={ref} {...(props as any)} />
));
Button.displayName = "Button";

export { CloseButton };
