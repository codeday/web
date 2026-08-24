import { Box, Grid, Image, Text } from "@codeday/topo/Atom";
import { Slides } from "@codeday/topo/Molecule";
import React from "react";

import { ALUMNI_STORIES } from "./stories";

export default function StoryCarousel(props: any) {
  return (
    <Slides duration={12} h={40} {...props}>
      {ALUMNI_STORIES.map((story) => (
        <Box key={story.name}>
          <Grid templateColumns="auto 1fr" gap={4} alignItems="center" mb={3}>
            <Box
              rounded="full"
              overflow="hidden"
              w={16}
              h={16}
              backgroundColor="gray.200"
              flexShrink={0}
            >
              <Image src={story.photoUrl} alt={story.name} w="100%" />
            </Box>
            <Box>
              <Text mb={0} fontWeight="bold">
                {story.name}
              </Text>
              <Text mb={0} fontSize="sm" color="current.textLight">
                {story.thenLabel}
              </Text>
              <Text mb={0} fontSize="sm" fontWeight="bold">
                Today: {story.nowLabel}
              </Text>
            </Box>
          </Grid>
          <Text fontSize="sm" fontStyle="italic" color="current.textLight">
            &ldquo;{story.quote}&rdquo;
          </Text>
        </Box>
      ))}
    </Slides>
  );
}
