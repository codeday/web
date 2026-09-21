import * as m from "@codeday/i18n/messages";
import { Box, Button, Eyebrow } from "@codeday/topo/Atom";
import { Wash } from "@codeday/topo/Molecule";
import React from "react";

import type { Publication } from "../../lib/research/types";

export interface FeaturedBlockProps {
  publication: Publication;
}

// The one loud device on the page — a link to the newest peer-reviewed
// record, chosen by the page (highest year, then array order), never
// hand-picked.
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
      // 330px (the spec's own figure) left a large empty run of gradient
      // above the bottom-anchored content on most records — 260px is close
      // to what the actual eyebrow+title+summary+footer stack needs, so
      // the field still reads as generously sized without the dead space.
      // FIXME: 260px has no close theme-token match (needs human input).
      minHeight={{ base: "0", md: "260px" }}
      paddingTop="8"
      paddingInline="7"
      paddingBottom="7"
      // The design spec called for a 12% (28px under 860px) radius, but a
      // percentage radius on a wide, short field produces uneven corner
      // curvature, and Wash's own generic "md" default (6px) is too small to
      // read as rounded at all on a box this large — it looked like a sharp
      // corner. 11px matches the site header's own fixed radius, the other
      // large colorful field on this page, so the two read as one language.
      // FIXME: kept as a literal rather than snapped to the "xl" (12px)
      // token — needs confirmation the header's own radius is actually
      // 12px before collapsing this deliberate pixel match.
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
