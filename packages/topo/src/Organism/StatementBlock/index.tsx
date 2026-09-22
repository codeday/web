import { Box, type BoxProps, Heading } from "@codeday/topo/Atom";
import React from "react";

import { type GradientName, gradientStops } from "../../Theme/vars/colors";
import { useGrainOverlay } from "../../Theme/vars/grain";
import type { Message } from "../../utils";

export type StatementBlockSize = "hero" | "section" | "closing";
export type StatementBlockActionStyle = "button" | "link";

export interface StatementBlockAction {
  label: Message;
  href: string;
  /** Overrides this size's default action treatment (hero/closing default to `"button"`, section defaults to `"link"`). */
  style?: StatementBlockActionStyle;
}

interface SizeSpec {
  headingFontSize: string;
  headingMeasure: string;
  bodyFontSize: string;
  bodyColor: string;
  bodyMeasure: string;
  defaultActionStyle: StatementBlockActionStyle;
}

const SIZES: Record<StatementBlockSize, SizeSpec> = {
  hero: {
    headingFontSize: "clamp({fontSizes.5xl}, 6.4vw, {fontSizes.6xl})",
    headingMeasure: "20ch",
    bodyFontSize: "lg",
    bodyColor: "gray.700",
    bodyMeasure: "46ch",
    defaultActionStyle: "button",
  },
  section: {
    headingFontSize: "clamp({fontSizes.3xl}, 3.4vw, {fontSizes.5xl})",
    headingMeasure: "28ch",
    bodyFontSize: "lg",
    bodyColor: "gray.700",
    bodyMeasure: "65ch",
    defaultActionStyle: "link",
  },
  closing: {
    headingFontSize: "clamp({fontSizes.3xl}, 2.8vw, {fontSizes.5xl})",
    headingMeasure: "24ch",
    bodyFontSize: "lg",
    bodyColor: "gray.700",
    bodyMeasure: "52ch",
    defaultActionStyle: "button",
  },
};

export interface StatementBlockProps extends Omit<BoxProps, "children"> {
  size: StatementBlockSize;
  as?: "h1" | "h2";
  /** May contain a gradient-fill span (e.g. `<GradientText>`) — this component just sizes/positions it, it doesn't care what's inside. */
  heading: React.ReactNode;
  body?: React.ReactNode[];
  actions?: StatementBlockAction[];
  /** Closing size only — wraps just the heading in a gradient field with grain, per the design language's rule that headings sit in the field and supporting text sits below it on the page ground. */
  field?: GradientName;
  /**
   * Colours this block's own actions (button gradient / link colour) —
   * not in the spec's literal prop list, but needed all the same: a
   * `section`-size instance sitting in a Hot Sauce or Chili Oil section (per
   * the page composition) needs its action to match that section's ramp,
   * not fall back to a hardcoded default. Defaults to `"hibiscus"`; `field`
   * (closing only) always wins when both are set, since a closing
   * statement's action should match its own field.
   */
  ramp?: GradientName;
}

function ActionButton({ label, href, ramp }: { label: Message; href: string; ramp: GradientName }) {
  const [, , deep, mid] = gradientStops[ramp];
  return (
    <Box
      as="a"
      display="inline-block"
      backgroundImage={`linear-gradient(110deg, ${deep}, ${mid})`}
      color="trueWhite"
      borderRadius="lg"
      padding="{spacing.3} {spacing.4.5}"
      fontSize="sm"
      fontWeight="600"
      textDecoration="none"
      {...({ href } as any)}
    >
      {label}
    </Box>
  );
}

function ActionLink({ label, href, ramp }: { label: Message; href: string; ramp: GradientName }) {
  return (
    <Box
      as="a"
      display="inline-flex"
      alignItems="center"
      gap="1.5"
      colorPalette={ramp}
      color="colorPalette.600"
      fontSize="sm"
      fontWeight="600"
      textDecoration="none"
      _hover={{ textDecoration: "underline" }}
      {...({ href } as any)}
    >
      {label}
      <Box as="span" aria-hidden="true">
        →
      </Box>
    </Box>
  );
}

function HeadingField({ ramp, children }: { ramp: GradientName; children: React.ReactNode }) {
  const { containerRef, canvas } = useGrainOverlay("statement-block-field");
  return (
    <Box
      ref={containerRef as any}
      position="relative"
      overflow="hidden"
      colorPalette={ramp}
      backgroundImage="linear-gradient(115deg, {colors.colorPalette.gradient.critical})"
      borderRadius="26% / 18%"
      padding="6"
      display="inline-block"
      color="trueWhite"
    >
      <Box position="relative" zIndex={1}>
        {children}
      </Box>
      {canvas}
    </Box>
  );
}

// The three statement sizes used across the homepage — hero, in-page
// section openers, and the closing statement. Left-aligned at every size;
// nothing on this page is centred.
export const StatementBlock = React.forwardRef<HTMLElement, StatementBlockProps>(
  ({ size, as = "h2", heading, body, actions, field, ramp = "hibiscus", ...props }, ref) => {
    const spec = SIZES[size];

    const headingEl = (
      <Heading
        as={as}
        margin="0"
        fontSize={spec.headingFontSize}
        fontWeight="700"
        maxWidth={spec.headingMeasure}
        textAlign="left"
      >
        {heading}
      </Heading>
    );

    return (
      <Box ref={ref as any} textAlign="left" {...props}>
        {field ? <HeadingField ramp={field}>{headingEl}</HeadingField> : headingEl}
        {body && body.length > 0 && (
          <Box marginTop="4" display="flex" flexDirection="column" gap="3">
            {body.map((paragraph, i) => (
              <Box
                key={i}
                margin="0"
                fontSize={spec.bodyFontSize}
                color={spec.bodyColor}
                maxWidth={spec.bodyMeasure}
              >
                {paragraph}
              </Box>
            ))}
          </Box>
        )}
        {actions && actions.length > 0 && (
          <Box marginTop="5" display="flex" flexWrap="wrap" gap="4" alignItems="center">
            {actions.map((action, i) => {
              const style = action.style ?? spec.defaultActionStyle;
              const actionRamp = field ?? ramp;
              return style === "button" ? (
                <ActionButton key={i} label={action.label} href={action.href} ramp={actionRamp} />
              ) : (
                <ActionLink key={i} label={action.label} href={action.href} ramp={actionRamp} />
              );
            })}
          </Box>
        )}
      </Box>
    );
  },
);
StatementBlock.displayName = "StatementBlock";
