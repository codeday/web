import { baseLocale } from "@codeday/i18n/runtime";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import React from "react";

import { SQUIRCLE_CORNER_SHAPE } from "../../Theme/vars/cornerShape";
import { useGrainOverlay } from "../../Theme/vars/grain";
import type { Message } from "../../utils";

export type StatFormat = "integer" | "percent" | "usd" | "usd-compact";

export interface StatTrioItem {
  id: string;
  /**
   * A real number is formatted via `Intl.NumberFormat` per `format`. A
   * `Message` (e.g. `"[N]"`, `"[N]%"`, `"$[N]"`) renders literally instead —
   * for a figure that's genuinely not decided yet, the same bracket-
   * placeholder convention used everywhere else on this page, rather than
   * `null`'s "this cell doesn't apply, omit it" meaning. Only `null` omits
   * the cell.
   */
  value: number | Message | null;
  format: StatFormat;
  label: Message;
  /**
   * The full attribution sentence, e.g. "Modelled by [institution], [year].
   * Read the study →" — when `href` is present the WHOLE provenance line
   * becomes the link (a single `Message` can't carry an embedded anchor
   * around just part of itself), underlined but staying at the same resting
   * 72% opacity — the spec is explicit that provenance is "never visually
   * suppressed" and always "white at 72%"; only the underline signals it's
   * a link.
   */
  provenance: Message;
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
      // `value` is read as the whole number to display (e.g. 62, not a
      // pre-divided 0.62 fraction) — the spec's example row shows the
      // literal figure as `[N]%`, and nothing in the prop type suggests a
      // fraction, so this formats the integer and appends a literal "%"
      // rather than using `Intl.NumberFormat`'s `style: "percent"`, which
      // would read 62 as 6200%.
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

// One field holding three cells, not three fields — the design language's
// stat component is a single radial Chili Oil card; three side by side
// would be three colour blocks, which it rules against. Borrows StatTile's
// exact field recipe (radial gradient, squircle corner, grain) rather than
// reusing StatTile itself, which owns a single number+label structure this
// three-cell layout doesn't fit.
export const StatTrio = React.forwardRef<HTMLDivElement, StatTrioProps>(
  ({ items, ...props }, forwardedRef) => {
    // A null-valued cell is omitted entirely, and the remaining cells widen to
    // fill the bar — filtering before laying out the grid means N surviving
    // cells become `repeat(N, 1fr)` automatically, no separate "widen" logic,
    // and rule placement is keyed off each cell's position in this filtered
    // array (so a surviving second cell never inherits the first cell's "no
    // rule" treatment).
    const cells = items.filter((item) => item.value !== null);
    const { containerRef, canvas } = useGrainOverlay("stat-trio");

    // Every value null (e.g. figures not yet supplied) — an empty gradient
    // field with nothing in it isn't a graceful degradation, it's just a
    // broken-looking box, so render nothing at all rather than that.
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
        // Capped at 6.36, same as StatTile — the uncapped full ramp puts the
        // white figure over the radial's lightest (sand) reach.
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
                  {/* Desktop: a 1px rule inset 20px from the field's own top/bottom edges, so it reads as a separator rather than a table border. */}
                  <Box
                    position="absolute"
                    display={{ base: "none", md: "block" }}
                    left="0"
                    top="5"
                    bottom="5"
                    width="1px"
                    background="rgba(255,255,255,0.14)"
                  />
                  {/* Mobile: the same rule rotated to a full-width horizontal line between stacked cells. */}
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
                // The spec's `clamp(40px, 5vw, 60px)` is sized for a desktop
                // 3-up row; in a single narrow mobile column a long currency
                // figure (e.g. "$340,000,000") can be just wide enough to wrap
                // mid-number at the 40px floor — a table of digits breaking
                // across three lines is exactly the "clips/breaks its figure"
                // failure the spec calls out, just in wrap form instead of
                // clip form. `nowrap` plus a lower, steeper-scaling floor below
                // `md` guarantees a single line at any realistic figure length
                // without touching the spec's own desktop value.
                fontSize={{ base: "clamp(28px, 9vw, 60px)", md: "clamp(40px, 5vw, 60px)" }}
                fontWeight="800"
                letterSpacing="tight"
                whiteSpace="nowrap"
                css={{ fontVariantNumeric: "tabular-nums" }}
              >
                {typeof item.value === "number" ? formatValue(item.value, item.format) : item.value}
              </Box>
              <Box marginTop="2" fontSize="md" color="trueWhite">
                {item.label}
              </Box>
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
            </Box>
          ))}
        </Box>
        {canvas}
      </Box>
    );
  },
);
StatTrio.displayName = "StatTrio";
