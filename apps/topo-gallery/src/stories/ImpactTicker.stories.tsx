import { Box, Heading, Text } from "@codeday/topo/Atom";
import { ActionLink } from "@codeday/topo/Molecule";
import { ImpactTicker } from "@codeday/topo/Organism";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { fakeMessage as fm } from "../lib/fakeMessage";

const meta: Meta<typeof ImpactTicker> = {
  title: "Organism/ImpactTicker",
  component: ImpactTicker,
};
export default meta;

type Story = StoryObj<typeof ImpactTicker>;

const PROJECTS = [
  "Home Assistant",
  "p5.js",
  "VLC",
  "Blender",
  "Signal",
  "Godot",
  "Audacity",
  "GIMP",
  "Inkscape",
  "Mastodon",
  "Jellyfin",
  "FFmpeg",
];

export const TwoRows: Story = {
  name: "Two marquee rows, scrolling opposite directions at different speeds — pauses on hover/focus",
  render: () => (
    <Box maxWidth="6xl">
      <Box maxWidth="container.lg" marginX="auto">
        <Box marginBottom="6" maxWidth="60ch">
          <Heading
            as="h2"
            fontSize="clamp({fontSizes.2xl}, 3.4vw, {fontSizes.4xl})"
            fontWeight="700"
            margin="0"
            color="black"
          >
            {fm("Students ship into software other people depend on.")}
          </Heading>
          <Text marginTop="2" fontSize="md" color="gray.700">
            {fm(
              "Every project below is used by people who have never heard of CodeDay. Every change below was accepted by the people who maintain it.",
            )}
          </Text>
        </Box>
      </Box>
      <ImpactTicker
        ramp="chilioil"
        items={PROJECTS.map((project, i) => ({
          id: `i${i}`,
          impact: fm(`Used by [N] million people`),
          project: fm(project),
          contribution: fm("[One line on what they changed]"),
          student: fm("[Name]"),
        }))}
      />
      <Box
        colorPalette="chilioil"
        marginTop="8"
        paddingTop="5"
        borderTop="sm"
        borderTopColor="gray.200"
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-start", md: "baseline" }}
        justifyContent={{ base: "flex-start", md: "flex-end" }}
        gap={{ base: "1.5", md: "4" }}
      >
        <Box as="span" fontSize="md" color="current.text" fontWeight="700">
          {fm("[N] contributions accepted into [N] projects.")}
        </Box>
        <ActionLink label={fm("See all of them")} href="#" />
      </Box>
    </Box>
  ),
};
