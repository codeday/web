import { Box, GradientText } from "@codeday/topo/Atom";
import { gradientStops, type GradientName } from "@codeday/topo/Theme";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const RAMPS = Object.keys(gradientStops) as GradientName[];

const meta: Meta<typeof GradientText> = {
  title: "Atom/GradientText",
  component: GradientText,
};
export default meta;

type Story = StoryObj<typeof GradientText>;

export const EveryRamp: Story = {
  name: "Gradient text — every ramp",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      {RAMPS.map((ramp) => (
        <GradientText key={ramp} ramp={ramp} fontSize="2xl" fontWeight="800">
          {ramp}
        </GradientText>
      ))}
    </Box>
  ),
};
