import { Box } from "@codeday/topo/Atom";
import { INK_ILLUSTRATION_DESKTOP_SIZE, InkIllustration, Section } from "@codeday/topo/Molecule";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const INK_MASK = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="none" stroke="#000" stroke-width="3"><circle cx="50" cy="50" r="30"/><path d="M0 90 L100 10 M10 0 L90 100"/></g><rect x="20" y="60" width="25" height="25"/></svg>',
)}`;

const meta: Meta<typeof InkIllustration> = {
  title: "Molecule/InkIllustration",
  component: InkIllustration,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof InkIllustration>;

function Demo({ side }: { side: "left" | "right" }) {
  return (
    <Section
      ramp="hibiscus"
      backgroundColor="hibiscus.50"
      position="relative"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      gap={{ base: "6", md: "0" }}
      paddingBottom={{ mdDown: "0" }}
      minHeight={{ md: `calc(${INK_ILLUSTRATION_DESKTOP_SIZE} + {spacing.12})` }}
    >
      <InkIllustration src={INK_MASK} side={side} order={{ base: 1, md: 0 }} />
      <Box
        position="relative"
        maxWidth="container.lg"
        marginX="auto"
        width="full"
        display="flex"
        justifyContent={{ md: side === "left" ? "flex-end" : "flex-start" }}
      >
        <Box as="h2" fontSize="3xl" fontWeight="700" margin="0" maxWidth={{ md: "7/12" }}>
          Text column opposite the illustration, which attaches to the {side} edge
        </Box>
      </Box>
    </Section>
  );
}

export const BothSides: Story = {
  name: "Attached to either page edge, stacked below the text on phones",
  render: () => (
    <Box>
      <Demo side="right" />
      <Demo side="left" />
    </Box>
  ),
};
