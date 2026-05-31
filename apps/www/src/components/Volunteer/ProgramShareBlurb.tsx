import { Box, Grid, Text, Heading, Image, Button, Divider, Link } from "@codeday/topo/Atom";
import { UiArrowDown, UiArrowUp, FilePdf } from "@codeday/topocons";
import React, { useState } from "react";

import { ContentfulRichText } from "@codeday/topo/Molecule";

interface ProgramShareBlurbProps {
  program: any;
}

export default function ProgramShareBlurb({ program }: ProgramShareBlurbProps) {
  const [blurbVisible, setBlurbVisible] = useState(false);
  if (!program.volunteerBlurb) return <></>;

  return (
    <>
      <Link as="div" onClick={() => setBlurbVisible(!blurbVisible)} position="relative" mt={4}>
        <Box textAlign="center">
          <Box bg="current.bg" display="inline-block" p={4} color="blue.800">
            <Link as="div" display="inline-block" mr={2}>
              {blurbVisible ? "Hide" : "Share With Co-Workers"}
            </Link>
            {blurbVisible ? <UiArrowUp /> : <UiArrowDown />}
          </Box>
        </Box>
        <Divider
          display={blurbVisible ? null : "none"}
          position="absolute"
          top="50%"
          transform="translateY(-0.5em)"
          left={0}
          right={0}
          zIndex={-1}
        />
      </Link>
      <Grid
        display={blurbVisible ? null : "none"}
        templateColumns={{ base: "1fr", md: "8fr 3fr" }}
        gap={8}
      >
        <Box>
          <Heading as="h4" fontSize="2xl" mb={4}>
            Copy-Pastable Email Blurb
          </Heading>
          <Box pl={4} ml={4} borderLeftWidth={2} borderColor="blue.600">
            <ContentfulRichText json={program.volunteerBlurb.json} />
          </Box>
        </Box>
        <Box>
          <Button
            as="a"
            target="_blank"
            {...({
              href: `https://www.linkedin.com/shareArticle/?url=${encodeURIComponent(
                `https://www.codeday.org/volunteer/${program.webname}`,
              )}`,
            } as any)}
            colorPalette="blue"
            mb={8}
          >
            Share on LinkedIn
          </Button>
          {program.volunteerRecruitingResources?.items.length > 0 && (
            <>
              <Heading as="h4" fontSize="xl" mb={4}>
                More Resources
              </Heading>
              {program.volunteerRecruitingResources?.items.map((i: any) => (
                <Link {...({ href: i.url } as any)} target="_blank" rel="noopener">
                  <Grid
                    templateColumns="1fr 3fr"
                    borderWidth={1}
                    mb={1}
                    gap={2}
                    alignItems="center"
                    minHeight={16}
                  >
                    {i.contentType.split("/")[0] === "image" ? (
                      <Image src={i.preview} alt={i.title} />
                    ) : (
                      <Box fontSize={32} textAlign="center">
                        <FilePdf />
                      </Box>
                    )}
                    <Text fontSize="sm" color="current.textLight" mb={0}>
                      {i.title}
                    </Text>
                  </Grid>
                </Link>
              ))}
            </>
          )}
        </Box>
      </Grid>
    </>
  );
}
