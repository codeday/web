import { Box, Eyebrow } from "@codeday/topo/Atom";
import React from "react";

import type { Message } from "../../utils";
import { CONTENT_INSET, SectionSpacingContext } from "../Section";
import { Wash } from "../Wash";

export interface BandProps {
  tone: "page" | "tinted";
  label?: Message;
  children: React.ReactNode;
}

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
