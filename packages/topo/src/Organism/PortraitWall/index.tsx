import { Box, type BoxProps, Image } from "@codeday/topo/Atom";
import React from "react";

import { SQUIRCLE_CORNER_SHAPE } from "../../Theme/vars/cornerShape";

export interface PortraitWallPerson {
  id: string;
  name: string;
  then: string;
  now: string;
  photo: string;
  alt: string;
}

export interface PortraitWallSlot {
  id: string;
  people: PortraitWallPerson[];
  activeId: string;
}

export interface PortraitWallProps extends Omit<BoxProps, "children"> {
  slots: PortraitWallSlot[];
}

const CLAMP_THREE_LINES = {
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
};

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
