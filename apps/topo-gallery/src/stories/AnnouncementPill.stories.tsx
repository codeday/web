import { Box } from "@codeday/topo/Atom";
import { AnnouncementPill } from "@codeday/topo/Molecule";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof AnnouncementPill> = {
  title: "Molecule/AnnouncementPill",
  component: AnnouncementPill,
};
export default meta;

type Story = StoryObj<typeof AnnouncementPill>;

export const Default: Story = {
  name: "Default chip, custom chip, long text",
  render: () => (
    <Box display="flex" flexDirection="column" alignItems="flex-start" gap="4" padding="6">
      <AnnouncementPill href="#" text="CodeDay is coming to three new cities this spring." />
      <AnnouncementPill
        href="#"
        chip="Soon"
        text="Applications for our year-long career prep program end soon."
      />
      <AnnouncementPill
        href="#"
        text="A deliberately long announcement that runs well past the pill's sixty-character measure, so it has to truncate with an ellipsis instead of wrapping onto a second line."
      />
    </Box>
  ),
};

export const Narrow: Story = {
  name: "Narrow container — text truncates, chip and arrow don't shrink",
  render: () => (
    <Box maxWidth="xs" padding="6">
      <AnnouncementPill
        href="#"
        chip="Soon"
        text="Applications for our year-long career prep program end soon."
      />
    </Box>
  ),
};
