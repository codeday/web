import { Box, Switch } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Switch> = {
  title: "Atom/Switch",
  component: Switch,
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const OffGray300OnThe62PercentStop: Story = {
  name: "Switch — off gray.300, on the 62% stop",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <Switch colorPalette="hibiscus">Off</Switch>
      <Switch colorPalette="hibiscus" checked>
        On
      </Switch>
    </Box>
  ),
};
