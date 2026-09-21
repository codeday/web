import { Box, Field, TextInput } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Field.Root> = {
  title: "Atom/Field",
  component: Field.Root,
};
export default meta;

type Story = StoryObj<typeof Field.Root>;

export const LabelHelpError: Story = {
  name: "Field wrapper (label / help / error)",
  render: () => (
    <Box display="flex" flexWrap="wrap" gap={4}>
      <Field.Root width="72">
        <Field.Label>Email</Field.Label>
        <TextInput placeholder="you@example.com" />
        <Field.HelperText>We&apos;ll never share it.</Field.HelperText>
      </Field.Root>
      <Field.Root invalid width="72">
        <Field.Label>Name</Field.Label>
        <TextInput placeholder="Required" />
        <Field.ErrorText>This field is required.</Field.ErrorText>
      </Field.Root>
    </Box>
  ),
};
