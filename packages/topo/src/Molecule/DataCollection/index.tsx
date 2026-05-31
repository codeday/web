import { Box, Grid, Link } from "@codeday/topo/Atom";
import { useTheme } from "@codeday/topo/utils";
import { Promise, Secure, UiInfo } from "@codeday/topocons";
import * as m from "@codeday/i18n/messages";
import React from "react";

const MessageIcons = {
  pii: Promise,
  payment: Secure,
};
interface DataCollectionProps {
  message: "pii" | "payment";
}
function DataCollection({ message }: DataCollectionProps) {
  const { fontSizes } = useTheme();
  const renderedText = message === "pii"
    ? m.topo_datacollection_pii_notice()
    : m.topo_datacollection_payment_notice();
  const moreInfo = m.topo_datacollection_more_info();

  const MessageIcon = MessageIcons[message] || UiInfo;

  return (
    <Box color="current.textLight">
      <Grid
        templateColumns={{ base: "1fr", md: `${fontSizes["2xl"]} 1fr` }}
        gap={4}
        alignItems="center"
      >
        <Box display={{ base: "none", md: "block" }} fontSize="2xl">
          <MessageIcon style={{ position: "relative", top: "-2px", fill: "currentColor" }} />
        </Box>
        <Box fontSize="sm">
          {renderedText} (
          <Link href="https://www.codeday.org/privacy" target="_blank">
            {moreInfo}
          </Link>
          )
        </Box>
      </Grid>
    </Box>
  );
}

export { DataCollection, type DataCollectionProps };
