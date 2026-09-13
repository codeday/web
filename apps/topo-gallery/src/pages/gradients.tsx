import { Box, GradientField, GradientText } from "@codeday/topo/Atom";
import { gradientStops, type GradientName } from "@codeday/topo/Theme";
import React from "react";

import { GalleryPage, Section } from "../components/GalleryLayout";

const RAMPS = Object.keys(gradientStops) as GradientName[];

export default function GradientsPage() {
  return (
    <GalleryPage title="Gradients & fields">
      <Section title="Rect field — every ramp">
        {RAMPS.map((ramp) => (
          <GradientField key={ramp} ramp={ramp} shape="rect" width="160px" height="100px" />
        ))}
      </Section>

      <Section title="Squircle — square and non-square (never a stretched ellipse)">
        <GradientField ramp="chilioil" shape="squircle" width="140px" height="140px" />
        <GradientField ramp="blackberry" shape="squircle" width="280px" height="120px" />
        <GradientField ramp="hibiscus" shape="squircle" width="90px" height="220px" />
      </Section>

      <Section title="Pill / tint / flat">
        <GradientField ramp="figjam" shape="pill" width="180px" height="90px" />
        <GradientField ramp="marmalade" shape="tint" width="180px" height="90px" borderRadius="lg" />
        <GradientField ramp="hotsauce" shape="flat" width="180px" height="90px" borderRadius="lg" />
      </Section>

      <Section title="Hero mesh — normal and tall (must read as a mesh, not 3 blobs)">
        <GradientField ramp="hibiscus" shape="rect" mesh width="360px" height="220px" />
        <GradientField ramp="hibiscus" shape="rect" mesh tall width="160px" height="360px" />
      </Section>

      <Section title="Gradient text — every ramp">
        {RAMPS.map((ramp) => (
          <GradientText key={ramp} ramp={ramp} fontSize="2xl" fontWeight="800">
            {ramp}
          </GradientText>
        ))}
      </Section>
    </GalleryPage>
  );
}
