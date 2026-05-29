import { Box, Grid, Link } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import * as m from "@codeday/i18n/messages";
import { Eco } from "@codeday/topocons";
import React from "react";

import { usePageData } from "@codeday/topo/Theme";

export default function EcoBox() {
  const { eco, learnMore } = usePageData().cms;

  return (
    <Content color="current.textLight" mt={16} mb={-12}>
      <Grid
        borderWidth={1}
        rounded="md"
        p={8}
        gap={8}
        templateColumns="1fr 100%"
        alignItems="center"
      >
        <Box float="left" fontSize="2xl">
          <Eco />
        </Box>
        <Box pr={8}>
          {eco?.items[0]?.value}{" "}
          <Link href="/eco">{learnMore?.items[0]?.value || m.www_ecobox_learn_more()}</Link>
        </Box>
      </Grid>
    </Content>
  );
}
