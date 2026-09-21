import { Box, Eyebrow } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Eyebrow> = {
  title: "Atom/Eyebrow",
  component: Eyebrow,
};
export default meta;

type Story = StoryObj<typeof Eyebrow>;

export const AccentOnWhiteNotTheRaw62PercentStop: Story = {
  name: "Eyebrow — accentOnWhite, not the raw 62% stop",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <Eyebrow ramp="marmalade">Marmalade eyebrow</Eyebrow>
      <Eyebrow ramp="hibiscus">Hibiscus eyebrow</Eyebrow>
    </Box>
  ),
};
