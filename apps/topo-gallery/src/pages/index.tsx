import { Box, Text } from "@codeday/topo/Atom";
import React from "react";

import { GalleryPage } from "../components/GalleryLayout";

export default function Index() {
  return (
    <GalleryPage title="Topo component gallery">
      <Text>
        Every component and variant from .spec.md, grouped by section. This route exists for the
        Playwright screenshot pass (§6.2) — pick a section above.
      </Text>
      <Box mt={4} fontSize="sm" color="current.textLight">
        See tests/gallery.spec.ts for the automated checks.
      </Box>
    </GalleryPage>
  );
}
