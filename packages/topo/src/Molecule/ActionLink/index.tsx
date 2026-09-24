import { Box, type BoxProps } from "@codeday/topo/Atom";
import { UiArrowRight } from "@codeday/topocons";
import React from "react";

import type { Message } from "../../utils";

export interface ActionLinkProps extends Omit<BoxProps, "children"> {
  label: Message;
  href?: string;
}

export const ActionLink = React.forwardRef<HTMLAnchorElement, ActionLinkProps>(
  ({ label, href, ...props }, ref) => (
    <Box
      as="a"
      ref={ref as any}
      display="inline-flex"
      alignItems="center"
      gap="1"
      fontSize="sm"
      fontWeight="600"
      color="colorPalette.600"
      textDecoration="none"
      _hover={{ textDecoration: "underline" }}
      {...(props as any)}
      {...(href !== undefined ? ({ href } as any) : {})}
    >
      <Box as="span">{label}</Box>
      <UiArrowRight boxSize="3" flexShrink={0} />
    </Box>
  ),
);
ActionLink.displayName = "ActionLink";
