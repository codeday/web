import * as m from "@codeday/i18n/messages";
import { Box, Eyebrow, Heading, Text } from "@codeday/topo/Atom";
import { gradientStops } from "@codeday/topo/Theme";
import React from "react";

const BODY = "{colors.gray.700}";

const STROKE = {
  fill: "none",
  stroke: gradientStops.blackberry[0],
  strokeWidth: 3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const SAND = gradientStops.blackberry[5];

function PitchIcon() {
  return (
    <svg width="220" height="132" viewBox="0 0 200 120" aria-hidden="true">
      <path
        {...STROKE}
        d="M60 96V40a10 10 0 0 1 10-10h70a10 10 0 0 1 10 10v30a10 10 0 0 1-10 10H84z"
        style={{ fill: "white" }}
      />
      <path {...STROKE} d="M105 42v-6M92 47l-4-4M118 47l4-4" />
      <path
        {...STROKE}
        d="M97 66a8 8 0 1 1 16 0c0 5-4 6-4 10h-8c0-4-4-5-4-10z"
        style={{ fill: SAND }}
      />
      <path {...STROKE} d="M101 80h8" />
    </svg>
  );
}

function TeamsIcon() {
  return (
    <svg width="220" height="132" viewBox="0 0 200 120" aria-hidden="true">
      <circle {...STROKE} cx="70" cy="52" r="12" style={{ fill: "white" }} />
      <circle {...STROKE} cx="130" cy="52" r="12" style={{ fill: "white" }} />
      <circle {...STROKE} cx="100" cy="44" r="13" style={{ fill: SAND }} />
      <path {...STROKE} d="M48 96c0-16 10-24 22-24s22 8 22 24M108 96c0-16 10-24 22-24s22 8 22 24" />
      <path {...STROKE} d="M76 100c0-20 10-30 24-30s24 10 24 30" style={{ fill: "white" }} />
      <path {...STROKE} d="M158 36v14M151 43h14" />
    </svg>
  );
}

function BuildIcon() {
  return (
    <svg width="220" height="132" viewBox="0 0 200 120" aria-hidden="true">
      <path {...STROKE} d="M50 34h100v58H50z" style={{ fill: "white" }} />
      <path {...STROKE} d="M36 92h128l6 10H30z" style={{ fill: SAND }} />
      <path {...STROKE} d="M84 52l-12 11 12 11M116 52l12 11-12 11M106 48l-12 30" />
    </svg>
  );
}

function DemoIcon() {
  return (
    <svg width="220" height="132" viewBox="0 0 200 120" aria-hidden="true">
      <path {...STROKE} d="M40 30h120v66H40z" style={{ fill: "white" }} />
      <path {...STROKE} d="M100 96v14M80 110h40" />
      <path
        {...STROKE}
        d="M100 46l6 12 13 2-9 9 2 13-12-6-12 6 2-13-9-9 13-2z"
        style={{ fill: SAND }}
      />
      <path {...STROKE} d="M26 40l6 6M174 40l-6 6M22 64h8M170 64h8" />
    </svg>
  );
}

const STEPS = [
  {
    number: "01",
    tint: "orange.100",
    Icon: PitchIcon,
    title: m.www_events_steps_1_title,
    body: m.www_events_steps_1_body,
  },
  {
    number: "02",
    tint: "cyan.100",
    Icon: TeamsIcon,
    title: m.www_events_steps_2_title,
    body: m.www_events_steps_2_body,
  },
  {
    number: "03",
    tint: "yellow.100",
    Icon: BuildIcon,
    title: m.www_events_steps_3_title,
    body: m.www_events_steps_3_body,
  },
  {
    number: "04",
    tint: "purple.100",
    Icon: DemoIcon,
    title: m.www_events_steps_4_title,
    body: m.www_events_steps_4_body,
  },
];

export default function Steps() {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        base: "repeat(2, minmax(0, 1fr))",
        xl: "repeat(4, minmax(0, 1fr))",
      }}
      gap={{ base: "{spacing.6} {spacing.4}", xl: "6" }}
    >
      {STEPS.map(({ number, tint, Icon, title, body }) => (
        <Box key={number} display="flex" flexDirection="column" gap={{ base: "2", xl: "3" }}>
          <Box
            height={{ base: "28", xl: "36" }}
            borderRadius={{ base: "2xl", xl: "2xl" }}
            background={tint}
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
          >
            <Icon />
          </Box>
          <Eyebrow ramp="blackberry" paddingTop={{ base: "1", xl: "1.5" }}>
            {number}
          </Eyebrow>
          <Heading
            as="h3"
            margin={0}
            fontSize={{ base: "xl", xl: "2xl" }}
            fontWeight="700"
            lineHeight="shorter"
          >
            {title()}
          </Heading>
          <Text margin={0} fontSize={{ base: "sm", xl: "md" }} lineHeight="moderate" color={BODY}>
            {body()}
          </Text>
        </Box>
      ))}
    </Box>
  );
}
