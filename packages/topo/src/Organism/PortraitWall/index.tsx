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

function PortraitSlot({ slot }: { slot: PortraitWallSlot }) {
  return (
    <Box position="relative" aspectRatio="2/3">
      {slot.people.map((person) => {
        const active = person.id === slot.activeId;
        return (
          <Box
            key={person.id}
            position="absolute"
            inset="0"
            opacity={active ? 1 : 0}
            visibility={active ? "visible" : "hidden"}
            aria-hidden={!active}
            transition={
              active
                ? `opacity ${FADE_MS}ms ease-in-out`
                : `opacity ${FADE_MS}ms ease-in-out, visibility 0s linear ${FADE_MS}ms`
            }
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
