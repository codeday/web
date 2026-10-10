import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
  CloseButton,
  Spinner,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

import { useGrainOverlay } from "../../Theme/vars/grain";
import { useNextLinkHref } from "../Link/useNextLinkHref";

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

function loadingSpinner(onGradient: boolean) {
  return (
    <Spinner
      width="4"
      height="4"
      borderWidth="2px"
      animationDuration="0.7s"
      css={{
        borderColor: onGradient ? "rgba(255,255,255,.35)" : "colorPalette.200",
        borderTopColor: onGradient ? "#fff" : "currentColor",
        animationTimingFunction: "linear",
        "@media (prefers-reduced-motion: reduce)": {
          animationDuration: "1.6s",
        },
      }}
    />
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, children, ...props }, forwardedRef) => {
    const isGradient = variant === undefined || variant === "primary" || variant === "icon";
    const { containerRef, canvas } = useGrainOverlay("button");
    const { as, href, ...rest } = props as ChakraButtonProps & { href?: string };
    const nextHref = useNextLinkHref(as === "a" ? href : undefined);

    const buttonProps = {
      colorPalette: "hibiscus",
      spinner: loadingSpinner(isGradient),
      variant: variant as any,
      ref: (node: HTMLButtonElement | null) => {
        if (isGradient) containerRef(node);
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef)
          (forwardedRef as React.RefObject<HTMLButtonElement | null>).current = node;
      },
      ...(rest as any),
    };

    if (nextHref !== undefined) {
      return (
        <ChakraButton {...buttonProps} asChild>
          <NextLink href={nextHref}>
            {children}
            {isGradient && canvas}
          </NextLink>
        </ChakraButton>
      );
    }
    return (
      <ChakraButton as={as} {...(href !== undefined ? ({ href } as any) : {})} {...buttonProps}>
        {children}
        {isGradient && canvas}
      </ChakraButton>
    );
  },
);
Button.displayName = "Button";

export { CloseButton };
