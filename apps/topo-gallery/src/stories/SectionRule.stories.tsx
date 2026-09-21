import { Box, SectionRule, Text } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof SectionRule> = {
  title: "Atom/SectionRule",
  component: SectionRule,
};
export default meta;

type Story = StoryObj<typeof SectionRule>;

export const MarginIndexPrimarySectioningDevice: Story = {
  name: "Section rule + margin index — the primary sectioning device",
  render: () => (
    <Box width="full">
      <SectionRule index="01">
        <Text mb={0}>First section</Text>
      </SectionRule>
    </Box>
  ),
};
