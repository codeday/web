import { Box } from "@codeday/topo/Atom";
import { RowList } from "@codeday/topo/Organism";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { fakeMessage as fm } from "../lib/fakeMessage";

const meta: Meta<typeof RowList> = {
  title: "Organism/RowList",
  component: RowList,
};
export default meta;

type Story = StoryObj<typeof RowList>;

export const WaysIn: Story = {
  name: "waysIn — 19px leads (institutional doors, not features); body copy not yet supplied",
  render: () => (
    <Box maxWidth="5xl">
      <RowList
        variant="waysIn"
        gradient="blackberry"
        rows={[
          {
            id: "colleges",
            lead: fm("Colleges"),
            body: fm("[Body copy for the Colleges row — not yet supplied]"),
            actions: [{ label: fm("Learn more"), href: "#" }],
          },
          {
            id: "companies",
            lead: fm("Companies and foundations"),
            body: fm("[Body copy for the Companies and foundations row — not yet supplied]"),
            actions: [{ label: fm("Learn more"), href: "#" }],
          },
          {
            id: "mentors",
            lead: fm("Mentors"),
            body: fm("[Body copy for the Mentors row — not yet supplied]"),
            actions: [{ label: fm("Learn more"), href: "#" }],
          },
          {
            id: "maintainers",
            lead: fm("Maintainers"),
            body: fm("[Body copy for the Maintainers row — not yet supplied]"),
            actions: [{ label: fm("Learn more"), href: "#" }],
          },
        ]}
      />
    </Box>
  ),
};
