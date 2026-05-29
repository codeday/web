import { Box, Text, Heading, Grid, VisibilityCheckBox, RatioBox } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import * as m from "@codeday/i18n/messages";
import shuffle from "knuth-shuffle-seeded";
import React, { useState, useReducer, useEffect } from "react";

import { usePageData } from "@codeday/topo/Theme";
import VideoTestimonialThumbnail from "../../VideoTestimonialThumbnail";
import Globe from "./Globe";
import TextQuote from "./TextQuote";

const DISPLAY_TIME = 10;
const TRANSITION_TIME = 0.5;

interface QuotesProps {
  seed?: number;
}

export default function Quotes({ seed }: QuotesProps) {
  const {
    cms: { quoteRegions, quoteTestimonials },
  } = usePageData();
  const textQuotes = shuffle(
    quoteTestimonials?.items.filter((q: any) => !q.video),
    seed,
  );
  const videoQuotes = shuffle(
    quoteTestimonials?.items.filter((q: any) => q.video?.url && q.image?.url),
    seed,
  );

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visibleQuoteIndex, nextQuote] = useReducer(
    (previous: number) => (previous + 1) % textQuotes.length,
    0,
  );

  // Set up the quote transition interval
  useEffect(() => {
    if (typeof window === "undefined") return;
    let transitionTimeout: ReturnType<typeof setTimeout> | null;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      transitionTimeout = setTimeout(() => {
        transitionTimeout = null;
        nextQuote();
        setIsTransitioning(false);
      }, TRANSITION_TIME * 1000);
    }, DISPLAY_TIME * 1000);
    return () => {
      clearInterval(interval);
      if (transitionTimeout) clearTimeout(transitionTimeout);
    };
  }, [typeof window, TRANSITION_TIME, DISPLAY_TIME]);

  return (
    <>
      <Content>
        <Heading as="h3" fontSize="2xl" fontWeight="bold" mt={0} textAlign="center">
          {m.www_quotes_locations({ count: String(quoteRegions?.items?.length) })}
        </Heading>
        <Grid
          templateColumns={{ base: "1fr", lg: "40% 60%" }}
          alignItems="center"
          gap={8}
          position="relative"
        >
          {/* Globe */}
          <VisibilityCheckBox display={{ base: "none", lg: "block" }}>
            <RatioBox w="1" h="1" auto="h">
              <Globe testimonial={textQuotes[visibleQuoteIndex]} regions={quoteRegions?.items} />
            </RatioBox>
          </VisibilityCheckBox>

          {/* Text Quote */}
          <Box>
            <TextQuote
              testimonial={textQuotes[visibleQuoteIndex]}
              opacity={isTransitioning ? 0 : 1}
              transition={`opacity ${TRANSITION_TIME / 2}s`}
            />
          </Box>
        </Grid>
      </Content>
      <Content wide>
        <Text color="current.textLight" fontSize="2xl" mt={12} mb={8} textAlign="center">
          {m.www_quotes_hear_more()}
        </Text>
        <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, minmax(0, 1fr))" }} gap={6}>
          {videoQuotes.map((q: any) => (
            <VideoTestimonialThumbnail key={q.video.url} video={q} />
          ))}
        </Grid>
      </Content>
    </>
  );
}
