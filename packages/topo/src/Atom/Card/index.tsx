import { Card as ChakraCard, type CardRootProps } from "@chakra-ui/react";
import React from "react";

import { useGrainOverlay } from "../../Theme/vars/grain";

export interface CardProps extends Omit<CardRootProps, "variant"> {
  variant?: "elevated" | "outline" | "subtle" | "plain";
}

// Defaults `colorPalette` to Hibiscus — a section wrapper
// can set a different ramp, same convention as Button/Card's field.
export const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <ChakraCard.Root colorPalette="hibiscus" ref={ref} {...(props as any)} />
));
Card.displayName = "Card";

// The gradient field's grain overlay — painted onto a canvas sized to the
// header, same as
// Wash/StatTile/Badge/EmptyState.
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof ChakraCard.Header>
>(({ children, ...props }, forwardedRef) => {
  const { containerRef, canvas } = useGrainOverlay("card-header");
  return (
    <ChakraCard.Header
      ref={(node: HTMLDivElement | null) => {
        containerRef(node);
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef)
          (forwardedRef as React.RefObject<HTMLDivElement | null>).current = node;
      }}
      {...props}
    >
      {children}
      {canvas}
    </ChakraCard.Header>
  );
});
CardHeader.displayName = "CardHeader";

export const CardBody = ChakraCard.Body;
export const CardFooter = ChakraCard.Footer;
