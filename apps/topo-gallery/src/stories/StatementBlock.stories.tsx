import { Box, GradientText } from "@codeday/topo/Atom";
import { StatementBlock } from "@codeday/topo/Organism";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { fakeMessage } from "../lib/fakeMessage";

const meta: Meta<typeof StatementBlock> = {
  title: "Organism/StatementBlock",
  component: StatementBlock,
};
export default meta;

type Story = StoryObj<typeof StatementBlock>;

// Demo copy only — the real page sources this from the message catalogue at
// composition time. `StatementBlock` itself never calls into `m.xxx()`.
export const Hero: Story = {
  name: "Hero — gradient-fills only the two numerals",
  render: () => (
    <Box maxWidth="4xl" padding="6">
      <StatementBlock
        size="hero"
        as="h1"
        heading={
          <>
            A first CodeDay at <GradientText ramp="hibiscus">fifteen</GradientText>. Still on the
            project at <GradientText ramp="hibiscus">twenty-two</GradientText>.
          </>
        }
        body={[
          fakeMessage(
            "CodeDay has been putting students in front of work people were waiting on since 2009, years before anyone would hire them. The maintainers who merge it are the first to notice.",
          ),
        ]}
        actions={[
          { label: fakeMessage("See where they started"), href: "#section-2", style: "link" },
        ]}
      />
    </Box>
  ),
};

export const Section: Story = {
  name: "Section — text-link action, gradient mid",
  render: () => (
    <Box maxWidth="4xl" padding="6">
      <StatementBlock
        size="section"
        heading={fakeMessage("Why this matters more than it did five years ago")}
        body={[
          fakeMessage(
            "GenAI made the work someone else specified cheap. Models do entry-level work now, or soon will.",
          ),
          fakeMessage(
            "What is left is the work nobody specified: finding what is worth building, knowing a field well enough to tell what would help, and finishing it for someone who is waiting on it.",
          ),
        ]}
      />
    </Box>
  ),
};

export const Closing: Story = {
  name: "Closing — heading in a capped gradient field with grain",
  render: () => (
    <Box maxWidth="4xl" padding="6" bg="gray.50">
      <StatementBlock
        size="closing"
        field="hibiscus"
        heading={fakeMessage("Help a student finish what they started.")}
        body={[
          fakeMessage("A seat on a Micro-Internship, a Capstone, or a Residency starts here."),
        ]}
        actions={[{ label: fakeMessage("Support a student's seat"), href: "#" }]}
      />
    </Box>
  ),
};
