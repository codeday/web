import { Heading } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Heading> = {
  title: "Atom/Text",
  component: Heading,
};
export default meta;

type Story = StoryObj<typeof Heading>;

export const ZeroTrackingHeadline: Story = {
  name: "Headline — zero tracking (no negative letter-spacing)",
  render: () => (
    <Heading as="h2" fontSize="5xl">
      Zero-tracking headline
    </Heading>
  ),
};
