import { Box, Flex, Grid, Text, Heading, Link, Button, Image } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { print } from "graphql";
import { DateTime } from "luxon";
import { GetStaticProps } from "next";
import React from "react";

import ContentfulRichText from "../components/ContentfulRichText";
import Page from "../components/Page";
import PhotoGallery from "../components/Press/PhotoGallery";
import PreviousCoverageLogos from "../components/PreviousCoverageLogos";
import { usePageData } from "@codeday/topo/Theme";
import { PressQuery } from "./press.gql";

interface PressProps {
  seed: string;
}

export default function Press({ seed }: PressProps) {
  const {
    cms: { mission, pressContact, pressDetails, programs, previousCoverage },
  } = usePageData();

  return (
    <Page slug="/press" title="Press">
      <Content>
        <Heading as="h2" fontSize="5xl" mb={8} mt={-8}>
          Press Kit
        </Heading>
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8} mb={8}>
          <Box>
            <Text fontSize="xl" mb={8}>
              {mission?.items[0]?.value}
            </Text>
            <ContentfulRichText json={pressDetails?.items[0]?.richValue?.json} />

            <Heading as="h4" fontSize="lg" mt={6} mb={4}>
              Our Programs:
            </Heading>
            {programs?.items?.map((program: any) => (
              <Box key={program.name}>
                <Text fontWeight="bold" mb={0}>
                  <Image src={program.logo.url} height="1em" display="inline-block" mr={2} alt="" />
                  {program.name}
                </Text>
                <Text>{program.shortDescription}</Text>
              </Box>
            ))}
          </Box>
          <Box>
            <Box
              p={4}
              pb={0}
              mb={4}
              borderWidth={1}
              borderColor="blue.600"
              bg="blue.50"
              color="blue.900"
            >
              <Heading as="h3" fontSize="lg" mb={4} fontWeight="bold">
                Press Contact
              </Heading>
              <ContentfulRichText json={pressContact?.items[0]?.richValue?.json} />
            </Box>

            <Box textAlign="center">
              <Button colorPalette="blue" as="a" {...({ href: "#assets" } as any)}>
                Download Press Images &amp; Logos
              </Button>
            </Box>

            <Box textAlign="center" mt={4}>
              <Text color="current.textLight" fontWeight="bold">
                As Seen In
              </Text>
              <PreviousCoverageLogos
                num={4}
                mr={4}
                mb={2}
                width={24}
                style={{ filter: "grayscale(1)" }}
                opacity="0.6"
              />
            </Box>
          </Box>
        </Grid>
      </Content>

      <Content wide borderWidth={1} rounded="md" p={4} shadow="lg" mb={16}>
        <Heading as="h3" fontSize="2xl" mb={8} textAlign="center">
          Recent Coverage
        </Heading>
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(4, 1fr)",
          }}
          gap={8}
          mb={8}
        >
          {previousCoverage?.items?.map((coverage: any) => (
            <Box
              as="a"
              {...({ href: coverage.url, target: "_blank", rel: "noopener" } as any)}
              key={coverage.url}
            >
              <Text fontWeight="bold" mb={0}>
                {coverage.title}
              </Text>
              <Text color="current.textLight">
                {coverage.publicationName},{" "}
                {DateTime.fromISO(coverage.date).toLocaleString({ month: "long", year: "numeric" })}
              </Text>
            </Box>
          ))}
        </Grid>
      </Content>

      <Content>
        <Heading as="h3" fontSize="2xl" mb={4}>
          <a {...({ name: "assets" } as any)}></a>Assets
        </Heading>
        <Box
          as="a"
          display="block"
          rel="license"
          {...({ href: "http://creativecommons.org/licenses/by/4.0/" } as any)}
          mb={2}
        >
          <Image
            alt="Creative Commons License"
            src="https://i.creativecommons.org/l/by/4.0/88x31.png"
          />
        </Box>
        <Text>
          The assets on this page are licensed under a{" "}
          <Link rel="license" href="http://creativecommons.org/licenses/by/4.0/">
            Creative Commons Attribution 4.0 International License
          </Link>
          , you may use them without prior permission so long as you provide credit to CodeDay.
        </Text>
        <Text>
          Editorial use by the media without attribution is permitted. All pictured individuals have
          media waivers on file.
        </Text>
        <Flex alignItems="center">
          <Button
            as="a"
            colorPalette="blue"
            {...({ href: "https://f1.codeday.org/logos.zip" } as any)}
          >
            Download Logos
          </Button>
          <Text mb={0} pl={4} fontSize="sm" color="current.textLight">
            All logos and names are trademarks of CodeDay.
          </Text>
        </Flex>
      </Content>
      <PhotoGallery seed={seed} />
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const query = await apiFetch(print(PressQuery), {}, {});

  return {
    props: {
      query,
      seed: Math.random().toString(),
    },
    revalidate: 300,
  };
};
