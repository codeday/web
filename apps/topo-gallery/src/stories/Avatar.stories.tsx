import { Avatar, Box } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Avatar.Root> = {
  title: "Atom/Avatar",
  component: Avatar.Root,
};
export default meta;

type Story = StoryObj<typeof Avatar.Root>;

export const Default: Story = {
  name: "Avatar — squircle at small sizes",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <Avatar.Root size="sm" colorPalette="hibiscus">
        <Avatar.Fallback>TM</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root colorPalette="figjam">
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar.Root>
    </Box>
  ),
};
