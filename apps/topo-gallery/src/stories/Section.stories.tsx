import { Box } from "@codeday/topo/Atom";
import { Band, SECTION_IMAGE_ANCHOR, Section } from "@codeday/topo/Molecule";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const INK_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90"><rect width="160" height="90" fill="#fff"/><g fill="none" stroke="#000" stroke-width="3"><circle cx="80" cy="45" r="30"/><path d="M0 80 L160 10 M20 0 L140 90"/></g></svg>',
)}`;

const meta: Meta<typeof Section> = {
  title: "Molecule/Section",
  component: Section,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Section>;

export const InsideTintedBand: Story = {
  name: "Compact spacing inherited from a tinted Band",
  render: () => (
    <Box maxWidth="8xl" marginX="auto">
      <Section ramp="hibiscus">
        <Box as="h2" fontSize="3xl" fontWeight="700" margin="0">
          Default spacing, page tone
        </Box>
      </Section>
      <Band tone="tinted">
        <Section ramp="hotsauce">
          <Box as="h2" fontSize="3xl" fontWeight="700" margin="0">
            Compact spacing, inside the tint
          </Box>
        </Section>
        <Section ramp="chilioil">
          <Box as="h2" fontSize="3xl" fontWeight="700" margin="0">
            A second section in the same band — note the single seamless fill and the rule between
          </Box>
        </Section>
      </Band>
      <Section ramp="hibiscus">
        <Box as="h2" fontSize="3xl" fontWeight="700" margin="0">
          Back to default spacing, page tone
        </Box>
      </Section>
    </Box>
  ),
};

export const WithImage: Story = {
  name: "Background image — blended into the section's own background",
  render: () => (
    <Box maxWidth="8xl" marginX="auto">
      <Section ramp="hibiscus" backgroundColor="hibiscus.50" imgSrc={INK_IMAGE}>
        <Box as="h2" fontSize="3xl" fontWeight="700" margin="0">
          Covering image
        </Box>
      </Section>
      <Section
        ramp="figjam"
        backgroundColor="figjam.50"
        imgSrc={{ base: null, md: INK_IMAGE }}
        imgSide="right"
        imgPosition="left"
        imgSize="contain"
        imgMask="linear-gradient(to right, transparent, black {sizes.32})"
      >
        <Box
          as="h2"
          fontSize="3xl"
          fontWeight="700"
          margin="0"
          maxWidth="md"
          anchorName={SECTION_IMAGE_ANCHOR}
        >
          Beside the heading, overlapping and fading into it, hidden on mobile
        </Box>
      </Section>
    </Box>
  ),
};
