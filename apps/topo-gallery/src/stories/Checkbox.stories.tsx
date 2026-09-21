import { Box, Checkbox } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Checkbox> = {
  title: "Atom/Checkbox",
  component: Checkbox,
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const CheckedFillIsFlat: Story = {
  name: "Checkbox — checked fill is the flat 62% stop, not a gradient",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <Checkbox colorPalette="hibiscus">Unchecked</Checkbox>
      <Checkbox colorPalette="hibiscus" checked>
        Checked
      </Checkbox>
    </Box>
  ),
};
