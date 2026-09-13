import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  EmptyState,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Tooltip,
} from "@codeday/topo/Atom";
import React, { useState } from "react";

import { GalleryPage, Section } from "../components/GalleryLayout";

export default function AlertsCardsPage() {
  const [open, setOpen] = useState(false);
  return (
    <GalleryPage title="Alerts & cards">
      <Section title="Alert variants (the icon is not a coloured square inside a coloured box)">
        <Box display="flex" flexDirection="column" gap={3} width="100%">
          <Alert variant="hairline" colorPalette="blue">
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
      </Section>

      <Section title="Card — heading in the field, plain variant for dense lists">
        <Card width="280px">
          <CardHeader>
            <Box color="white" fontWeight="800" fontSize="15.5px">
              Card heading
            </Box>
          </CardHeader>
          <CardBody>Body content sits below the field.</CardBody>
          <CardFooter>Action row</CardFooter>
        </Card>
        <Card variant="plain" width="280px">
          <CardBody>Plain — no field, for dense lists.</CardBody>
        </Card>
      </Section>

      <Section title="Chip — removable (must render as a chip, never a circle over its own label)">
        <Chip onRemove={() => {}} data-testid="removable-chip">
          Removable
        </Chip>
        <Chip>Static</Chip>
      </Section>

      <Section title="EmptyState — left-aligned, capped ramp (never white-on-sand)">
        <EmptyState.Root colorPalette="marmalade" width="360px">
          <EmptyState.Content>
            <EmptyState.Title>No results</EmptyState.Title>
            <EmptyState.Description color="whiteAlpha.800">
              Try a different search.
            </EmptyState.Description>
          </EmptyState.Content>
        </EmptyState.Root>
      </Section>

      <Section title="Tooltip (never a gradient)">
        <Tooltip.Root open>
          <Tooltip.Trigger asChild>
            <Box display="inline-block">Hover target</Box>
          </Tooltip.Trigger>
          <Tooltip.Positioner>
            <Tooltip.Content>A tooltip</Tooltip.Content>
          </Tooltip.Positioner>
        </Tooltip.Root>
      </Section>

      <Section title="Modal (heading in the field, same rule as Card)">
        <button type="button" onClick={() => setOpen(true)}>
          Open modal
        </button>
        <Modal open={open} onOpenChange={(d: any) => setOpen(d.open)}>
          <ModalHeader>
            <ModalTitle>Modal heading</ModalTitle>
          </ModalHeader>
          <ModalBody>Modal body content.</ModalBody>
          <ModalFooter>Actions</ModalFooter>
          <ModalCloseButton />
        </Modal>
      </Section>
    </GalleryPage>
  );
}
