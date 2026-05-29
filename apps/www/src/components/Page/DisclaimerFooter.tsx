import { Box, Text, Heading } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import * as m from "@codeday/i18n/messages";
import React from "react";

interface DisclaimerFooterProps {
  disclaimerTexts: string[];
}

export default function DisclaimerFooter({ disclaimerTexts }: DisclaimerFooterProps) {
  if (!disclaimerTexts || disclaimerTexts.length === 0) return null;

  return (
    <Content>
      <Box
        pl="4"
        pr="4"
        color="current.textLight"
        fontSize="2xs"
        borderWidth="1px"
        borderRadius="sm"
        bg="current.bgLight"
      >
        <Heading as="h3" fontSize="xs" mb={1} mt={2}>
          {m.www_page_disclaimer_heading()}
        </Heading>
        {disclaimerTexts.map((text: string) => (
          <Text mb={4} key={text}>
            {text}
          </Text>
        ))}
      </Box>
    </Content>
  );
}
