import { Box, StatusDot } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof StatusDot> = {
  title: "Atom/StatusDot",
  component: StatusDot,
};
export default meta;

type Story = StoryObj<typeof StatusDot>;

export const ColourIsNeverTheOnlySignal: Story = {
  name: "StatusDot — colour is never the only signal",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <StatusDot online label="Online" />
      <StatusDot away label="Away" />
      <StatusDot offline label="Offline" />
    </Box>
  ),
};
