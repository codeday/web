import { Box, Button, Heading, HStack } from "@codeday/topo/Atom";
import React from "react";

interface BackgroundStepProps {
  onSelectStudent: () => void;
  onSelectIndustry: () => void;
  background: string;
}

export default function BackgroundStep({
  onSelectStudent,
  onSelectIndustry,
  background,
}: BackgroundStepProps) {
  return (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>
        Are you a student?
      </Heading>
      <HStack>
        <Button
          size="lg"
          mr={4}
          onClick={onSelectStudent}
          data-active={background === "student" ? "" : undefined}
        >
          I am a student
        </Button>
        <Button
          size="lg"
          onClick={onSelectIndustry}
          data-active={background === "industry" ? "" : undefined}
        >
          I am not a student
        </Button>
      </HStack>
    </Box>
  );
}
