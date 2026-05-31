import { type ComponentWithAs } from "@codeday/topo/_utils";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import React from "react";

type BoxAsLinkProps = BoxProps & Omit<NextLinkProps, "passHref" | "legacyBehavior">;

export const NextBox: ComponentWithAs<"div", BoxAsLinkProps> = (({ as, ref, ...props }: any) => {
  if (as == "a") {
    const { href = "", replace, scroll, shallow, prefetch, locale, ...boxProps } = props;
    return (
      <NextLink
        href={href}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        prefetch={prefetch}
        locale={locale}
        legacyBehavior
        passHref
      >
        <Box as={as} ref={ref as any} {...boxProps} />
      </NextLink>
    );
  }
  return <Box as={as} {...(props as any)} />;
}) as ComponentWithAs<"div", BoxAsLinkProps>;
