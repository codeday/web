import { Box, type BoxProps } from "@codeday/topo/Atom";
import React, { createContext, useContext } from "react";

import { type GradientName } from "../../Theme/vars/colors";

export type SectionSpacing = "default" | "compact";

// Set by `Band` — every `Section` inside a `tone="tinted"` band runs at
// compact spacing without every call site having to remember to ask for it.
// An explicit `spacing` prop on `Section` itself still wins.
export const SectionSpacingContext = createContext<SectionSpacing | undefined>(undefined);

const SPACING: Record<SectionSpacing, BoxProps["paddingBlock"]> = {
  default: { base: "16", xl: "24" },
  compact: { base: "10", xl: "14" },
};

// The page's standard content inset.
export const CONTENT_INSET: BoxProps["paddingInline"] = { base: "5", md: "12", xl: "32" };

export interface SectionProps extends BoxProps {
  /** Brand ramp driving this section's colour. */
  ramp: GradientName;
  /** Vertical rhythm. Defaults to `"compact"` automatically inside a `tone="tinted"` `Band`. */
  spacing?: SectionSpacing;
}

// Section headers never live in a side margin/gutter — that treatment is
// retired. A heading belongs in the section's own content column, same as
// everything else in it.
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
