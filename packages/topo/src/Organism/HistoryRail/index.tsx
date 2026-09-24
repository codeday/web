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
  month: number;
  title: Message | string;
}

export interface HistoryComparison {
  id: string;
  year: number;
  month?: number;
  title: Message;
}

export interface HistoryRailProps extends Omit<BoxProps, "children"> {
  startYear: number;
  startMonth?: number;
  events: HistoryEvent[];
  comparisons?: HistoryComparison[];
  ramp?: GradientName;
}

interface PlacedComparison extends HistoryComparison {
  index: number;
}

const NO_COMPARISONS: HistoryComparison[] = [];

const COMPARISON_ROW_HEIGHT = "{spacing.8}";
const COMPARISON_STRIP_HEIGHT = `calc(${COMPARISON_ROW_HEIGHT} + {spacing.6})`;

interface MonthTick {
  index: number;
  year: number;
  month: number;
  isYear: boolean;
  isHalf: boolean;
  isQuarter: boolean;
  isBi: boolean;
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
      marginTop="-7px"
      {...({ type: "button" } as any)}
    >
      {direction === "prev" ? <UiArrowLeft boxSize="4" /> : <UiArrowRight boxSize="4" />}
    </Box>
  );
}

export const HistoryRail = React.forwardRef<HTMLDivElement, HistoryRailProps>(
  (
    {
      startYear,
      startMonth = 1,
      events,
      comparisons = NO_COMPARISONS,
      ramp = "hibiscus",
      ...props
    },
    ref,
  ) => {
    const [windowStart, setWindowStart] = useState(0);
    const prefersReducedMotion = usePrefersReducedMotion();

    const [railStartYear, railStartMonth] = useMemo(() => {
      let year = startYear;
      let month = startMonth;
      for (const comparison of comparisons) {
        const comparisonMonth = comparison.month ?? 1;
        if (comparison.year < year || (comparison.year === year && comparisonMonth < month)) {
          year = comparison.year;
          month = comparisonMonth;
        }
      }
      return [year, month] as const;
    }, [startYear, startMonth, comparisons]);

    const ticks = useMemo(
      () => buildTicks(railStartYear, railStartMonth, events),
      [railStartYear, railStartMonth, events],
    );
    const yearLabels = useMemo(() => buildYearLabels(ticks), [ticks]);
    const markedTicks = useMemo(() => ticks.filter((t) => t.event), [ticks]);
    const span = Math.max(1, ticks.length - 1);

    const placedComparisons = useMemo<PlacedComparison[]>(
      () =>
        comparisons
          .map((comparison) => ({
            ...comparison,
            index: monthsBetween(
              railStartYear,
              railStartMonth,
              comparison.year,
              comparison.month ?? 1,
            ),
          }))
          .filter((comparison) => comparison.index >= 0 && comparison.index <= span)
          .sort((a, b) => a.index - b.index),
      [comparisons, railStartYear, railStartMonth, span],
    );
    const windowSize = 1;
    const maxStart = Math.max(0, markedTicks.length - windowSize);
    const clampedStart = Math.min(windowStart, maxStart);
    const windowEnd = clampedStart + windowSize;
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
      <Box ref={ref} colorPalette={ramp} {...props}>
        {placedComparisons.length > 0 && (
          <Box
            marginX="calc({sizes.8} + {spacing.3})"
            css={{ containerType: "inline-size", containerName: "historyRail" }}
          >
            <Box
              as="ul"
              position="relative"
              listStyleType="none"
              margin="0"
              padding="0"
              css={{
                height: COMPARISON_STRIP_HEIGHT,
                "& > li": {
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                },
                "& > li[data-middle='true']": { display: "none" },
                "@container historyRail (min-width: 440px)": {
                  "& > li[data-middle='true']": { display: "flex" },
                },
              }}
            >
              {placedComparisons.map((comparison, i) => {
                const isRightHalf = comparison.index / span >= 1 / 2;
                return (
                  <Box
                    as="li"
                    key={comparison.id}
                    {...({
                      "data-middle": (i > 0 && i < placedComparisons.length - 1) || undefined,
                    } as any)}
                    alignItems={isRightHalf ? "flex-end" : "flex-start"}
                    style={{
                      left: `${(comparison.index / span) * 100}%`,
                      transform: isRightHalf ? "translateX(-100%)" : undefined,
                    }}
                  >
                    <Box
                      as="span"
                      display="block"
                      fontSize="xs"
                      lineHeight="shorter"
                      color="gray.600"
                      textAlign={isRightHalf ? "right" : "left"}
                      css={{
                        width: "{sizes.20}",
                        "@container historyRail (min-width: 680px)": {
                          width: "{sizes.32}",
                        },
                      }}
                    >
                      <Box as="span" fontFamily="mono" color="gray.500">
                        {comparison.year}
                      </Box>{" "}
                      {comparison.title}
                    </Box>
                    <Box
                      as="i"
                      aria-hidden="true"
                      flex="1"
                      width="0"
                      borderLeft="sm"
                      borderColor="gray.300"
                    />
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        <Box display="flex" alignItems="flex-start" gap="3">
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

            <Box position="relative" height="3.5" marginTop="1.5">
              {yearLabels.map((label) => {
                const isFifth = (label.year - railStartYear) % 5 === 0;
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
                      as="i"
                      aria-hidden="true"
                      position="absolute"
                      bottom="100%"
                      height="calc({spacing.1.5} + {spacing.3.5} + {spacing.2.5})"
                      width="1.5px"
                      background="colorPalette.600"
                      style={{
                        left: isRightThird ? undefined : 0,
                        right: isRightThird ? 0 : undefined,
                        transform: isRightThird ? "translateX(50%)" : "translateX(-50%)",
                      }}
                    />
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
      </Box>
    );
  },
);
HistoryRail.displayName = "HistoryRail";
