import { Box } from "@codeday/topo/Atom";
import { Wash } from "@codeday/topo/Molecule";
import { gradientStops, type GradientName } from "@codeday/topo/Theme";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const RAMPS = Object.keys(gradientStops) as GradientName[];

const meta: Meta<typeof Wash> = {
  title: "Molecule/Wash",
  component: Wash,
};
export default meta;

type Story = StoryObj<typeof Wash>;

export const RectEveryRamp: Story = {
  name: "Rect field — every ramp (squircle-cornered by default)",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      {RAMPS.map((ramp) => (
        <Wash key={ramp} ramp={ramp} shape="rect" width="40" height="24" />
      ))}
    </Box>
  ),
};

export const PillTintFlat: Story = {
  name: "Pill / tint / flat",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <Wash ramp="figjam" shape="pill" width="44" height="24" />
      <Wash ramp="marmalade" shape="tint" width="44" height="24" borderRadius="lg" />
      <Wash ramp="hotsauce" shape="flat" width="44" height="24" borderRadius="lg" />
    </Box>
  ),
};

export const HeroMesh: Story = {
  name: "Hero mesh — normal and tall (must read as a mesh, not 3 blobs)",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <Wash ramp="hibiscus" shape="rect" mesh width="96" height="56" />
      <Wash ramp="hibiscus" shape="rect" mesh tall width="40" height="96" />
    </Box>
  ),
};
