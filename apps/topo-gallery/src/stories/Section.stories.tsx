import { Box } from "@codeday/topo/Atom";
import { Band, Section } from "@codeday/topo/Molecule";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

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
