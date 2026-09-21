import { Table } from "@codeday/topo/Atom";
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

const meta: Meta<typeof Table.Root> = {
  title: "Atom/Table",
  component: Table.Root,
};
export default meta;

type Story = StoryObj<typeof Table.Root>;

export const SemanticPaletteOnly: Story = {
  name: "Table — no fields, runs on the semantic palette alone",
  render: () => (
    <Table.Root width="full">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Name</Table.ColumnHeader>
          <Table.ColumnHeader>Value</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Row A</Table.Cell>
          <Table.Cell>1</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Row B</Table.Cell>
          <Table.Cell>2</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  ),
};
