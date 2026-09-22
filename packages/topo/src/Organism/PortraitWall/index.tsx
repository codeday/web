import { Box, type BoxProps, Image } from "@codeday/topo/Atom";
import React from "react";

import { SQUIRCLE_CORNER_SHAPE } from "../../Theme/vars/cornerShape";

export interface PortraitWallPerson {
  id: string;
  // `string`, not `Message` — every real person here comes from the CMS
  // (an alum's name and journey text aren't editorial UI copy translated
  // via the message catalogue, they're per-record data), so the branded
  // localized-string type doesn't apply.
  name: string;
  /** Where they started. Aim for ten words; clamped at three lines. */
  then: string;
  /** Where they are now. Same budget. */
  now: string;
  photo: string;
  alt: string;
}

export interface PortraitWallSlot {
  id: string;
  /**
   * Every person this slot may ever show, rotating over time. Each becomes
   * its own permanent, fully-rendered card — mounted once and never
   * updated — so swapping can never make a name jump to a new width or a
   * photo pop to a new size mid-transition, the way updating one card's
   * content in place would.
   */
  people: PortraitWallPerson[];
  /** `people[].id` of the one currently shown. */
  activeId: string;
}

export interface PortraitWallProps extends Omit<BoxProps, "children"> {
  slots: PortraitWallSlot[];
}

// Line-clamp at three lines — both lines, same treatment. Carried over
// verbatim from `ThenNowGrid`, which this replaces.
const CLAMP_THREE_LINES = {
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
};

// A slot's cards crossfade: the outgoing one and the incoming one overlap
// and transition opacity in opposite directions at once, rather than the
// slot fading out to the page background and back in.
const FADE_MS = 900;

function PortraitCard({ person }: { person: PortraitWallPerson }) {
  return (
    <Box
      position="relative"
      width="full"
      height="full"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      borderRadius="2xl"
      colorPalette="hibiscus"
      backgroundImage="linear-gradient(160deg, {colors.colorPalette.50} 0%, {colors.current.background} 100%)"
      css={{ cornerShape: SQUIRCLE_CORNER_SHAPE }}
    >
      <Box position="relative" zIndex="1" flexShrink="0" padding="4" paddingBottom="2">
        <Box fontSize="sm" fontWeight="700" color="black" letterSpacing="normal">
          {person.name}
        </Box>
        <Box marginTop="2" fontSize="xs" color="black" css={CLAMP_THREE_LINES}>
          {person.now}
        </Box>
        <Box marginTop="1" fontSize="xs" color="gray.700" css={CLAMP_THREE_LINES}>
          {person.then}
        </Box>
      </Box>
      {/* Flex's remaining space, not a guessed percentage — however many
          lines the text above wraps to, the cutout gets exactly what's
          left rather than risking an overlap. `cover` + top-aligned so a
          cramped slot crops the person's waist/legs rather than shrinking
          the whole photo down to keep their feet in frame — the face is
          what needs to stay visible, not the full body. */}
      <Box position="relative" flex="1" minHeight="0">
        <Image
          src={person.photo}
          alt={person.alt}
          width="full"
          height="full"
          css={{ objectFit: "cover", objectPosition: "top", display: "block" }}
        />
      </Box>
    </Box>
  );
}

interface CardTransition {
  fromId: string;
  toId: string;
  // "start": both cards are already mounted at their pre-transition opacity
  // (from=1, to=0) so the browser has something to transition FROM. "run":
  // the actual crossfade target (from=0, to=1) — set one frame later, since
  // setting both in the same tick as mounting would let the browser
  // coalesce them into a single paint and skip the animation entirely.
  phase: "start" | "run";
}

function PortraitSlot({ slot }: { slot: PortraitWallSlot }) {
  const [activeId, setActiveId] = React.useState(slot.activeId);
  const [transition, setTransition] = React.useState<CardTransition | null>(null);
  // Mirrors `activeId` for the comparison below without being an effect
  // dependency — depending on `activeId` itself would make this effect see
  // its own `setActiveId` call (in the cleanup timer) as a change to react
  // to on the next render, which doesn't re-trigger a transition here but
  // is exactly the kind of self-triggered re-run that's easy to get wrong.
  const activeIdRef = React.useRef(slot.activeId);

  React.useEffect(() => {
    if (slot.activeId === activeIdRef.current) return undefined;
    const fromId = activeIdRef.current;
    const toId = slot.activeId;
    activeIdRef.current = toId;
    setTransition({ fromId, toId, phase: "start" });
    const raf = requestAnimationFrame(() => setTransition({ fromId, toId, phase: "run" }));
    const cleanup = setTimeout(() => {
      setActiveId(toId);
      setTransition(null);
    }, FADE_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(cleanup);
    };
  }, [slot.activeId]);

  return (
    <Box position="relative" aspectRatio="2/3">
      {slot.people.map((person) => {
        let opacity = 0;
        let display = "none";
        if (transition && person.id === transition.fromId) {
          display = "block";
          opacity = transition.phase === "start" ? 1 : 0;
        } else if (transition && person.id === transition.toId) {
          display = "block";
          opacity = transition.phase === "start" ? 0 : 1;
        } else if (!transition && person.id === activeId) {
          display = "block";
          opacity = 1;
        }
        return (
          <Box
            key={person.id}
            position="absolute"
            inset="0"
            display={display}
            opacity={opacity}
            transition={`opacity ${FADE_MS}ms ease-in-out`}
          >
            <PortraitCard person={person} />
          </Box>
        );
      })}
    </Box>
  );
}

// One real photograph per person, both lines (where they started, where
// they are now) carried by type rather than a second archival photograph.
// No links, no hover reveal, no slider: both lines are always in the DOM. A
// person without a usable photograph doesn't go in the wall — there is no
// gradient stand-in — so `photo`/`alt` are both required, not optional, on
// every entry.
//
// `photo` must be a background-removed cutout (transparent PNG), not the
// raw snapshot — each card paints its own warm gradient field behind the
// person, so a photo with its own background would show a hard rectangle
// over that field instead of the person appearing to stand in it. That
// removal is an asset-pipeline step, not something this component attempts.
//
// Four slots, capped: 2 columns below `md` (a 2x2 grid — the portrait
// itself shrinks to fit two across rather than the grid ever dropping to
// one column), 4 columns — one full row — from `md` up. Never more than 4
// columns at any width: unlike a wall built to hold many more people, there
// is no "give it more room, it adds a column" density ladder here, because
// there is nothing past the fourth to fill one with.
export const PortraitWall = React.forwardRef<HTMLDivElement, PortraitWallProps>(
  ({ slots, ...props }, ref) => (
    <Box
      ref={ref}
      display="grid"
      gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
      gap={{ base: "3.5", sm: "5", md: "6", xl: "8" }}
      {...props}
    >
      {slots.map((slot) => (
        <PortraitSlot key={slot.id} slot={slot} />
      ))}
    </Box>
  ),
);
PortraitWall.displayName = "PortraitWall";
