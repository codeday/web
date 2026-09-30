import { Box as ChakraBox, type BoxProps as ChakraBoxProps } from "@chakra-ui/react";
import { dereferenceDottedString } from "@codeday/topo/_utils";
import { useTheme } from "@codeday/topo/utils";
import NextLink from "next/link";
import React from "react";

import { useNextLinkHref } from "../Link/useNextLinkHref";

interface BoxProps extends ChakraBoxProps {
  grad?: string;
  visuallyHidden?: boolean;
}

const Box = React.forwardRef<HTMLElement, BoxProps>(({ grad, visuallyHidden, ...props }, ref) => {
  const theme = useTheme();
  const hiddenProps = {
    fontSize: "0",
    width: "1px",
    height: "1px",
    display: "inline-block",
    overflow: "hidden",
    border: "none",
    padding: "0",
    margin: "0",
  };
  const { as, children, href, ...rest } = props as ChakraBoxProps & { href?: string };
  const nextHref = useNextLinkHref(as === undefined || as === "a" ? href : undefined);
  const boxProps = {
    ref: ref as any,
    bgImg: grad ? dereferenceDottedString(grad, theme.colors?.grad) : undefined,
    ...rest,
    ...(visuallyHidden ? hiddenProps : {}),
  };

  if (nextHref !== undefined) {
    return (
      <ChakraBox {...boxProps} asChild>
        <NextLink href={nextHref}>{children}</NextLink>
      </ChakraBox>
    );
  }
  return (
    <ChakraBox as={as} {...(href !== undefined ? ({ href } as any) : {})} {...boxProps}>
      {children}
    </ChakraBox>
  );
});

export { Box, type BoxProps };
