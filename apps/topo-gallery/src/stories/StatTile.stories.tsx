import { Box, StatTile } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof StatTile> = {
  title: "Atom/StatTile",
  component: StatTile,
};
export default meta;

type Story = StoryObj<typeof StatTile>;

export const RadialGradientHome: Story = {
  name: "StatTile — the one home for the radial gradient",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <StatTile number="2,299,282" label="Hours Solving" colorPalette="hibiscus" />
      <StatTile number="524" label="Events" colorPalette="figjam" />
      <StatTile number="71,056" label="Alumni" colorPalette="chilioil" />
    </Box>
  ),
};
