import * as m from "@codeday/i18n/messages";
import { Box, Button, Eyebrow } from "@codeday/topo/Atom";
import { Wash } from "@codeday/topo/Molecule";
import React from "react";

import type { Publication } from "../../lib/research/types";

export interface FeaturedBlockProps {
  publication: Publication;
}

export default function FeaturedBlock({ publication }: FeaturedBlockProps) {
  const href = publication.links[0]?.url;
  const authorLine = publication.authors.map((a) => a.name.split(" ").pop()).join(", ");

  return (
    <Wash
      ramp="chilioil"
      shape="rect"
      angle={118}
      mesh
      tall
      as="a"
      {...({ href } as any)}
      display="flex"
      flexDirection="column"
      justifyContent="flex-end"
      color="trueWhite"
      minHeight={{ base: "0", md: "260px" }}
      paddingTop="8"
      paddingInline="7"
      paddingBottom="7"
      borderRadius="11px"
      textDecoration="none"
    >
      <Eyebrow ramp="chilioil" color="whiteAlpha.900">
        {m.www_research_featured_eyebrow({ venue: publication.venue })}
      </Eyebrow>
      <Box
        as="h3"
        fontSize="clamp({fontSizes.xl}, 2.4vw, {fontSizes.3xl})"
        fontWeight="700"
        lineHeight="shorter"
        marginBlockStart="2.5"
      >
        {publication.title}
      </Box>
      {publication.summary && (
        <Box fontSize="md" color="whiteAlpha.900" marginBlockStart="2.5">
          {publication.summary}
        </Box>
      )}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="4"
        marginBlockStart="5"
        flexWrap="wrap"
      >
        <Box fontSize="sm" color="whiteAlpha.800">
          {authorLine}
        </Box>
        <Button variant="onColor" color="colorPalette.800" size="sm" pointerEvents="none">
          {m.www_research_featured_cta()}
        </Button>
      </Box>
    </Wash>
  );
}
