import { Box, Select, TextInput, Textarea } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof TextInput> = {
  title: "Atom/Input",
  component: TextInput,
};
export default meta;

type Story = StoryObj<typeof TextInput>;

export const InputTextareaSelect: Story = {
  name: "Input, Textarea, Select",
  render: () => (
    <Box display="flex" flexDirection="column" gap={3} width="72">
      <TextInput placeholder="Text input" />
      <Textarea placeholder="Textarea" />
      <Select>
        <option>One</option>
        <option>Two</option>
      </Select>
    </Box>
  ),
};
