import { baseLocale } from "@codeday/i18n/runtime";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import React from "react";

import { SQUIRCLE_CORNER_SHAPE } from "../../Theme/vars/cornerShape";
import { useGrainOverlay } from "../../Theme/vars/grain";
import type { Message } from "../../utils";

export type StatFormat = "integer" | "percent" | "usd" | "usd-compact";

export interface StatTrioItem {
  id: string;
  value: number | Message | null;
  format: StatFormat;
  label: Message;
  provenance?: Message;
  href?: string;
}

export interface StatTrioProps extends Omit<BoxProps, "children"> {
  items: StatTrioItem[];
}

// "$2.97M", not "$2,970,000" — for a figure this size, the exact dollar is
// noise; the magnitude is the point. Exported so a `Message`'s embedded
// figure (e.g. a provenance sentence quoting a comparison number) can match
// a `StatTrioItem`'s own `usd-compact` formatting exactly.
//
// `minimumFractionDigits` and `maximumFractionDigits` are both set to the
// same value on purpose: with only a maximum, compact notation's own
// trailing-zero-stripping rule (drop a fraction that rounds to `.0`) is
// implementation-defined, and Node's ICU and a browser's ICU don't always
// agree on it — same input, "$3.0B" on the server and "$3B" on the client,
// a hydration mismatch. Pinning both leaves the engine no rounding choice
// to make differently.
const COMPACT_USD_FRACTION_DIGITS = 2;

export function formatCompactUsd(value: number, digits?: number): string {
  return new Intl.NumberFormat(baseLocale, {
    style: "currency",
    currency: "USD",
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: digits ?? COMPACT_USD_FRACTION_DIGITS,
    maximumFractionDigits: digits ?? COMPACT_USD_FRACTION_DIGITS,
  }).format(value);
}

function formatValue(value: number, format: StatFormat): string {
  switch (format) {
    case "integer":
      return new Intl.NumberFormat(baseLocale, { maximumFractionDigits: 0 }).format(value);
    case "percent":
      return `${new Intl.NumberFormat(baseLocale, { maximumFractionDigits: 0 }).format(value)}%`;
    case "usd":
      return new Intl.NumberFormat(baseLocale, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
    case "usd-compact":
      return formatCompactUsd(value);
    default:
      return String(value);
  }
}

export const StatTrio = React.forwardRef<HTMLDivElement, StatTrioProps>(
  ({ items, ...props }, forwardedRef) => {
    const cells = items.filter((item) => item.value !== null);
    const { containerRef, canvas } = useGrainOverlay("stat-trio");

    if (cells.length === 0) return null;

    return (
      <Box
        ref={(node: HTMLDivElement | null) => {
          containerRef(node);
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef)
            (forwardedRef as React.RefObject<HTMLDivElement | null>).current = node;
        }}
        colorPalette="chilioil"
        position="relative"
        overflow="hidden"
        borderRadius="2xl"
        color="trueWhite"
        backgroundImage="radial-gradient(125% 135% at 20% 12%, {colors.colorPalette.gradient.critical})"
        css={{ cornerShape: SQUIRCLE_CORNER_SHAPE }}
        {...props}
      >
        <Box
          position="relative"
          zIndex={1}
          display="grid"
          gridTemplateColumns={{ base: "1fr", md: `repeat(${cells.length}, 1fr)` }}
          gap="0"
        >
          {cells.map((item, index) => (
            <Box key={item.id} position="relative" padding="6" minWidth="0">
              {index > 0 && (
                <>
                  <Box
                    position="absolute"
                    display={{ base: "none", md: "block" }}
                    left="0"
                    top="5"
                    bottom="5"
                    width="1px"
                    background="rgba(255,255,255,0.14)"
                  />
                  <Box
                    position="absolute"
                    display={{ base: "block", md: "none" }}
                    top="0"
                    left="0"
                    right="0"
                    height="1px"
                    background="rgba(255,255,255,0.14)"
                  />
                </>
              )}
              <Box
                fontSize={{ base: "clamp(28px, 9vw, 60px)", md: "clamp(40px, 5vw, 60px)" }}
                fontWeight="800"
                lineHeight="none"
                letterSpacing="tight"
                whiteSpace="nowrap"
                css={{ fontVariantNumeric: "tabular-nums" }}
              >
                {typeof item.value === "number" ? formatValue(item.value, item.format) : item.value}
              </Box>
              <Box marginTop="2" fontSize="md" color="trueWhite">
                {item.label}
              </Box>
              {item.provenance && (
                <Box
                  as={item.href ? "a" : "p"}
                  marginTop="2.5"
                  fontSize="xs"
                  color="rgba(255,255,255,0.72)"
                  textDecoration={item.href ? "underline" : undefined}
                  {...(item.href ? ({ href: item.href } as any) : {})}
                >
                  {item.provenance}
                </Box>
              )}
            </Box>
          ))}
        </Box>
        {canvas}
      </Box>
    );
  },
);
StatTrio.displayName = "StatTrio";
