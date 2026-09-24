import { Box, type BoxProps } from "@codeday/topo/Atom";
import React from "react";
import Marquee from "react-fast-marquee";

export interface MarqueeRowProps extends Omit<BoxProps, "children"> {
  items: React.ReactNode[];
  speed?: number;
  reverse?: boolean;
  gap?: string;
}

const MIN_RENDERED_ITEMS = 24;

// One marquee row, built on `react-fast-marquee` — the same library the
// pre-rewrite `Index/Community` used for this exact ticker — rather than a
// hand-rolled CSS animation. A hand-rolled two-copy track only loops
// seamlessly when one copy is already at least as wide as the row itself;
// short on items, or a wide enough viewport, and the track runs out of
// content before the loop wraps, so the row visibly stops and empties out
// once a cycle instead of looping.
//
// `react-fast-marquee`'s own answer to that is `autoFill`, which
// re-measures its content against its container via `ResizeObserver` and
// repeats the children however many times are needed. That sounds right,
// but is a long-standing, unfixed bug in the library
// (justin-chu/react-fast-marquee #72, #87): anything that nudges the
// measured width after mount — a card's image finishing its load a couple
// seconds in, for instance — makes it recompute a *smaller* duplicate count
// than before, and the row is left with a gap (or empties out entirely)
// until the animation happens to wrap back around. So instead we duplicate
// `items` ourselves, once, up front, to a length that's guaranteed to
// outlast any real viewport, and never ask the library to re-measure.
//
// Each item is wrapped in its own single-child `Box` with a trailing
// margin (rather than all of them sharing one flex wrapper with a `gap`)
// and passed to `Marquee` as separate children — not as a single child
// containing all of them. `react-fast-marquee` forces `min-width: 100%`
// onto its own track element whenever `autoFill` is off (see above), and
// in Firefox specifically, nesting one more flex container inside that —
// our old single shared `Box` holding all of a row's items — let that
// constraint leak into it: the shared `Box`'s own measured width would
// inflate to match the track's, leaving several thousand pixels of dead
// space after the real cards instead of looping into the repeat. Passing
// items as siblings, each in its own small wrapper, is exactly the
// structure the pre-rewrite `Index/Community` used (a plain array of
// `Card`s, each with its own `mr`), and it doesn't hit this: there's no
// single intermediate flex container sized across every item in the row
// for the leak to land in, only many tiny ones, each sized to one card.
//
// Each wrapper is a plain (non-flex) box, deliberately — making it
// `display="flex"` so a fixed-size item inside it (e.g. `ImpactCard`, sized
// via `flex="0 0 ..."`) would still be a *direct* flex item just
// reintroduces the same Firefox bug one level down: now the wrapper itself
// is a flex container nested under the track's `min-width: 100%`, and its
// width inflates the same way the old shared wrapper's did. So items that
// need a fixed size have to size themselves with a plain `width` instead
// of `flex-basis` — see `ImpactCard`/`PhotoImpactCard` in `ImpactTicker`.
export const MarqueeRow = React.forwardRef<HTMLDivElement, MarqueeRowProps>(
  ({ items, speed = 50, reverse = false, gap = "4", ...props }, ref) => {
    const repeatCount = items.length > 0 ? Math.ceil(MIN_RENDERED_ITEMS / items.length) : 1;
    const repeatedItems = Array.from({ length: repeatCount }, () => items).flat();

    return (
      <Box
        ref={ref}
        position="relative"
        overflow="hidden"
        css={{
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "14",
            zIndex: 1,
            pointerEvents: "none",
          },
          "&::before": {
            left: 0,
            backgroundImage: "linear-gradient(90deg, {colors.current.bg}, transparent)",
          },
          "&::after": {
            right: 0,
            backgroundImage: "linear-gradient(270deg, {colors.current.bg}, transparent)",
          },
          "@media (prefers-reduced-motion: reduce)": {
            overflowX: "auto",
            "& .rfm-marquee": { animation: "none !important" },
          },
        }}
        {...props}
      >
        <Marquee speed={speed} direction={reverse ? "right" : "left"} pauseOnHover>
          {repeatedItems.map((item, i) => (
            <Box key={i} flexShrink={0} marginInlineEnd={gap}>
              {item}
            </Box>
          ))}
        </Marquee>
      </Box>
    );
  },
);
MarqueeRow.displayName = "MarqueeRow";
