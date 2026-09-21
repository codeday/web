import { Box, Chip } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Chip> = {
  title: "Atom/Chip",
  component: Chip,
};
export default meta;

type Story = StoryObj<typeof Chip>;

export const Removable: Story = {
  name: "Chip — removable (must render as a chip, never a circle over its own label)",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4} alignItems="flex-start">
      <Chip onRemove={() => {}} data-testid="removable-chip">
        Removable
      </Chip>
      <Chip>Static</Chip>
    </Box>
  ),
};
