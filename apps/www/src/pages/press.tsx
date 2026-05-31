import { Box, Flex, Grid, Text, Heading, Link, Button, Image } from "@codeday/topo/Atom";
import { Content, ContentfulRichText } from "@codeday/topo/Molecule";
import * as m from "@codeday/i18n/messages";
import { apiFetch } from "@codeday/topo/utils";
import { print } from "graphql";
import { DateTime } from "luxon";
import { GetStaticProps } from "next";
import React from "react";

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
          {m.www_press_kit()}
        </Heading>
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8} mb={8}>
          <Box>
            <Text fontSize="xl" mb={8}>
              {mission?.items[0]?.value}
            </Text>
            <ContentfulRichText json={pressDetails?.items[0]?.richValue?.json} />

            <Heading as="h4" fontSize="lg" mt={6} mb={4}>
              {m.www_press_our_programs()}
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
                {m.www_press_contact()}
              </Heading>
              <ContentfulRichText json={pressContact?.items[0]?.richValue?.json} />
            </Box>

            <Box textAlign="center">
              <Button colorPalette="blue" as="a" {...({ href: "#assets" } as any)}>
                {m.www_press_download_images()}
              </Button>
            </Box>

            <Box textAlign="center" mt={4}>
              <Text color="current.textLight" fontWeight="bold">
                {m.www_press_as_seen_in()}
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
          {m.www_press_recent_coverage()}
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
          <a {...({ name: "assets" } as any)}></a>{m.www_press_assets()}
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
          {m.www_press_assets_license()}{" "}
          <Link rel="license" href="http://creativecommons.org/licenses/by/4.0/">
            {m.www_press_cc_license()}
          </Link>
          {m.www_press_assets_license_suffix()}
        </Text>
        <Text>
          {m.www_press_editorial_use()}
        </Text>
        <Flex alignItems="center">
          <Button
            as="a"
            colorPalette="blue"
            {...({ href: "https://f1.codeday.org/logos.zip" } as any)}
          >
            {m.www_press_download_logos()}
          </Button>
          <Text mb={0} pl={4} fontSize="sm" color="current.textLight">
            {m.www_press_trademarks()}
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
