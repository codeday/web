import { Card as ChakraCard, type CardRootProps } from "@chakra-ui/react";
import React from "react";

import { useFieldGrain } from "../../Theme/vars/grain";

export interface CardProps extends Omit<CardRootProps, "variant"> {
  variant?: "elevated" | "outline" | "subtle" | "plain";
}

// Defaults `colorPalette` to Hibiscus (.spec.md §4.5) — a section wrapper
// can set a different ramp, same convention as Button/Card's field.
export const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <ChakraCard.Root colorPalette="hibiscus" ref={ref} {...(props as any)} />
));
Card.displayName = "Card";

// The gradient field — grain overlay at opacity .5 (.spec.md §4.5), sized
// as 7% of the field's own width (not a fixed tile scaled via CSS
// background-size, which the browser's downsampling smooths into
// near-invisibility — see `useFieldGrain`).
export const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof ChakraCard.Header>>(
  ({ css, ...props }, forwardedRef) => {
    const { ref: grainRef, overlayCss } = useFieldGrain(0.07, 0.5, "card-header");
    return (
      <ChakraCard.Header
        ref={(node: HTMLDivElement | null) => {
          grainRef(node);
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as React.RefObject<HTMLDivElement | null>).current = node;
        }}
        css={{ ...overlayCss, ...(css as object) }}
        {...props}
      />
    );
  },
);
CardHeader.displayName = "CardHeader";

export const CardBody = ChakraCard.Body;
export const CardFooter = ChakraCard.Footer;
