import { Box, Button, Heading, HStack } from "@codeday/topo/Atom";
import * as m from "@codeday/i18n/messages";
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
        {m.www_wizard_are_you_student()}
      </Heading>
      <HStack>
        <Button
          size="lg"
          mr={4}
          onClick={onSelectStudent}
          data-active={background === "student" ? "" : undefined}
        >
          {m.www_wizard_i_am_student()}
        </Button>
        <Button
          size="lg"
          onClick={onSelectIndustry}
          data-active={background === "industry" ? "" : undefined}
        >
          {m.www_wizard_i_am_not_student()}
        </Button>
      </HStack>
    </Box>
  );
}
