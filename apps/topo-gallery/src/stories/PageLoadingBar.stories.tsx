import { PageLoadingBar } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof PageLoadingBar> = {
  title: "Atom/PageLoadingBar",
  component: PageLoadingBar,
};
export default meta;

type Story = StoryObj<typeof PageLoadingBar>;

export const Loading: Story = {
  render: () => <PageLoadingBar loading />,
};
