import { Box, type BoxProps } from "@codeday/topo/Atom";
import { UiArrowRight } from "@codeday/topocons";
import React from "react";

import type { Message } from "../../utils";

export interface ActionLinkProps extends Omit<BoxProps, "children"> {
  label: Message;
  /** Omit when composing as a non-navigating trigger (e.g. inside a `PopoverTrigger asChild`). */
  href?: string;
}

// The house "text link with a trailing arrow" treatment — originally
// `RowList`'s own row-level action, lifted out here once `FormatCards`
// needed the identical thing at a different size (12.5px vs RowList's
// 13.5px) rather than copying the JSX a second time. Size, weight, and
// colour are all plain `BoxProps` overrides at the call site — the
// component itself only fixes the shape (label, gap, trailing arrow).
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
