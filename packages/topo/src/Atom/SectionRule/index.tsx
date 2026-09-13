import React from "react";

import { Box, type BoxProps } from "../Box";

export interface SectionRuleProps extends BoxProps {
  /** The mono index shown in the fixed-width margin column. */
  index?: React.ReactNode;
}

// .spec.md §4.9/§4.10 — Rule + margin index, the primary sectioning device
// (the quietest of the four in §4.10's order).
export const SectionRule = React.forwardRef<HTMLDivElement, SectionRuleProps>(
  ({ index, children, ...props }, ref) => (
    <Box
      ref={ref}
      display="flex"
      gap="14px"
      alignItems="baseline"
      paddingTop="9px"
      borderTop="1px solid"
      borderTopColor="current.text"
      {...props}
    >
      <Box as="span" flexShrink={0} width="34px" fontFamily="mono" fontSize="11px" color="current.textLight">
        {index}
      </Box>
      <Box flex="1">{children}</Box>
    </Box>
  ),
);
SectionRule.displayName = "SectionRule";
