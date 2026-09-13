import { Box, Progress, Skelly, Spinner, StatTile, StatusDot, Table } from "@codeday/topo/Atom";
import React from "react";

import { GalleryPage, Section } from "../components/GalleryLayout";

export default function DataPage() {
  return (
    <GalleryPage title="Data & dashboard">
      <Section title="Table — no fields, runs on the semantic palette alone">
        <Table.Root width="100%">
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
      </Section>

      <Section title="StatTile — the one home for the radial gradient">
        <StatTile number="2,299,282" label="Hours Solving" colorPalette="hibiscus" />
        <StatTile number="524" label="Events" colorPalette="figjam" />
        <StatTile number="71,056" label="Alumni" colorPalette="chilioil" />
      </Section>

      <Section title="Progress — the fill is the one small element that earns a ramp">
        <Box width="240px">
          <Progress.Root value={60} colorPalette="hibiscus">
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
        </Box>
      </Section>

      <Section title="Skeleton — retuned neutrals">
        <Skelly width="240px" />
      </Section>

      <Section title="Spinner — single colour, never multi-stop">
        <Spinner colorPalette="hibiscus" />
        <Spinner colorPalette="figjam" />
      </Section>

      <Section title="StatusDot — colour is never the only signal">
        <StatusDot online label="Online" />
        <StatusDot away label="Away" />
        <StatusDot offline label="Offline" />
      </Section>
    </GalleryPage>
  );
}
