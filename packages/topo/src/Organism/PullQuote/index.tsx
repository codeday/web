import { Box, type BoxProps, Eyebrow } from "@codeday/topo/Atom";
import React from "react";

import { type GradientName, gradientStops } from "../../Theme/vars/colors";
import type { Message } from "../../utils";

export interface PullQuoteProps extends Omit<BoxProps, "children" | "role"> {
  ramp?: GradientName;
  /**
   * `"body"` (default) is the design language's small in-copy quote: italic,
   * 16px. `"feature"` is a large standalone quote — roman, not italic. At
   * body size italic reads as a quote; at display size across four ragged
   * lines it reads as decoration, so `"feature"` deliberately drops it.
   */
  size?: "body" | "feature";
  /** `"feature"` only — e.g. `MAINTAINER`, supplied by the caller so no English literal lives inside this component. */
  eyebrow?: Message;
  /**
   * `"feature"` only. Renders nothing at all when empty — no placeholder, no
   * empty state. Typed as `ReactNode` rather than `Message` — unlike
   * `eyebrow`, this is arbitrary caller-supplied content (e.g. a CMS
   * testimonial), not a fixed, localized UI label.
   */
  quote?: React.ReactNode;
  /** `"feature"` only. Overrides the blockquote's default display-size clamp — e.g. a smaller size when the quote shares a row with other content. */
  quoteFontSize?: BoxProps["fontSize"];
  name?: React.ReactNode;
  role?: React.ReactNode;
  project?: React.ReactNode;
  /** `"feature"` only. A second citation line below name/role/project — e.g. a testimonial's category (Partner/Mentor/Judge) — kept separate from `eyebrow`, which sits above the quote instead. */
  tag?: React.ReactNode;
  href?: string;
  /** `"body"` only — the quote content, as arbitrary children. */
  children?: React.ReactNode;
}

export const PullQuote = React.forwardRef<HTMLElement, PullQuoteProps>(
  (
    {
      ramp = "hibiscus",
      size = "body",
      eyebrow,
      quote,
      quoteFontSize = "clamp({fontSizes.2xl}, 3.6vw, {fontSizes.4xl})",
      name,
      role,
      project,
      tag,
      href,
      children,
      ...props
    },
    ref,
  ) => {
    if (size === "feature") {
      if (!quote) return null;
      return (
        <Box
          as="figure"
          ref={ref as any}
          colorPalette={ramp}
          margin="0"
          borderLeft="3px solid"
          borderLeftColor="colorPalette.600"
          paddingLeft="5"
          {...props}
        >
          {eyebrow && (
            <Eyebrow ramp={ramp} color="colorPalette.600" display="block" marginBottom="2.5">
              {eyebrow}
            </Eyebrow>
          )}
          <Box
            as="blockquote"
            margin="0"
            fontSize={quoteFontSize}
            fontWeight="500"
            fontStyle="normal"
            letterSpacing="normal"
            lineHeight="shorter"
            maxWidth="28ch"
            color="black"
          >
            {quote}
          </Box>
          <Box as="figcaption" marginTop="3.5" fontSize="sm" color="gray.600">
            <Box as="span" fontWeight="600" color="black">
              {name}
            </Box>
            {role && <>, {role}</>}
            {project &&
              (href ? (
                <>
                  {" "}
                  ·{" "}
                  <Box as="a" color="inherit" textDecoration="underline" {...({ href } as any)}>
                    {project}
                  </Box>
                </>
              ) : (
                <> · {project}</>
              ))}
            {tag && (
              <Box marginTop="0.5" color="gray.500">
                {tag}
              </Box>
            )}
          </Box>
        </Box>
      );
    }

    return (
      <Box
        as="blockquote"
        ref={ref as any}
        borderLeft={`3px solid ${gradientStops[ramp][3]}`}
        paddingLeft="3.5"
        fontSize="md"
        fontStyle="italic"
        {...props}
      >
        {children}
      </Box>
    );
  },
);
PullQuote.displayName = "PullQuote";
