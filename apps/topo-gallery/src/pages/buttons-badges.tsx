import { Badge, Box, Button } from "@codeday/topo/Atom";
import React from "react";

import { GalleryPage, Section } from "../components/GalleryLayout";

export default function ButtonsBadgesPage() {
  return (
    <GalleryPage title="Buttons & badges">
      <Section title="Button variants">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="dangerSolid">Danger solid</Button>
        <Button variant="icon">+</Button>
      </Section>

      <Section title="Button sizes">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </Section>

      <Section title="Button states">
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
      </Section>

      <Section title="Per-section primary fills">
        {(["hibiscus", "hotsauce", "chilioil", "blackberry", "figjam", "marmalade"] as const).map((ramp) => (
          <Button key={ramp} colorPalette={ramp}>
            {ramp}
          </Button>
        ))}
      </Section>

      <Section title="Badge variants">
        <Badge colorPalette="green" variant="solid">
          Solid
        </Badge>
        <Badge colorPalette="hibiscus" variant="gradient">
          Gradient
        </Badge>
        <Badge colorPalette="blue" variant="outline">
          Outline
        </Badge>
        <Badge colorPalette="red" variant="dot">
          Dot
        </Badge>
        <Badge colorPalette="purple" variant="squircle">
          Squircle
        </Badge>
        <Badge colorPalette="teal" variant="solid" count={12}>
          Split count
        </Badge>
      </Section>

      <Box mt={4} fontSize="sm" color="current.textLight">
        Check: the danger button never takes a gradient; the dot badge&apos;s only colour is the
        dot itself.
      </Box>
    </GalleryPage>
  );
}
