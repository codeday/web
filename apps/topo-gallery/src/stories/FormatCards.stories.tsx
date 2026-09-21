import { Box, Heading, Text } from "@codeday/topo/Atom";
import { FormatCards } from "@codeday/topo/Organism";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { fakeMessage as fm } from "../lib/fakeMessage";

const meta: Meta<typeof FormatCards> = {
  title: "Organism/FormatCards",
  component: FormatCards,
};
export default meta;

type Story = StoryObj<typeof FormatCards>;

export const ThreeCards: Story = {
  name: "Three cards, escalating depth (flat / modal / rail) — Micro-Internship absorbs Capstone as a route",
  render: () => (
    <Box maxWidth="5xl">
      <Box maxWidth="container.lg" marginX="auto">
        <Box marginBottom="6" maxWidth="60ch">
          <Heading
            as="h2"
            fontSize="clamp({fontSizes.2xl}, 3.4vw, {fontSizes.4xl})"
            fontWeight="700"
            margin="0"
            color="black"
          >
            {fm("The only thing that moves you along is what you finished.")}
          </Heading>
          <Text marginTop="2" fontSize="md" color="gray.700">
            {fm(
              "The formats stack. The only thing that moves you along is what you have finished.",
            )}
          </Text>
        </Box>
      </Box>
      <FormatCards
        ramp="blackberry"
        cards={[
          {
            id: "event",
            duration: fm("12-24 hours"),
            name: fm("CodeDay Event"),
            body: fm(
              "Pitch the thing you want to make on Saturday morning. Build it with a team. By Saturday night, people who have never met you will see it work.",
            ),
            depth: "flat",
            actions: [{ label: fm("Find a city"), href: "https://event.codeday.org" }],
          },
          {
            id: "microinternship",
            duration: fm("1-2 months"),
            name: fm("CodeDay Micro-Internship"),
            body: fm(
              "One real issue in a project people actually use, a mentor who has done this before, and a maintainer who will merge your fix or tell you why not.",
            ),
            depth: "modal",
            span: 1.45,
            routes: [
              {
                id: "own",
                label: fm("On your own time"),
                detail: fm("Apply directly. Nothing to enrol in."),
                action: { label: fm("Apply"), href: "#" },
              },
              {
                id: "credit",
                label: fm("For credit"),
                detail: fm("Your college's course, your college's credit."),
                action: { label: fm("Ask your department"), href: "#" },
              },
            ],
          },
          {
            id: "residency",
            duration: fm("3+ months"),
            name: fm("CodeDay Residency"),
            body: fm(
              "You already shipped a fix a maintainer merged. Now find what the project needs next, make the case to the people who run it, and build it. They can say no. You keep going until it is in.",
            ),
            depth: "rail",
            actions: [
              {
                label: fm("By invitation only"),
                info: {
                  heading: fm("How invitations work"),
                  body: fm(
                    "Residency spots aren't applied for — students are invited based on how they showed up during a Micro-Internship.",
                  ),
                },
              },
            ],
          },
        ]}
      />
    </Box>
  ),
};
