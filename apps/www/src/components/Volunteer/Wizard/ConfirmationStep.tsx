import { Box, Text, Heading, Link } from "@codeday/topo/Atom";
import * as m from "@codeday/i18n/messages";
import React from "react";

interface ConfirmationStepProps {
  submitError: string | false;
}

export default function ConfirmationStep({ submitError }: ConfirmationStepProps) {
  if (submitError) {
    return (
      <Box>
        <Heading as="h3" fontSize="xl" mb={2}>
          {m.www_confirmation_error()}
        </Heading>
        <Text>
          {m.www_confirmation_error_email()}{" "}
          <Link href="mailto:volunteer@codeday.org">volunteer@codeday.org</Link>{" "}
          {m.www_confirmation_error_code()}
        </Text>
        <Text>{submitError}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading as="h3" fontSize="xl" mb={2}>
        {m.www_confirmation_success()}
      </Heading>
      <Text>{m.www_confirmation_success_message()}</Text>
    </Box>
  );
}
