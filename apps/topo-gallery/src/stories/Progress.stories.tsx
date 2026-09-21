import { Box, Progress } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Progress.Root> = {
  title: "Atom/Progress",
  component: Progress.Root,
};
export default meta;

type Story = StoryObj<typeof Progress.Root>;

export const FillEarnsARamp: Story = {
  name: "Progress — the fill is the one small element that earns a ramp",
  render: () => (
    <Box width="60">
      <Progress.Root value={60} colorPalette="hibiscus">
        <Progress.Track>
          <Progress.Range />
        </Progress.Track>
      </Progress.Root>
    </Box>
  ),
};
