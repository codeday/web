import { Box } from "@codeday/topo/Atom";
import { HistoryRail } from "@codeday/topo/Organism";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { fakeMessage } from "../lib/fakeMessage";

const meta: Meta<typeof HistoryRail> = {
  title: "Organism/HistoryRail",
  component: HistoryRail,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof HistoryRail>;

const BODY = fakeMessage(
  "CodeDay has run every year since 2009. The design has changed many times. What a student is asked to do has not: find something somebody needs, decide whether it is worth building, and finish it for the person who will say when it is done.",
);

const EVENTS = [
  { id: "e1", year: 2009, month: 11, title: fakeMessage("First CodeDay") },
  { id: "e2", year: 2012, month: 6, title: fakeMessage("[Milestone — not yet supplied]") },
  { id: "e3", year: 2015, month: 3, title: fakeMessage("[Milestone — not yet supplied]") },
  { id: "e4", year: 2017, month: 9, title: fakeMessage("[Milestone — not yet supplied]") },
  { id: "e5", year: 2019, month: 1, title: fakeMessage("[Milestone — not yet supplied]") },
  { id: "e6", year: 2021, month: 10, title: fakeMessage("[Milestone — not yet supplied]") },
  { id: "e7", year: 2023, month: 5, title: fakeMessage("[Milestone — not yet supplied]") },
  { id: "e8", year: 2025, month: 2, title: fakeMessage("[Milestone — not yet supplied]") },
];

const COMPARISONS = [
  { id: "appstore", year: 2008, title: fakeMessage("iPhone App Store") },
  { id: "ssd", year: 2012, title: fakeMessage("SSD hard drives") },
  { id: "cloud", year: 2015, title: fakeMessage("Cloud native infra") },
  { id: "chatgpt", year: 2022, title: fakeMessage("ChatGPT") },
];

function HistoryWithCopy() {
  return (
    <Box css={{ containerType: "inline-size", containerName: "history" }}>
      <Box
        display="grid"
        gridTemplateColumns="1fr"
        gap="6"
        css={{ "@container history (min-width: 820px)": { gridTemplateColumns: "1fr 62%" } }}
      >
        <Box fontSize="lg" color="gray.700" maxWidth="46ch">
          {BODY}
        </Box>
        <HistoryRail startYear={2009} events={EVENTS} comparisons={COMPARISONS} />
      </Box>
    </Box>
  );
}

export const Desktop: Story = {
  name: "Desktop — copy beside a wide rail, container queries pick tick density",
  render: () => (
    <Box maxWidth="6xl">
      <HistoryWithCopy />
    </Box>
  ),
};

export const Mobile: Story = {
  name: "Mobile — copy stacks above a narrower (but visually WIDER) rail column",
  render: () => (
    <Box maxWidth="sm">
      <HistoryWithCopy />
    </Box>
  ),
};
