import { Box } from "@codeday/topo/Atom";
import { StatTrio } from "@codeday/topo/Organism";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { fakeMessage } from "../lib/fakeMessage";

const meta: Meta<typeof StatTrio> = {
  title: "Organism/StatTrio",
  component: StatTrio,
};
export default meta;

type Story = StoryObj<typeof StatTrio>;

// Placeholder demo numbers only — the real figures are `[BRACKETED]` in the
// build spec and are not supplied yet.
export const ThreeCells: Story = {
  name: "StatTrio — one field, three cells (not three fields)",
  render: () => (
    <Box maxWidth="4xl">
      <StatTrio
        items={[
          {
            id: "students",
            value: 120000,
            format: "integer",
            label: fakeMessage("Students have done at least one CodeDay since 2009"),
            provenance: fakeMessage("Counted once per person across all four formats."),
          },
          {
            id: "frl",
            value: 54,
            format: "percent",
            label: fakeMessage(
              "Attend a school where more than half of students qualify for free or reduced-price lunch",
            ),
            provenance: fakeMessage("School-level federal data. Nothing self-reported."),
          },
          {
            id: "economic-value",
            value: 340000000,
            format: "usd",
            label: fakeMessage("In economic value over the past decade"),
            provenance: fakeMessage(
              "Modelled by an independent institution, 2025. Read the study →",
            ),
            href: "#",
          },
        ]}
      />
    </Box>
  ),
};

export const NullCellOmittedAndWidens: Story = {
  name: "A null cell is omitted — remaining cells widen — verified at 360px",
  parameters: { viewport: { defaultViewport: "mobile1" } },
  render: () => (
    <Box maxWidth="sm">
      <StatTrio
        items={[
          {
            id: "students",
            value: 120000,
            format: "integer",
            label: fakeMessage("Students have done at least one CodeDay since 2009"),
            provenance: fakeMessage("Counted once per person across all four formats."),
          },
          {
            id: "frl",
            value: null,
            format: "percent",
            label: fakeMessage("Omitted — value is null"),
            provenance: fakeMessage("Should not render at all."),
          },
          {
            id: "economic-value",
            value: 340000000,
            format: "usd",
            label: fakeMessage("In economic value over the past decade"),
            provenance: fakeMessage(
              "Modelled by an independent institution, 2025. Read the study →",
            ),
            href: "#",
          },
        ]}
      />
    </Box>
  ),
};
