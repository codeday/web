import { Collapsible } from "@chakra-ui/react";
import * as m from "@codeday/i18n/messages";
import { Box, Link, Text } from "@codeday/topo/Atom";
import { FooterHeading } from "@codeday/topo/Organism";
import { UiArrowRight } from "@codeday/topocons";
import React from "react";

const BARE_URL = /((?:[a-z0-9-]+\.)+(?:gov|org|com|edu|net)\/[^\s]*[^\s.,;:)])/gi;

function linkify(text: string) {
  return text.split(BARE_URL).map((part, i) =>
    i % 2 === 1 ? (
      <Link
        key={i}
        href={`https://${part}`}
        target="_blank"
        rel="noopener"
        color="hibiscus.600"
        textDecoration="underline"
        textDecorationColor="currentColor"
      >
        {part}
      </Link>
    ) : (
      part
    ),
  );
}

interface DisclaimerFooterProps {
  statements: string[];
  notices: string[];
}

export default function DisclaimerFooter({ statements, notices }: DisclaimerFooterProps) {
  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.50" }}
      border="sm"
      borderColor="current.border"
      borderRadius="xl"
      padding={{ base: 5, md: 6 }}
    >
      <FooterHeading>{m.www_page_disclaimer_heading()}</FooterHeading>
      <Box display="flex" flexDirection="column" gap={3}>
        {statements.map((text) => (
          <Text key={text} fontSize="sm" color="gray.700">
            {linkify(text)}
          </Text>
        ))}
        {notices.length > 0 && (
          <Collapsible.Root>
            <Collapsible.Trigger
              display="inline-flex"
              alignItems="center"
              gap={1}
              fontSize="xs"
              color="fg.muted"
              cursor="pointer"
              _hover={{ color: "hibiscus.600" }}
            >
              <UiArrowRight
                transition="transform {durations.fast}"
                css={{ "[data-state=open] > &": { transform: "rotate(90deg)" } }}
              />
              {m.www_page_trademark_notices()}
            </Collapsible.Trigger>
            <Collapsible.Content>
              <Box display="flex" flexDirection="column" gap={2} pt={2}>
                {notices.map((text) => (
                  <Text key={text} fontSize="2xs" color="fg.muted">
                    {linkify(text)}
                  </Text>
                ))}
              </Box>
            </Collapsible.Content>
          </Collapsible.Root>
        )}
      </Box>
    </Box>
  );
}
