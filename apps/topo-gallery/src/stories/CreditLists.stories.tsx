import { Box, Button, Heading, Text } from "@codeday/topo/Atom";
import { CreditLists } from "@codeday/topo/Organism";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { fakeMessage } from "../lib/fakeMessage";

const meta: Meta<typeof CreditLists> = {
  title: "Organism/CreditLists",
  component: CreditLists,
};
export default meta;

type Story = StoryObj<typeof CreditLists>;

// Flat placeholder "wordmark" SVGs (data URIs) standing in for real funder
// logos — one deliberately busy/multi-tone (to show `mono` flattening it)
// and one already a plain single-tone mark (to show `mono: false` passing
// it through untouched).
const busySeal =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60"><circle cx="60" cy="30" r="26" fill="%23336699"/><circle cx="60" cy="30" r="16" fill="%23cc3333"/><circle cx="60" cy="30" r="7" fill="%23ffcc00"/></svg>',
  );
const plainWordmark =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="40"><text x="0" y="28" font-family="monospace" font-size="26" fill="%23222">wordmark</text></svg>',
  );

export const Default: Story = {
  name: "Who pays for this — funders, ratings, press",
  render: () => (
    <Box maxWidth="4xl" padding="8">
      <Heading
        as="h2"
        fontSize="clamp({fontSizes.2xl}, 3.4vw, {fontSizes.4xl})"
        fontWeight="700"
        margin="0"
        maxWidth="28ch"
      >
        {fakeMessage("Who pays for this")}
      </Heading>
      <Text marginTop="3.5" fontSize="lg" color="gray.700" maxWidth="65ch">
        {fakeMessage(
          "For a Micro-Internship or a Residency, a college or a sponsor covers the seat. The work is unpaid. What a student leaves with is merged work in a project people use and the people who reviewed it.",
        )}
      </Text>
      <CreditLists
        marginTop="9"
        groups={[
          {
            id: "funders",
            label: fakeMessage("Funders"),
            kind: "logos",
            entries: [
              {
                name: "National Science Foundation (Award No. 2347311)",
                logo: busySeal,
                mono: true,
                href: "#",
              },
              { name: "LexisNexis Risk Solutions", logo: plainWordmark, mono: false, href: "#" },
              { name: "Career Connect Washington", logo: plainWordmark, mono: false },
              { name: "Wilson Sonsini", logo: plainWordmark, mono: false },
              { name: "Fastly", logo: plainWordmark, mono: false },
              { name: "Contentful", logo: plainWordmark, mono: false },
              { name: "Auth0", logo: plainWordmark, mono: false },
              { name: "Kinesis Gaming", logo: plainWordmark, mono: false },
            ],
          },
          {
            id: "ratings",
            label: fakeMessage("Ratings"),
            kind: "names",
            entries: [
              { name: "Candid, Platinum Transparency 2025" },
              { name: "Charity Navigator, four stars" },
            ],
          },
          {
            id: "press",
            label: fakeMessage("Press"),
            kind: "press",
            entries: [
              { name: "NPR All Things Considered" },
              { name: "TechCrunch" },
              { name: "GeekWire" },
              { name: "KQED" },
              { name: "ReadWrite" },
            ],
          },
        ]}
      />
      <Button variant="primary" marginTop="10" {...({ as: "a", href: "#" } as any)}>
        {fakeMessage("Support a student's seat")}
      </Button>
    </Box>
  ),
};

export const NoHeading: Story = {
  name: "heading/intro omitted — the section opens directly on the credit groups",
  render: () => (
    <Box maxWidth="4xl" padding="8">
      <CreditLists
        groups={[
          {
            id: "funders",
            label: fakeMessage("Funders"),
            kind: "logos",
            entries: [
              {
                name: "National Science Foundation (Award No. 2347311)",
                logo: busySeal,
                mono: true,
                href: "#",
              },
              { name: "LexisNexis Risk Solutions", logo: plainWordmark, mono: false, href: "#" },
            ],
          },
          {
            id: "ratings",
            label: fakeMessage("Ratings"),
            kind: "names",
            entries: [{ name: "Candid, Platinum Transparency 2025" }],
          },
        ]}
      />
      <Button variant="primary" marginTop="10" {...({ as: "a", href: "#" } as any)}>
        {fakeMessage("Support a student's seat")}
      </Button>
    </Box>
  ),
};
