import { Box, Tabs } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Tabs.Root> = {
  title: "Atom/Tabs",
  component: Tabs.Root,
};
export default meta;

type Story = StoryObj<typeof Tabs.Root>;

export const Default: Story = {
  name: "Tabs — 2.5px indicator, inset 8px, in the 62% stop",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <Tabs.Root defaultValue="one" width="full">
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="one">Tab one content</Tabs.Content>
        <Tabs.Content value="two">Tab two content</Tabs.Content>
      </Tabs.Root>
    </Box>
  ),
};
