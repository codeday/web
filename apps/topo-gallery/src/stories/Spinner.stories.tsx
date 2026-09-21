import { Box, Spinner } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Spinner> = {
  title: "Atom/Spinner",
  component: Spinner,
};
export default meta;

type Story = StoryObj<typeof Spinner>;

export const SingleColourNeverMultiStop: Story = {
  name: "Spinner — single colour, never multi-stop",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <Spinner colorPalette="hibiscus" />
      <Spinner colorPalette="figjam" />
    </Box>
  ),
};
