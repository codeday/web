import { Box, Tooltip } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Tooltip.Root> = {
  title: "Atom/Tooltip",
  component: Tooltip.Root,
};
export default meta;

type Story = StoryObj<typeof Tooltip.Root>;

export const NeverAGradient: Story = {
  name: "Tooltip (never a gradient)",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4} alignItems="flex-start">
      <Tooltip.Root open>
        <Tooltip.Trigger asChild>
          <Box display="inline-block">Hover target</Box>
        </Tooltip.Trigger>
        <Tooltip.Positioner>
          <Tooltip.Content>A tooltip</Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
    </Box>
  ),
};
