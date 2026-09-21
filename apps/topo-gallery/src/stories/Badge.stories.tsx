import { Badge, Box } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Badge> = {
  title: "Atom/Badge",
  component: Badge,
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Variants: Story = {
  name: "Badge variants",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4} alignItems="flex-start">
      <Badge colorPalette="green" variant="solid">
        Solid
      </Badge>
      <Badge colorPalette="hibiscus" variant="gradient">
        Gradient
      </Badge>
      <Badge colorPalette="blue" variant="outline">
        Outline
      </Badge>
      <Badge colorPalette="red" variant="dot">
        Dot
      </Badge>
      <Badge colorPalette="purple" variant="squircle">
        Squircle
      </Badge>
      <Badge colorPalette="teal" variant="solid" count={12}>
        Split count
      </Badge>
    </Box>
  ),
};

export const FeedRow: Story = {
  name: "Status entry — no brand colour, no gradient, no field",
  render: () => (
    <Box display="flex" flexDirection="column" gap="2.5" width="full">
      <Box display="flex" alignItems="center" gap="2.5">
        <Badge colorPalette="indigo" variant="solidDark">
          Standup
        </Badge>
        <Box fontSize="sm" color="current.textLight">
          3 days ago
        </Box>
      </Box>
      <Box display="flex" alignItems="center" gap="2.5">
        <Badge colorPalette="orange" variant="solid">
          Blocker
        </Badge>
        <Box fontSize="sm" color="current.textLight">
          awaiting maintainer
        </Box>
      </Box>
    </Box>
  ),
};
