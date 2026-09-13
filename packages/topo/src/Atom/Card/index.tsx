import { Card as ChakraCard, type CardRootProps } from "@chakra-ui/react";
import React from "react";

import { useGrainDataUri } from "../../Theme/vars/grain";

export interface CardProps extends Omit<CardRootProps, "variant"> {
  variant?: "elevated" | "outline" | "subtle" | "plain";
}

// Defaults `colorPalette` to Hibiscus (.spec.md §4.5) — a section wrapper
// can set a different ramp, same convention as Button/Card's field.
export const Card = React.forwardRef<HTMLDivElement, CardProps>((props, ref) => (
  <ChakraCard.Root colorPalette="hibiscus" ref={ref} {...(props as any)} />
));
Card.displayName = "Card";

// The gradient field — grain overlay at opacity .5 (.spec.md §4.5), which
// needs the generated data URI a static recipe can't produce.
export const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof ChakraCard.Header>>(
  ({ css, ...props }, ref) => {
    const grainUri = useGrainDataUri(32, "card-header");
    return (
      <ChakraCard.Header
        ref={ref}
        css={{
          ...(grainUri
            ? {
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url("${grainUri}")`,
                  backgroundSize: "7% auto",
                  opacity: 0.5,
                  mixBlendMode: "overlay",
                  pointerEvents: "none",
                },
              }
            : {}),
          ...(css as object),
        }}
        {...props}
      />
    );
  },
);
CardHeader.displayName = "CardHeader";

export const CardBody = ChakraCard.Body;
export const CardFooter = ChakraCard.Footer;
