import * as m from "@codeday/i18n/messages";
import { Box } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import React from "react";

import type { ResearchStats } from "../../lib/research/stats";

function Tile({ figure, caption }: { figure: number; caption: string }) {
  return (
    <Box borderTop="sm" borderTopColor="colorPalette.300" paddingTop="3">
      <Box
        fontSize="4xl"
        fontWeight="800"
        lineHeight="1.0"
        css={{ fontVariantNumeric: "tabular-nums" }}
      >
        {figure}
      </Box>
      <Box fontSize="sm" color="gray.600" marginBlockStart="1">
        {caption}
      </Box>
    </Box>
  );
}

export default function Stats({ stats }: { stats: ResearchStats }) {
  return (
    <Content
      maxW="container.xl"
      marginBottom="0"
      display="grid"
      gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
      gap="6"
      paddingBlock={{ base: "6", md: "0" }}
    >
      <Tile figure={stats.count} caption={m.www_research_stat_papers_label()} />
      <Tile figure={stats.venues} caption={m.www_research_stat_venues_label()} />
      <Tile figure={stats.coauthors} caption={m.www_research_stat_coauthors_label()} />
      <Tile figure={stats.talks} caption={m.www_research_stat_talks_label()} />
    </Content>
  );
}
