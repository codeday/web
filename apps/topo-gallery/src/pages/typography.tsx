import { Box, Eyebrow, GradientText, Heading, Highlight, PullQuote, SectionRule, Text } from "@codeday/topo/Atom";
import React from "react";

import { GalleryPage, Section } from "../components/GalleryLayout";

export default function TypographyPage() {
  return (
    <GalleryPage title="Typography">
      <Section title="Headline — zero tracking (no negative letter-spacing)">
        <Heading as="h2" fontSize="5xl">
          Zero-tracking headline
        </Heading>
      </Section>

      <Section title="Gradient text">
        <GradientText fontSize="3xl" fontWeight="800">
          Gradient fill
        </GradientText>
      </Section>

      <Section title="Highlight — band with room above/below, clones across a wrap">
        <Text maxWidth="360px">
          Some copy with a{" "}
          <Highlight>
            highlighted phrase that is long enough to wrap onto a second line so the band&apos;s
            clone behavior
          </Highlight>{" "}
          is actually visible.
        </Text>
      </Section>

      <Section title="Eyebrow — accentOnWhite, not the raw 62% stop">
        <Eyebrow ramp="marmalade">Marmalade eyebrow</Eyebrow>
        <Eyebrow ramp="hibiscus">Hibiscus eyebrow</Eyebrow>
      </Section>

      <Section title="Pull quote">
        <PullQuote>&ldquo;A pull quote with a colored rule.&rdquo;</PullQuote>
      </Section>

      <Section title="Section rule + margin index — the primary sectioning device">
        <Box width="100%">
          <SectionRule index="01">
            <Text mb={0}>First section</Text>
          </SectionRule>
        </Box>
      </Section>
    </GalleryPage>
  );
}
