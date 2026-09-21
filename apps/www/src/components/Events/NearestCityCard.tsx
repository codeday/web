import * as m from "@codeday/i18n/messages";
import { Box, Button, Eyebrow, Text } from "@codeday/topo/Atom";
import { MapNav } from "@codeday/topocons";
import React from "react";

import { City, statusDateLabel, statusLabel, STATUS_COLOR } from "./data";
import { ExternalLinkIcon } from "./icons";

// Self-inverting — paired with a plain `white` card, so both flip together
// in dark mode and stay contrasted either way.
const INK = "{colors.black}";
const BODY = "{colors.gray.700}";
const ACCENT = "{colors.colorPalette.800}";
const TINT = "colorPalette.200";

export default function NearestCityCard({
  city,
}: {
  city: City;
  distanceMeters: number | null;
  viewerIsUs: boolean;
}) {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap="4"
      boxSizing="border-box"
      padding="{spacing.4} {spacing.4.5}"
      border={`1.5px solid ${INK}`}
      borderRadius="2xl"
      background="white"
    >
      <Box
        width="11"
        height="11"
        borderRadius="full"
        background={TINT}
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        <MapNav boxSize="22px" color={ACCENT} />
      </Box>
      <Box flexGrow={1} display="flex" flexDirection="column" gap="3px">
        <Eyebrow ramp="blackberry">{m.www_events_hero_nearest_eyebrow()}</Eyebrow>
        <Text as="span" fontSize="lg" fontWeight="700" lineHeight="shorter">
          {city.event
            ? m.www_events_hero_nearest_title({
                city: city.name,
                dateRange: statusDateLabel(city.event),
              })
            : m.www_events_hero_nearest_title_no_date({ city: city.name })}
        </Text>
        <Box display="inline-flex" alignItems="center" gap="2" fontSize="sm" color={BODY}>
          <Box
            width="2"
            height="2"
            borderRadius="full"
            display="inline-block"
            background={STATUS_COLOR[city.status]}
          />
          {m.www_events_hero_nearest_meta({
            status: statusLabel(city.status),
          })}
        </Box>
      </Box>
      <Button
        as="a"
        {...({
          href: city.eventUrl,
          target: "_blank",
          rel: "noopener noreferrer",
        } as any)}
        variant="primary"
        flexShrink={0}
      >
        {m.www_events_hero_event_page()}
        <ExternalLinkIcon boxSize="16px" style={{ marginLeft: 8 }} />
      </Button>
    </Box>
  );
}
