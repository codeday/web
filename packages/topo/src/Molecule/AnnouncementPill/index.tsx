import * as m from "@codeday/i18n/messages";
import { Badge, Box, type BoxProps } from "@codeday/topo/Atom";
import React from "react";

import { gradientStops } from "../../Theme/vars/colors";

export interface AnnouncementPillProps extends Omit<BoxProps, "children"> {
  href: string;
  /** Plain `string`, not `Message` — the usual source is CMS copy that changes without a deploy. */
  text: string;
  /** Decorative lead-in label. Defaults to "New". */
  chip?: string;
}

// Hibiscus's 20/40/62% stops, not `badgeGradient` or any of the prebuilt
// `gradient.*` stop lists — none of those runs exactly 20→62%. Composed from
// `gradientStops` the same way StatementBlock's hero button is, so it tracks
// the ramp if it's ever retuned. White text clears 6:1 against the lightest
// (62%) stop.
const [, CHIP_FROM, CHIP_MID, CHIP_TO] = gradientStops.hibiscus;
const CHIP_GRADIENT = `linear-gradient(115deg, ${CHIP_FROM} 0%, ${CHIP_MID} 50%, ${CHIP_TO} 100%)`;

// A one-line link pill (chip + text + arrow) that sits above a heading. The
// whole pill is the link; the chip and arrow are aria-hidden so the
// accessible name is the text alone. It never wraps — on narrow screens the
// text truncates, and the chip/arrow keep their size.
export const AnnouncementPill = React.forwardRef<HTMLAnchorElement, AnnouncementPillProps>(
  ({ href, text, chip, ...props }, ref) => (
    <Box
      as="a"
      ref={ref as any}
      display="inline-flex"
      alignItems="center"
      gap="2.5"
      maxWidth={{ base: "full", sm: "60ch" }}
      paddingBlock="1"
      paddingInlineStart="1"
      paddingInlineEnd={{ base: "3", sm: "3.5" }}
      border="sm"
      borderColor="gray.300"
      borderRadius="full"
      bg="hotsauce.50"
      color="hibiscus.900"
      fontSize={{ base: "xs", sm: "sm" }}
      fontWeight="medium"
      lineHeight="shorter"
      whiteSpace="nowrap"
      textDecoration="none"
      transitionProperty="border-color"
      transitionDuration="fast"
      _hover={{ borderColor: "gray.400" }}
      _focusVisible={{ outline: "0", boxShadow: "0 0 0 3px {colors.hibiscus.300}" }}
      css={{
        "&:hover [data-pill-arrow]": { transform: "translateX({spacing.0.5})" },
        "@media (prefers-reduced-motion: reduce)": {
          transition: "none",
          "& [data-pill-arrow]": { transition: "none", transform: "none !important" },
        },
      }}
      {...({ href } as any)}
      {...props}
    >
      <Badge
        variant="gradient"
        colorPalette="hibiscus"
        aria-hidden="true"
        flexShrink={0}
        backgroundImage={CHIP_GRADIENT}
        paddingBlock="1.5"
        paddingInline="3"
        fontSize={{ base: "2xs", sm: "xs" }}
        lineHeight="1"
      >
        {chip || m.topo_announcement_pill_chip_default()}
      </Badge>
      <Box as="span" minWidth="0" overflow="hidden" textOverflow="ellipsis">
        {text}
      </Box>
      <Box
        as="svg"
        data-pill-arrow=""
        aria-hidden="true"
        flexShrink={0}
        boxSize="3.5"
        color="hibiscus.800"
        transitionProperty="transform"
        transitionDuration="fast"
        {...({ viewBox: "0 0 14 14", fill: "none" } as any)}
      >
        <path
          d="M2 7h10M8 3l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Box>
    </Box>
  ),
);
AnnouncementPill.displayName = "AnnouncementPill";
