import { Box, Text, Heading, Link } from "@codeday/topo/Atom";
import React from "react";

interface ConfirmationStepProps {
  submitError: string | false;
}

export default function ConfirmationStep({ submitError }: ConfirmationStepProps) {
  if (submitError) {
    return (
      <Box>
        <Heading as="h3" fontSize="xl" mb={2}>
          ☹️ An Error Ocurred
        </Heading>
        <Text>
          Please email <Link href="mailto:volunteer@codeday.org">volunteer@codeday.org</Link> with
          your application, as well as the following error code:
        </Text>
        <Text>{submitError}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>
        ✅ Got it!
      </Heading>
      <Text>We'll be in touch over email in the next few days!</Text>
    </Box>
  );
}
