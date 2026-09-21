import { Skelly } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Skelly> = {
  title: "Atom/Skelly",
  component: Skelly,
};
export default meta;

type Story = StoryObj<typeof Skelly>;

export const RetunedNeutrals: Story = {
  name: "Skeleton — retuned neutrals",
  render: () => <Skelly width="60" />,
};
