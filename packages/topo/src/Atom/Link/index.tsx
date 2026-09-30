import { Link as ChakraLink, type LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

import { useNextLinkHref } from "./useNextLinkHref";

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, ...props }, ref) => {
    const nextHref = useNextLinkHref(href);
    if (nextHref !== undefined) {
      return (
        <ChakraLink ref={ref} {...props} asChild>
          <NextLink href={nextHref}>{children}</NextLink>
        </ChakraLink>
      );
    }
    return (
      <ChakraLink ref={ref} href={href} {...props}>
        {children}
      </ChakraLink>
    );
  },
);
Link.displayName = "Link";

export type { LinkProps };
export { isInternalPageHref, useNextLinkHref } from "./useNextLinkHref";
