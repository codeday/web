import { type ButtonProps } from "@chakra-ui/react";
import { type ComponentWithAs } from "@codeday/topo/_utils";
import { Button } from "@codeday/topo/Atom";
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import React from "react";

type ButtonAsLinkProps = ButtonProps & Omit<NextLinkProps, "passHref" | "legacyBehavior">;

export const NextButton: ComponentWithAs<"button", ButtonAsLinkProps> = (({ as, ref, ...props }: any) => {
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
        passHref
        legacyBehavior
      >
        <Button as={as} ref={ref} {...boxProps} />
      </NextLink>
    );
  }
  return <Button as={as} {...props} />;
}) as ComponentWithAs<"button", ButtonAsLinkProps>;
