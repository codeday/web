import { Box, Button } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Button> = {
  title: "Atom/Button",
  component: Button,
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Variants: Story = {
  name: "Button variants",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4} alignItems="flex-start">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="dangerSolid">Danger solid</Button>
      <Button variant="icon">+</Button>
    </Box>
  ),
};

export const Sizes: Story = {
  name: "Button sizes",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4} alignItems="flex-start">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Box>
  ),
};

export const States: Story = {
  name: "Button states",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4} alignItems="flex-start">
      <Button loading>Loading</Button>
      <Button disabled>Disabled</Button>
    </Box>
  ),
};

export const PerSectionPrimaryFills: Story = {
  name: "Per-section primary fills",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4} alignItems="flex-start">
      {(["hibiscus", "hotsauce", "chilioil", "blackberry", "figjam", "marmalade"] as const).map(
        (ramp) => (
          <Button key={ramp} colorPalette={ramp}>
            {ramp}
          </Button>
        ),
      )}
    </Box>
  ),
};
