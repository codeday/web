import { Highlight, Text } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Highlight> = {
  title: "Atom/Highlight",
  component: Highlight,
};
export default meta;

type Story = StoryObj<typeof Highlight>;

export const BandWithRoomAboveBelow: Story = {
  name: "Highlight — band with room above/below, clones across a wrap",
  render: () => (
    <Text maxWidth="sm">
      Some copy with a{" "}
      <Highlight>
        highlighted phrase that is long enough to wrap onto a second line so the band&apos;s clone
        behavior
      </Highlight>{" "}
      is actually visible.
    </Text>
  ),
};
