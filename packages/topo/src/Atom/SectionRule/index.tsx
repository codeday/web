import React from "react";

import { Box, type BoxProps } from "../Box";

export interface SectionRuleProps extends BoxProps {
  index?: React.ReactNode;
}

export const SectionRule = React.forwardRef<HTMLDivElement, SectionRuleProps>(
  ({ index, children, ...props }, ref) => (
    <Box
      ref={ref}
      display="flex"
      gap="3.5"
      alignItems="baseline"
      paddingTop="2.5"
      borderTop="sm"
      borderTopColor="black"
      {...props}
    >
      <Box
        as="span"
        flexShrink={0}
        width="9"
        fontFamily="mono"
        fontSize="xs"
        color="current.textLight"
      >
        {index}
      </Box>
      <Box flex="1">{children}</Box>
    </Box>
  ),
);
SectionRule.displayName = "SectionRule";
