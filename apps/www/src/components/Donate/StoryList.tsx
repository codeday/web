import { Box, Grid, Image, Text, VStack } from "@codeday/topo/Atom";
import React from "react";


export interface AlumniStory {
  name: string;
  photoUrl: string;
  thenLabel: string;
  nowLabel: string;
  quote: string;
}

export const ALUMNI_STORIES: AlumniStory[] = [
  {
    name: "Luiza Cartaxo",
    photoUrl:
      "https://f2.codeday.org/d5pti1xheuyu/4ZIbKznpY100CznvLxg0ob/83f81f937519a2243577d68872f6e771/Maria-Luiza-Cartaxo-Picture-768x1024.jpeg?h=320&fit=fill&w=320",
    thenLabel: "Student at Bellevue College",
    nowLabel: "Software Engineer II at Boeing",
    quote:
      "As an international student in a programming major, you guys totally helped me to start my wonderful career path! In a three years degree, I had you guys as my first experience, Meta as my second, and Microsoft as my third, and this last one gave me a full time return offer.",
  },
  {
    name: "Kelly Dong",
    photoUrl:
      "https://f2.codeday.org/d5pti1xheuyu/1cEMO2exWuCteESR5E0dzf/7a80d8c52958c77257f6be693223522c/Kelly_Dong.jpeg?h=320&fit=fill&w=320",
    thenLabel: "Student at New York City College",
    nowLabel: "Software Engineer at BNY",
    quote:
      "I loved being able to work as a team and gain real world experience about coding but at the same time also having the opportunity to learn something new.",
  },
  {
    name: "Daniel Lobaton",
    photoUrl:
      "https://f2.codeday.org/d5pti1xheuyu/50CgDg3alYgGekfYS3lLmd/b1be3c8a0f56fef878aa1ec5c8a21992/Daniel_Lobaton.jpg?h=320&fit=fill&w=320",
    thenLabel: "Student at University of Florida",
    nowLabel: "Software Engineer at Microsoft",
    quote:
      "Being a Venezuelan immigrant, Labs was the first time that I got true exposure to a community of tech people that I could rely on. Fast forward a couple of years and now I'm three and a half months away from graduating college and have a job as a SWE at the Microsoft HQ right after I graduate.",
  },
];


export default function StoryList(props: any) {
  return (
    <VStack>
      {ALUMNI_STORIES.map((story) => (
        <Box key={story.name} mb={8}>
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
                Now: {story.nowLabel}
              </Text>
            </Box>
          </Grid>
          <Text fontSize="sm" fontStyle="italic" color="current.textLight">
            &ldquo;{story.quote}&rdquo;
          </Text>
        </Box>
      ))}
    </VStack>
  );
}
