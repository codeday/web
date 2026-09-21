import { Box, SkipNavLink } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof SkipNavLink> = {
  title: "Atom/SkipLink",
  component: SkipNavLink,
};
export default meta;

type Story = StoryObj<typeof SkipNavLink>;

export const Default: Story = {
  name: "Skip link (visually hidden until focus — tab into the page to see it)",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <SkipNavLink href="#main">Skip to content</SkipNavLink>
    </Box>
  ),
};
