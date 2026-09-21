import {
  Alert,
  AlertActions,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
} from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Alert> = {
  title: "Atom/Alert",
  component: Alert,
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Variants: Story = {
  name: "Alert variants (the icon is not a coloured square inside a coloured box)",
  render: () => (
    <Box display="flex" flexDirection="column" gap={3} width="full">
      <Alert variant="hairline" colorPalette="blue" index="01">
        <AlertIcon />
        <Box>
          <AlertTitle>Hairline</AlertTitle>
          <AlertDescription>Borrows the section rule device.</AlertDescription>
        </Box>
      </Alert>
      <Alert variant="solid" colorPalette="red">
        <AlertIcon />
        <AlertTitle>Solid — critical&apos;s layout, flat colour</AlertTitle>
      </Alert>
      <Alert variant="rail" colorPalette="green">
        <AlertIcon />
        <AlertTitle>Rail — gradient stops at the 62% mark</AlertTitle>
      </Alert>
      <Alert variant="critical" colorPalette="hibiscus" data-testid="critical-alert">
        <AlertIcon />
        <AlertTitle>Critical — the only alert that takes a full field</AlertTitle>
      </Alert>
    </Box>
  ),
};

export const Actions: Story = {
  name: "Alert actions — inside the text column, never floated right",
  render: () => (
    <Box display="flex" flexDirection="column" gap={3} width="full">
      <Alert variant="solid" colorPalette="orange">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Your plan expires in 3 days</AlertTitle>
          <AlertDescription>Renew now to keep access to paid features.</AlertDescription>
          <AlertActions>
            <Button size="sm" variant="onColor" color="colorPalette.900">
              Renew now
            </Button>
            <Button size="sm" variant="onColorOutline">
              Remind me later
            </Button>
          </AlertActions>
        </AlertContent>
      </Alert>
      <Alert variant="critical" colorPalette="chilioil" data-testid="critical-alert-action">
        <AlertIcon />
        <AlertContent>
          <AlertTitle>Delete this workspace?</AlertTitle>
          <AlertDescription>
            All projects, files, and members will be permanently removed.
          </AlertDescription>
          <AlertActions>
            <Button size="sm" variant="onColor" color="colorPalette.800">
              Delete workspace
            </Button>
          </AlertActions>
        </AlertContent>
      </Alert>
    </Box>
  ),
};
