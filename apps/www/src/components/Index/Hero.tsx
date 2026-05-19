import { Box, Grid, VisibilityCheckBox, Text, Heading, Button } from "@codeday/topo/Atom";
import { MediaPlay as Play, Broadcast } from "@codeday/topocons";
import React from "react";

import { usePageData } from "@codeday/topo/Theme";
import useTwitch from "../../useTwitch";
import { VideoLink } from "@codeday/topo/Molecule";
import Live from "./Live";
import Teaser from "./Teaser";

export default function Hero({ ...props }: any) {
  const {
    cms: { tagline, mission, explainer },
  } = usePageData();
  const twitch = useTwitch();

  const taglineBlock = (
    <Box
      m={{ base: 8, lg: 0, xl: 16 }}
      mt={{ base: 0, xl: 0 }}
      textAlign={{ base: "center", lg: "left" }}
    >
      <Heading as="h2" fontSize="6xl" fontWeight="bold" lineHeight="1.1" mt={0}>
        {tagline?.items[0]?.value}
      </Heading>
      <Text fontSize="xl" mt={8} mb={8}>
        {mission?.items[0]?.value}
      </Text>
      {explainer && (
        <VideoLink url={explainer.url} autoPlay>
          <Button colorPalette="red">
            Learn More&nbsp;
            <Play style={{ position: "relative", top: "-0.15em" }} />
          </Button>
        </VideoLink>
      )}
    </Box>
  );
  return (
    <Box maxWidth="1800px" role="banner" m="0 auto" {...props}>
      <Grid
        templateColumns={{ base: "1fr", lg: "8fr 10fr", xl: "4fr 3fr" }}
        gap={8}
        pl={4}
        pr={4}
        pt={8}
        overflow={!twitch?.username && "hidden"}
      >
        {taglineBlock}
        <VisibilityCheckBox display={{ base: "none", lg: "block" }} mt={{ base: 12, xl: -12 }}>
          {twitch?.username ? (
            <Box>
              <Box fontWeight="bold">
                <Box as="span" color="red.600">
                  <Broadcast style={{ position: "relative", top: "-0.15em" }} /> LIVE
                  {twitch.title && ": "}
                </Box>
                {twitch.title && (
                  <Box as="span" color="current.textLight">
                    {twitch.title}
                  </Box>
                )}
              </Box>
              <Box shadow="sm" rounded="sm" borderWidth={1}>
                <Live username={twitch.username} />
              </Box>
            </Box>
          ) : (
            <Box shadow="sm" rounded="sm" borderWidth={1}>
              <Teaser />
            </Box>
          )}
        </VisibilityCheckBox>
      </Grid>
    </Box>
  );
}
