import { Box } from "@codeday/topo/Atom";
import { PortraitWall } from "@codeday/topo/Organism";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { fakeMessage } from "../lib/fakeMessage";

const meta: Meta<typeof PortraitWall> = {
  title: "Organism/PortraitWall",
  component: PortraitWall,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof PortraitWall>;

// Small SVG data-URIs with a visible frame + diagonal, so the squircle mask
// and aspect-ratio crop are legible against a placeholder that isn't just a
// flat colour. Real photographs must be colour-graded before they ship (see
// the component's own doc comment) — these placeholders aren't graded, and
// aren't meant to represent the final look, only the layout.
function placeholder(hue: number) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
    <rect width='200' height='200' fill='hsl(${hue},55%,55%)'/>
    <path d='M0 0 L200 200 M200 0 L0 200' stroke='hsl(${hue},55%,30%)' stroke-width='6'/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const FourPeople: Story = {
  name: "Four people max, one photo each — 2x2 on mobile, capped at container.lg, no links or hover reveal",
  render: () => (
    <Box maxWidth="7xl" marginX="auto" padding="6">
      <PortraitWall
        maxWidth="container.lg"
        marginX="auto"
        slots={Array.from({ length: 4 }, (_, i) => {
          const person = {
            id: `p${i + 1}`,
            name: fakeMessage("[Name]"),
            // oxlint-disable-next-line unicorn/no-thenable -- `then` is PortraitWallPerson's spec-mandated prop name, not a real thenable
            then: fakeMessage(`[year], first Weekend in [city].`),
            now: fakeMessage(`Third year contributing to [Project].`),
            photo: placeholder(i * 40),
            alt: fakeMessage("[Name] today"),
          };
          return { id: person.id, people: [person], activeId: person.id };
        })}
      />
    </Box>
  ),
};
