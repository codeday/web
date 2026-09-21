import { Box, EmptyState } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof EmptyState.Root> = {
  title: "Atom/EmptyState",
  component: EmptyState.Root,
};
export default meta;

type Story = StoryObj<typeof EmptyState.Root>;

export const LeftAlignedCappedRamp: Story = {
  name: "EmptyState — left-aligned, capped ramp (never white-on-sand)",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4} alignItems="flex-start">
      <EmptyState.Root colorPalette="marmalade" width="sm">
        <EmptyState.Content>
          <EmptyState.Title>No results</EmptyState.Title>
          <EmptyState.Description color="whiteAlpha.800">
            Try a different search.
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>
    </Box>
  ),
};
