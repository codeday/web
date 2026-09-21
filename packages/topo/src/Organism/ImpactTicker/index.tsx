import { Box, type BoxProps, Eyebrow, Image } from "@codeday/topo/Atom";
import { MarqueeRow } from "@codeday/topo/Molecule";
import React from "react";

import { type GradientName } from "../../Theme/vars/colors";
import { SQUIRCLE_CORNER_SHAPE } from "../../Theme/vars/cornerShape";
import type { Message } from "../../utils";

export interface ImpactItem {
  id: string;
  href?: string;
  // `project`/`student` accept a plain `string`, not just `Message` — a real
  // showcase project's name or an alum's name is per-record data from the
  // API, not editorial UI copy translated via the message catalogue, same
  // reasoning `PortraitWallPerson` documents for the same distinction.
  /** Project name, set in the eyebrow style (icon variant) or as bold overlay text (photo variant). */
  project: Message | string;
  student?: Message | string;
  // Icon variant: a one-line "impact" story with a small mark/favicon,
  // backed by `labs.contributions` — a real accepted PR's repository and
  // description, not editorial UI copy (see `Impact.tsx`).
  /** The hook. "Runs in 2 million homes." */
  impact?: Message | string;
  contribution?: Message | string;
  /** Project mark or favicon. Omit and the chip slot collapses. */
  mark?: string;
  markAlt?: Message;
  // Photo variant: a real showcase-project photo or event photo, used
  // instead of the icon+text layout when present.
  photo?: string;
  photoAlt?: Message;
  avatar?: string | null;
}

export interface ImpactTickerProps extends Omit<BoxProps, "children"> {
  ramp: GradientName;
  items: ImpactItem[];
  /** Default 2. */
  rows?: 1 | 2;
  /** Pixels per second, per row. Default [40, 46] — different on purpose, so the rows never line up. */
  speeds?: [number, number];
}

const DEFAULT_SPEEDS: [number, number] = [40, 46];

function splitIntoRows(items: ImpactItem[], rowCount: 1 | 2): ImpactItem[][] {
  if (rowCount === 1) return [items];
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}

// Photo variant: a real project/event photo (from `showcase`) with an
// overlay caption — used instead of the icon+text layout whenever
// `item.photo` is set. There's no curated "impact" narrative for these
// (see `Impact.tsx`), so the card leads with the photo itself instead.
function PhotoImpactCard({ item }: { item: ImpactItem }) {
  const content = (
    <Box
      width="{sizes.60}"
      flexShrink="0"
      height="40"
      position="relative"
      overflow="hidden"
      borderRadius="md"
      css={{ cornerShape: SQUIRCLE_CORNER_SHAPE }}
    >
      <Image
        src={item.photo}
        alt={item.photoAlt || ""}
        width="full"
        height="full"
        css={{ objectFit: "cover", display: "block" }}
      />
      <Box
        position="absolute"
        insetInline={0}
        bottom={0}
        padding="{spacing.2} {spacing.2.5}"
        backgroundImage="linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))"
      >
        {item.avatar && (
          <Image
            src={item.avatar}
            alt=""
            boxSize="4.5"
            borderRadius="full"
            display="inline-block"
            verticalAlign="middle"
            marginRight="1.5"
          />
        )}
        <Box as="span" fontSize="xs" fontWeight="700" color="trueWhite" verticalAlign="middle">
          {item.project}
        </Box>
        {item.student && (
          <Box fontSize="xs" color="whiteAlpha.800">
            {item.student}
          </Box>
        )}
      </Box>
    </Box>
  );
  if (!item.href) return content;
  return (
    <Box
      as="a"
      display="block"
      {...({ href: item.href, target: "_blank", rel: "noreferrer" } as any)}
    >
      {content}
    </Box>
  );
}

function ImpactCard({ item }: { item: ImpactItem }) {
  if (item.photo) return <PhotoImpactCard item={item} />;

  // Fixed to the same 232x164 the photo variant renders at, so a row never
  // jumps size card-to-card. Sized with a plain `width` rather than
  // `flex="0 0 ..."` — `flex-basis` only constrains an element that's
  // itself a direct flex item, and `MarqueeRow` can't guarantee that: its
  // own per-item wrapper is deliberately a plain (non-flex) box, not a
  // flex container, because nesting another flex context in there hits a
  // Firefox bug where `react-fast-marquee`'s `min-width: 100%` (forced
  // onto its track whenever `autoFill` is off) leaks into any flex
  // descendant's own measured width — see `MarqueeRow` for the full story.
  // A `width` isn't flex-context-dependent, so it holds regardless of what
  // MarqueeRow does structurally. Content that runs long is clipped rather
  // than overflowing, with a bottom fade (matching the card's own
  // background, same trick `PhotoImpactCard`'s caption overlay and
  // `MarqueeRow`'s edge fades use) so the cut reads as intentional.
  const linkProps = item.href
    ? ({ as: "a", href: item.href, target: "_blank", rel: "noreferrer" } as const)
    : {};

  return (
    <Box
      {...linkProps}
      width="{sizes.60}"
      flexShrink="0"
      height="40"
      position="relative"
      overflow="hidden"
      border="sm"
      borderColor="current.border"
      borderRadius="md"
      css={{ cornerShape: SQUIRCLE_CORNER_SHAPE }}
      background="current.bg"
      padding="3.5"
      display="flex"
      flexDirection="column"
      gap="2"
    >
      {item.mark && (
        <Box
          boxSize="8"
          overflow="hidden"
          borderRadius="26%"
          css={{ cornerShape: SQUIRCLE_CORNER_SHAPE }}
        >
          <Image
            src={item.mark}
            alt={item.markAlt}
            css={{ objectFit: "contain" }}
            width="full"
            height="full"
          />
        </Box>
      )}
      {item.impact && (
        <Box fontSize="sm" fontWeight="700" color="black">
          {item.impact}
        </Box>
      )}
      <Eyebrow color="colorPalette.600">{item.project}</Eyebrow>
      {item.contribution && (
        <Box fontSize="xs" color="gray.700">
          {item.contribution}
        </Box>
      )}
      {item.student && (
        <Box fontSize="xs" fontWeight="600" color="black">
          {item.student}
        </Box>
      )}
      <Box
        position="absolute"
        insetInline={0}
        bottom={0}
        height="7"
        backgroundImage="linear-gradient(to top, {colors.current.bg}, transparent)"
        pointerEvents="none"
      />
    </Box>
  );
}

// A thin wrapper around the shared `MarqueeRow` track — see that component
// for the looping/accessibility/reduced-motion mechanics.
function TickerRow({
  items,
  speed,
  reverse,
}: {
  items: ImpactItem[];
  speed: number;
  reverse: boolean;
}) {
  return (
    <MarqueeRow
      items={items.map((item) => (
        <ImpactCard key={item.id} item={item} />
      ))}
      speed={speed}
      reverse={reverse}
    />
  );
}

// A moving strip of what students actually shipped — the unit is "what the
// project does in the world, what changed, who did it", not "a field a
// student learned" (the old `RowList variant="fields"`, which this
// replaces). Two rows by default, scrolling opposite directions at
// different speeds on purpose (so they never line up), each pausable by
// hover or keyboard focus, each degrading to a plain horizontal scroller
// under `prefers-reduced-motion`.
export const ImpactTicker = React.forwardRef<HTMLDivElement, ImpactTickerProps>(
  ({ ramp, items, rows = 2, speeds = DEFAULT_SPEEDS, ...props }, ref) => {
    const rowItems = splitIntoRows(items, rows);
    return (
      <Box ref={ref} colorPalette={ramp} {...props}>
        <Box display="flex" flexDirection="column" gap="4">
          {rowItems.map((slice, i) => (
            <TickerRow key={i} items={slice} speed={speeds[i]} reverse={i === 1} />
          ))}
        </Box>
      </Box>
    );
  },
);
ImpactTicker.displayName = "ImpactTicker";
