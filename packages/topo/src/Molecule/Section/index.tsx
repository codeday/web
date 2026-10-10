import { Box, type BoxProps } from "@codeday/topo/Atom";
import React, { createContext, useContext } from "react";

import { type GradientName } from "../../Theme/vars/colors";

export type SectionSpacing = "default" | "compact";

export const SectionSpacingContext = createContext<SectionSpacing | undefined>(undefined);

const SPACING: Record<SectionSpacing, BoxProps["paddingBlock"]> = {
  default: { base: "16", xl: "24" },
  compact: { base: "10", xl: "14" },
};

export const CONTENT_INSET: BoxProps["paddingInline"] = { base: "5", md: "12", xl: "32" };

export interface SectionProps extends BoxProps {
  ramp: GradientName;
  spacing?: SectionSpacing;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ ramp, spacing, children, ...props }, ref) => {
    const contextSpacing = useContext(SectionSpacingContext);
    const resolvedSpacing = spacing ?? contextSpacing ?? "default";

    return (
      <Box
        as="section"
        ref={ref as any}
        colorPalette={ramp}
        paddingBlock={SPACING[resolvedSpacing]}
        paddingInline={CONTENT_INSET}
        {...props}
      >
        {children}
      </Box>
    );
  },
);
Section.displayName = "Section";
