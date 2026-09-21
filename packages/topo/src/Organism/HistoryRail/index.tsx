import { getLocale } from "@codeday/i18n/runtime";
import { Box, type BoxProps } from "@codeday/topo/Atom";
import { UiArrowLeft, UiArrowRight } from "@codeday/topocons";
import React, { useMemo, useState } from "react";

import { type GradientName } from "../../Theme/vars/colors";
import { usePrefersReducedMotion } from "../../utils";
import type { Message } from "../../utils";

export interface HistoryEvent {
  id: string;
  year: number;
  /** 1-indexed. */
  month: number;
  /** Catalogue copy uses `Message`; CMS-sourced titles arrive as plain strings. */
  title: Message | string;
}

export interface HistoryRailProps extends Omit<BoxProps, "children"> {
  startYear: number;
  /** 1-indexed. Default 1. */
  startMonth?: number;
  events: HistoryEvent[];
  /** Default "hibiscus". */
  ramp?: GradientName;
}

interface MonthTick {
  index: number;
  year: number;
  month: number;
  isYear: boolean; // i % 12 === 0
  isHalf: boolean; // i % 6 === 0
  isQuarter: boolean; // i % 3 === 0
  isBi: boolean; // i % 2 === 0
  event?: HistoryEvent;
}

interface YearLabel {
  year: number;
  index: number;
  isEdge: boolean;
}

function monthsBetween(
  fromYear: number,
  fromMonth: number,
  toYear: number,
  toMonth: number,
): number {
  return (toYear - fromYear) * 12 + (toMonth - fromMonth);
}

function buildTicks(startYear: number, startMonth: number, events: HistoryEvent[]): MonthTick[] {
  const now = new Date();
  const span = monthsBetween(startYear, startMonth, now.getFullYear(), now.getMonth() + 1);
  const eventsByOffset = new Map<number, HistoryEvent>();
  for (const event of events) {
    const offset = monthsBetween(startYear, startMonth, event.year, event.month);
    if (offset >= 0 && offset <= span) eventsByOffset.set(offset, event);
  }

  const ticks: MonthTick[] = [];
  for (let i = 0; i <= span; i += 1) {
    const totalMonth = startMonth - 1 + i;
    const year = startYear + Math.floor(totalMonth / 12);
    const month = (totalMonth % 12) + 1;
    ticks.push({
      index: i,
      year,
      month,
      isYear: i % 12 === 0,
      isHalf: i % 6 === 0,
      isQuarter: i % 3 === 0,
      isBi: i % 2 === 0,
      event: eventsByOffset.get(i),
    });
  }
  return ticks;
}

function buildYearLabels(ticks: MonthTick[]): YearLabel[] {
  const labels: YearLabel[] = [];
  let lastYear: number | null = null;
  ticks.forEach((tick, i) => {
    if (tick.year !== lastYear) {
      labels.push({ year: tick.year, index: i, isEdge: false });
      lastYear = tick.year;
    }
  });
  if (labels.length > 0) {
    labels[0].isEdge = true;
    labels[labels.length - 1].isEdge = true;
    // Every fifth year, same cadence `YearRail` used — the ones in between
    // stay in the DOM (so nothing shifts when they're revealed) but only
    // show once the rail is wide enough (`historyRail` >= 400px).
  }
  return labels;
}

function NavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <Box
      as="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Show earlier events" : "Show later events"}
      flex="0 0 auto"
      display="flex"
      alignItems="center"
      justifyContent="center"
      boxSize="8"
      borderRadius="full"
      border="sm"
      borderColor="current.border"
      background="current.bg"
      color="black"
      cursor={disabled ? "default" : "pointer"}
      opacity={disabled ? 0.35 : 1}
      // The row holding this button top-aligns (see `alignItems="flex-start"`
      // below) against the whole rail column, which is much taller than just
      // the tick bar (year scale + event labels sit below it). Without this
      // offset the button centers on that full height and ends up hanging in
      // the text area instead of beside the bar. -7px = (18px tick-row height
      // - 32px button height) / 2, i.e. centered on the tick row alone.
      marginTop="-7px"
      {...({ type: "button" } as any)}
    >
      {direction === "prev" ? <UiArrowLeft boxSize="4" /> : <UiArrowRight boxSize="4" />}
    </Box>
  );
}

// The history rail: an always-in-DOM month-tick strip (density set by a
// container query, see below), a year scale, and a paged window of
// labelled events. Replaces `YearRail`'s one-identical-tick-per-year rail,
// which said "many years" and nothing else.
//
// Placing this beside other content, and picking which side, is the
// caller's layout concern, not this component's — it only renders the
// rail itself. `historyRail` (the container query name below) tracks this
// component's own width so tick density stays independent of viewport
// width regardless of how a caller lays it out.
export const HistoryRail = React.forwardRef<HTMLDivElement, HistoryRailProps>(
  ({ startYear, startMonth = 1, events, ramp = "hibiscus", ...props }, ref) => {
    const [windowStart, setWindowStart] = useState(0);
    const prefersReducedMotion = usePrefersReducedMotion();

    const ticks = useMemo(
      () => buildTicks(startYear, startMonth, events),
      [startYear, startMonth, events],
    );
    const yearLabels = useMemo(() => buildYearLabels(ticks), [ticks]);
    const markedTicks = useMemo(() => ticks.filter((t) => t.event), [ticks]);
    const span = Math.max(1, ticks.length - 1);

    // Exactly one event label shown at a time — real milestones cluster
    // unevenly in time (unlike the evenly-spaced placeholders this rail
    // originally shipped with), so two labels windowed together can land
    // close enough on the rail to visually overlap. One at a time sidesteps
    // that regardless of how dense a given stretch of history is.
    const windowSize = 1;
    const maxStart = Math.max(0, markedTicks.length - windowSize);
    const clampedStart = Math.min(windowStart, maxStart);
    const windowEnd = clampedStart + windowSize;
    // The set of month-indices (not array positions) belonging to events
    // in the CURRENT window — checked against directly by both the tick
    // row (dims out-of-window marks to 45%) and the label row below.
    const windowedTickIndices = useMemo(
      () => new Set(markedTicks.slice(clampedStart, windowEnd).map((t) => t.index)),
      [markedTicks, clampedStart, windowEnd],
    );

    const locale = getLocale();
    const formatDate = (year: number, month: number) =>
      new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
        new Date(year, month - 1, 1),
      );

    return (
      <Box
        ref={ref}
        colorPalette={ramp}
        display="flex"
        // Top-aligned, not centered: the rail column below is much taller
        // than the tick bar alone (year scale + event labels stack under
        // it), and centering against that whole height is what pushed the
        // arrows down into the label text's space. See `NavButton`'s own
        // `marginTop` for how it re-centers on just the bar.
        alignItems="flex-start"
        gap="3"
        {...props}
      >
        <NavButton
          direction="prev"
          onClick={() => setWindowStart(Math.max(0, clampedStart - windowSize))}
          disabled={clampedStart <= 0}
        />

        <Box
          flex="1"
          minWidth="0"
          css={{
            containerType: "inline-size",
            containerName: "historyRail",
          }}
        >
          {/* Ticks — always in the DOM, `aria-hidden` throughout: this row
            carries no text, the scale and labels below carry the
            information a reader needs. */}
          <Box
            aria-hidden="true"
            position="relative"
            height="4.5"
            css={{
              "& > i": {
                display: "none",
                position: "absolute",
                top: 0,
                width: "1px",
                height: "2.5",
                // `colorPalette.300` (mode-aware, unlike the old
                // `deep/20` alpha-blend) stays a faint-but-visible mark
                // in both light and dark mode.
                background: "colorPalette.300",
                transform: "translateX(-50%)",
                fontStyle: "normal",
              },
              "& > i[data-year='true'], & > i[data-event='true']": { display: "block" },
              "& > i[data-event='true']": {
                height: "4.5",
                width: "1.5px",
                background: "colorPalette.600",
              },
              "@container historyRail (min-width: 260px)": {
                "& > i[data-half='true']": { display: "block" },
              },
              "@container historyRail (min-width: 440px)": {
                "& > i[data-quarter='true']": { display: "block" },
              },
              "@container historyRail (min-width: 680px)": {
                "& > i[data-bi='true']": { display: "block" },
              },
            }}
          >
            {ticks.map((tick) => (
              <Box
                as="i"
                key={tick.index}
                style={{ left: `${(tick.index / span) * 100}%` }}
                {...({
                  "data-year": tick.isYear || undefined,
                  "data-half": tick.isHalf || undefined,
                  "data-quarter": tick.isQuarter || undefined,
                  "data-bi": tick.isBi || undefined,
                  "data-event": !!tick.event || undefined,
                } as any)}
                opacity={tick.event && !windowedTickIndices.has(tick.index) ? 0.45 : 1}
              />
            ))}
          </Box>

          {/* Year scale — first and last always shown; the fifth-year
            cadence in between only once the rail is wide enough. */}
          <Box position="relative" height="3.5" marginTop="1.5">
            {yearLabels.map((label) => {
              const isFifth = (label.year - startYear) % 5 === 0;
              return (
                <Box
                  as="span"
                  key={label.year}
                  position="absolute"
                  top="0"
                  fontFamily="mono"
                  fontSize="2xs"
                  color="gray.500"
                  style={{
                    left: `${(label.index / span) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                  css={
                    label.isEdge
                      ? undefined
                      : {
                          display: "none",
                          "@container historyRail (min-width: 400px)": isFifth
                            ? { display: "inline" }
                            : undefined,
                        }
                  }
                >
                  {label.year}
                </Box>
              );
            })}
          </Box>

          {/* Event labels — every event has a slot, absolutely positioned
            at its own tick (flush with the tick, not centered on it); only
            the current window's slots are opaque. `opacity`, never
            `display`/`visibility`, so an off-window title stays in the
            accessible tree (still announced once) even while visually
            de-emphasised. In the rightmost third of the rail a label's LEFT
            edge would run past the rail (and often the page) before its
            text does, so those flip to right-aligned — anchored, and
            growing, the other way — instead. */}
          <Box aria-live="polite" position="relative" minHeight="14" marginTop="2.5">
            {markedTicks.map((tick, i) => {
              const inWindow = i >= clampedStart && i < windowEnd;
              const isRightThird = tick.index / span >= 2 / 3;
              return (
                <Box
                  key={tick.event!.id}
                  position="absolute"
                  top="0"
                  width="40"
                  style={{
                    left: `${(tick.index / span) * 100}%`,
                    transform: isRightThird ? "translateX(-100%)" : undefined,
                  }}
                  opacity={inWindow ? 1 : 0}
                  css={{
                    transition: prefersReducedMotion ? "none" : "opacity 200ms ease",
                    pointerEvents: inWindow ? "auto" : "none",
                  }}
                >
                  <Box
                    fontSize="xs"
                    fontWeight="600"
                    color="colorPalette.600"
                    textAlign={isRightThird ? "right" : "left"}
                  >
                    {formatDate(tick.year, tick.month)}
                  </Box>
                  <Box
                    marginTop="0.5"
                    fontSize="sm"
                    color="black"
                    textAlign={isRightThird ? "right" : "left"}
                  >
                    {tick.event!.title}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        <NavButton
          direction="next"
          onClick={() => setWindowStart(Math.min(maxStart, clampedStart + windowSize))}
          disabled={clampedStart >= maxStart}
        />
      </Box>
    );
  },
);
HistoryRail.displayName = "HistoryRail";
