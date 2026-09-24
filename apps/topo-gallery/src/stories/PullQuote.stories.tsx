import { Box } from "@codeday/topo/Atom";
import { PullQuote } from "@codeday/topo/Organism";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { fakeMessage } from "../lib/fakeMessage";

const meta: Meta<typeof PullQuote> = {
  title: "Organism/PullQuote",
  component: PullQuote,
};
export default meta;

type Story = StoryObj<typeof PullQuote>;

export const Default: Story = {
  name: "Pull quote",
  render: () => <PullQuote>&ldquo;A pull quote with a colored rule.&rdquo;</PullQuote>,
};

export const Feature: Story = {
  name: "Feature — roman, not italic; renders nothing when quote is empty",
  render: () => (
    <Box display="flex" flexDirection="column" gap="8" maxWidth="container.sm">
      <PullQuote
        size="feature"
        ramp="chilioil"
        eyebrow={fakeMessage("MAINTAINER")}
        quote={fakeMessage(
          "I proposed a feature to the project's maintainers and built it after they asked for changes.",
        )}
        name={fakeMessage("Jordan Lee")}
        role={fakeMessage("third-year contributor")}
        project={fakeMessage("Home Assistant")}
        href="#"
      />
      <PullQuote
        size="feature"
        ramp="chilioil"
        quote={fakeMessage("")}
        name={fakeMessage("Nobody")}
        data-testid="empty-feature-quote"
      />
    </Box>
  ),
};
