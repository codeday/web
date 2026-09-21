import * as m from "@codeday/i18n/messages";
import { Box } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import React from "react";

interface Step {
  label: React.ReactNode;
  heading: React.ReactNode;
  body: React.ReactNode;
}

function StepColumn({ step }: { step: Step }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="3.5"
      paddingTop="5"
      borderTop="sm"
      borderTopColor="current.border"
    >
      <Box as="span" fontFamily="mono" fontSize="sm" color="colorPalette.600">
        {step.label}
      </Box>
      <Box as="h3" margin="0" fontSize="2xl" fontWeight="700">
        {step.heading}
      </Box>
      <Box fontSize="md" lineHeight="moderate" color="gray.700">
        {step.body}
      </Box>
    </Box>
  );
}

export default function HowItWorks() {
  const steps: Step[] = [
    {
      label: m.www_microinternship_how_week1_label(),
      heading: m.www_microinternship_how_week1_heading(),
      body: m.www_microinternship_how_week1_body(),
    },
    {
      label: m.www_microinternship_how_following_label(),
      heading: m.www_microinternship_how_following_heading(),
      body: m.www_microinternship_how_following_body(),
    },
    {
      label: m.www_microinternship_how_done_label(),
      heading: m.www_microinternship_how_done_heading(),
      body: m.www_microinternship_how_done_body(),
    },
  ];

  return (
    <Content
      maxW="container.xl"
      marginBottom="0"
      display="grid"
      gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
      gap="8"
    >
      {steps.map((step, i) => (
        <StepColumn key={i} step={step} />
      ))}
    </Content>
  );
}
