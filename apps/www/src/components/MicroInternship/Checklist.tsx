import { Box } from "@codeday/topo/Atom";
import { UiCheck } from "@codeday/topocons";
import React from "react";

export default function Checklist({ items }: { items: React.ReactNode[] }) {
  return (
    <Box
      as="ul"
      margin="0"
      padding="0"
      listStyleType="none"
      display="flex"
      flexDirection="column"
      gap="2.5"
    >
      {items.map((item, i) => (
        <Box
          as="li"
          key={i}
          display="flex"
          gap="2.5"
          fontSize="md"
          lineHeight="moderate"
          color="gray.700"
        >
          <UiCheck boxSize="4.5" color="colorPalette.600" flexShrink={0} marginTop="0.5" />
          <Box as="span">{item}</Box>
        </Box>
      ))}
    </Box>
  );
}
