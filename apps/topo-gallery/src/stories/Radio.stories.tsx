import { Box, Radio } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Radio> = {
  title: "Atom/Radio",
  component: Radio,
};
export default meta;

type Story = StoryObj<typeof Radio>;

export const CheckedFillIsFlat: Story = {
  name: "Radio — checked fill is the flat 62% stop, not a gradient",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <Radio isChecked colorPalette="figjam">
        Radio checked
      </Radio>
    </Box>
  ),
};
