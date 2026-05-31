import { type LinkProps } from "@chakra-ui/react";
import { Link } from "@codeday/topo/Atom";
import NextJsLink, { type LinkProps as NextJsLinkProps } from "next/link";
import React from "react";

type NextLinkProps = LinkProps & Omit<NextJsLinkProps, "passHref" | "legacyBehavior">;

export const NextLink = (
  ({ href = "", replace, scroll, shallow, prefetch, locale, ref, ...props }: NextLinkProps & { ref?: React.Ref<HTMLAnchorElement> }) => {
    return (
      <NextJsLink
        href={href}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        prefetch={prefetch}
        locale={locale}
        passHref
        legacyBehavior
      >
        <Link ref={ref as any} {...(props as any)} />
      </NextJsLink>
    );
  }
);
