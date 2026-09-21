import { Box, Card, CardBody, CardFooter, CardHeader } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Card> = {
  title: "Atom/Card",
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

export const HeadingInFieldPlainVariant: Story = {
  name: "Card — heading in the field, plain variant for dense lists",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4} alignItems="flex-start">
      <Card width="72">
        <CardHeader>
          <Box color="white" fontWeight="800" fontSize="md">
            Card heading
          </Box>
        </CardHeader>
        <CardBody>Body content sits below the field.</CardBody>
        <CardFooter>Action row</CardFooter>
      </Card>
      <Card variant="plain" width="72">
        <CardBody>Plain — no field, for dense lists.</CardBody>
      </Card>
    </Box>
  ),
};
