import { Box } from "@codeday/topo/Atom";
import { GradientField } from "@codeday/topo/Molecule";
import { gradientStops, type GradientName } from "@codeday/topo/Theme";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const RAMPS = Object.keys(gradientStops) as GradientName[];

const meta: Meta<typeof GradientField> = {
  title: "Molecule/GradientField",
  component: GradientField,
};
export default meta;

type Story = StoryObj<typeof GradientField>;

export const EveryRamp: Story = {
  name: "Gradient field with grain and white text — every ramp",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      {RAMPS.map((ramp) => (
        <GradientField key={ramp} ramp={ramp} padding="5" borderRadius="xl" width="64">
          <Box fontFamily="mono" fontSize="xs" color="whiteAlpha.800">
            {ramp}
          </Box>
          <Box fontWeight="700">Software Engineer, New Grad 2027</Box>
        </GradientField>
      ))}
    </Box>
  ),
};

export const CardHeader: Story = {
  name: "Top band of an elevated card",
  render: () => (
    <Box
      maxWidth="md"
      borderWidth="1px"
      borderColor="gray.300"
      borderRadius="xl"
      boxShadow="lg"
      overflow="hidden"
    >
      <GradientField ramp="figjam" padding="6">
        <Box fontSize="xl" fontWeight="700">
          Maya R.
        </Box>
        <Box fontSize="sm" color="whiteAlpha.900">
          New grad · B.S. Computer Science
        </Box>
      </GradientField>
      <Box padding="6">Card body</Box>
    </Box>
  ),
};
