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

function RotatingWall() {
  const slots = Array.from({ length: 4 }, (_, s) => ({
    id: `slot-${s}`,
    people: Array.from({ length: 3 }, (_, p) => ({
      id: `s${s}p${p}`,
      name: fakeMessage("[Name]"),
      // oxlint-disable-next-line unicorn/no-thenable -- `then` is PortraitWallPerson's spec-mandated prop name, not a real thenable
      then: fakeMessage(`[year], first Weekend in [city].`),
      now: fakeMessage(`Third year contributing to [Project].`),
      photo: placeholder(s * 40 + p * 120),
      alt: fakeMessage("[Name] today"),
    })),
  }));
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <PortraitWall
      maxWidth="container.lg"
      marginX="auto"
      slots={slots.map((slot) => ({ ...slot, activeId: slot.people[tick % 3].id }))}
    />
  );
}

export const Rotating: Story = {
  name: "Rotating — each slot crossfades to its next person every 2s",
  render: () => (
    <Box maxWidth="7xl" marginX="auto" padding="6">
      <RotatingWall />
    </Box>
  ),
};
