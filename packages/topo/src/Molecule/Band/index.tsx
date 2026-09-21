import { Box, Eyebrow } from "@codeday/topo/Atom";
import React from "react";

import type { Message } from "../../utils";
import { CONTENT_INSET, SectionSpacingContext } from "../Section";
import { Wash } from "../Wash";

export interface BandProps {
  tone: "page" | "tinted";
  /**
   * `tone="tinted"` only. The margin index only works as a *change* — a
   * word repeated on every section it touches stops being a signal and
   * becomes decoration. The tinted band is ONE region, so it takes ONE
   * label, once, at its own top — not a gutter, not a per-`Section` index.
   */
  label?: Message;
  children: React.ReactNode;
}

// The one layout primitive this page needs beyond `Section` itself.
// `tinted` is a SINGLE full-bleed field spanning every section given to it —
// one element, not one per section, so there's no seam between them — filled
// with `Wash`'s own tint fill (Hibiscus 100, a solid mode-aware wash —
// exactly what `shape="tint"` already computes) rather than reimplementing
// that here. A 1px Hibiscus 300 rule separates consecutive
// sections, and every `Section` inside runs at compact spacing via context.
export const Band = React.forwardRef<HTMLDivElement, BandProps>(
  ({ tone, label, children }, ref) => {
    if (tone === "page") {
      return (
        <Box ref={ref as any} as="div">
          {children}
        </Box>
      );
    }

    const items = React.Children.toArray(children);
    return (
      <Wash ref={ref} ramp="hibiscus" shape="tint">
        {label && (
          <Box paddingInline={CONTENT_INSET} paddingBlockStart={{ base: "8", xl: "12" }}>
            <Eyebrow ramp="hibiscus" color="colorPalette.600">
              {label}
            </Eyebrow>
          </Box>
        )}
        <SectionSpacingContext.Provider value="compact">
          {items.map((child, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Box height="1px" background="hibiscus.300" />}
              {child}
            </React.Fragment>
          ))}
        </SectionSpacingContext.Provider>
      </Wash>
    );
  },
);
Band.displayName = "Band";
