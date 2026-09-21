import * as m from "@codeday/i18n/messages";
import { Box, Button, Eyebrow, GradientText, Heading, Text } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { ResultOf } from "@graphql-typed-document-node/core";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import React, { useMemo } from "react";

import { graphql } from "@/gql";
import { useFragment } from "@/gql/fragment-masking";

import { buildCities } from "../components/Events/data";
import NearestCityCard from "../components/Events/NearestCityCard";
import Picker, { StatusLegend } from "../components/Events/Picker";
import ProjectCardsField, { HeroProject } from "../components/Events/ProjectCardsField";
import Steps from "../components/Events/Steps";
import { useEventsState } from "../components/Events/useEventsState";
import Page from "../components/Page";

const BODY = "{colors.gray.700}";
const CAPTION = "{colors.gray.600}";
const HAIRLINE = "{colors.current.border}";
const SECTION_INSET = { base: "5", md: "12", xl: "32" } as const;
const SECTION_BLOCK = {
  base: "{spacing.9} {spacing.10}",
  xl: "{spacing.16} {spacing.20}",
} as const;
const SECTION_HEADING = {
  margin: 0,
  fontSize: { base: "3xl", xl: "4xl" },
  lineHeight: "1.08",
  fontWeight: "700",
} as const;
const SECTION_INTRO = {
  margin: 0,
  fontSize: { base: "md", xl: "lg" },
  lineHeight: "moderate",
  color: BODY,
} as const;

export const EventsPageFragment = graphql(`
  fragment EventsPageComponent on Query {
    showcase {
      projects(where: { media: IMAGES, featured: true }, orderBy: NEWEST, take: 16) {
        id
        name
        description
        viewLink
        codeLink
        media(type: IMAGE, topics: [DEMO]) {
          image(width: 400, height: 300, strategy: CROP)
        }
        coverImage {
          image(width: 400, height: 300, strategy: CROP)
        }
        awards {
          info {
            name
          }
        }
        region {
          name
        }
      }
    }
    cms {
      regions(limit: 300) {
        items {
          name
          webname
          countryName
          iso3166Alpha2Code
          area
          location {
            lat
            lon
          }
          clearEvents {
            id
            name
            startDate
            endDate
            timezone
            displayDate
            displayTime
            registrationsOpen
            venue {
              name
              addressInline
            }
          }
        }
      }
    }
    geo {
      mine {
        lat
        lng
        country
      }
    }
  }
`);

export const EventsPageQuery = graphql(`
  query EventsPageQuery {
    ...EventsPageComponent
    ...PageComponent
  }
`);

interface EventsPageProps {
  query: ResultOf<typeof EventsPageQuery>;
}

export default function EventsPage({ query }: EventsPageProps) {
  const { showcase, cms, geo } = useFragment(EventsPageFragment, query);

  const cities = useMemo(() => buildCities(cms?.regions?.items || []), [cms]);

  const projects: HeroProject[] = useMemo(
    () =>
      (showcase?.projects || [])
        .map((project) => ({
          id: project.id,
          name: project.name,
          description: project.description,
          image: project.media?.[0]?.image || project.coverImage?.image || null,
          awardName: project.awards?.[0]?.info?.name || null,
          city: project.region?.name || null,
          href: project.viewLink || `https://showcase.codeday.org/project/${project.id}`,
        }))
        .filter((project) => project.image)
        .slice(0, 4),
    [showcase],
  );

  const serverPoint =
    geo?.mine?.lat != null && geo?.mine?.lng != null
      ? { lat: geo.mine.lat, lon: geo.mine.lng }
      : null;
  const viewerIsUs = geo?.mine?.country === "US";

  const {
    nearestCity,
    nearestDistanceMeters,
    currentCity,
    isCurrentNearest,
    selectCity,
    useMyLocation,
    query: searchQuery,
    setQuery: setSearchQuery,
  } = useEventsState(cities, serverPoint);

  return (
    <Page slug="/events" title="CodeDay Weekend" data={query} logoHeadingLevel="span">
      <NextSeo
        description="Find your city's CodeDay Weekend: a student-run, mentor-supported hackathon-style event running in dozens of cities worldwide."
        openGraph={{
          title: "CodeDay Weekend",
          description:
            "Find your city's CodeDay Weekend: a student-run, mentor-supported hackathon-style event running in dozens of cities worldwide.",
        }}
      />
      <Box overflowX="clip" colorPalette="blackberry">
        <Box
          as="section"
          id="top"
          boxSizing="border-box"
          paddingInline={SECTION_INSET}
          paddingTop="0"
          paddingBottom={{ base: "8", xl: "{spacing.16}" }}
        >
          <Content
            maxW="container.xl"
            marginBottom="0"
            display="grid"
            gridTemplateColumns={{ base: "1fr", lg: "repeat(12, minmax(0, 1fr))" }}
            columnGap="6"
            alignItems="start"
          >
            <Box
              gridColumn={{ lg: "1 / span 5" }}
              display="flex"
              flexDirection="column"
              gap="7"
              paddingTop={{ lg: "4" }}
            >
              <Eyebrow ramp="blackberry">{m.www_events_hero_eyebrow()}</Eyebrow>
              <Heading
                as="h1"
                margin={0}
                fontSize={{ base: "4xl", lg: "6xl" }}
                lineHeight="1.02"
                fontWeight="700"
              >
                {m.www_events_hero_heading_pre()}
                <GradientText ramp="blackberry">
                  {m.www_events_hero_heading_highlight()}
                </GradientText>
                .
              </Heading>
              <Text
                margin={0}
                fontSize={{ base: "md", lg: "lg" }}
                lineHeight="moderate"
                color={BODY}
                maxWidth="md"
              >
                {m.www_events_hero_intro({ cityCount: cities.length })}
              </Text>
              {nearestCity && (
                <NearestCityCard
                  city={nearestCity}
                  distanceMeters={nearestDistanceMeters}
                  viewerIsUs={viewerIsUs}
                />
              )}
            </Box>
            <Box gridColumn={{ lg: "6 / span 7" }} marginTop={{ base: "8", lg: 0 }}>
              <ProjectCardsField projects={projects} />
            </Box>
          </Content>
        </Box>

        <Box
          as="section"
          id="cities"
          boxSizing="border-box"
          paddingInline={SECTION_INSET}
          paddingBlock={SECTION_BLOCK}
          borderTop={`{borders.sm} ${HAIRLINE}`}
        >
          <Content
            maxW="container.xl"
            marginBottom="0"
            display="flex"
            flexDirection="column"
            gap={{ base: "4.5", xl: "9" }}
          >
            <Box
              display="flex"
              flexDirection={{ base: "column", xl: "row" }}
              alignItems={{ xl: "flex-end" }}
              justifyContent="space-between"
              gap={{ base: "2", xl: "10" }}
            >
              <Box display="flex" flexDirection="column" gap="2.5" maxWidth="3xl">
                <Heading as="h2" {...SECTION_HEADING}>
                  {m.www_events_picker_heading()}
                </Heading>
                <Text {...SECTION_INTRO}>{m.www_events_picker_intro()}</Text>
              </Box>
              <Box display={{ base: "none", xl: "block" }}>
                <StatusLegend />
              </Box>
            </Box>
            <Picker
              cities={cities}
              currentCity={currentCity}
              nearestCity={nearestCity}
              isCurrentNearest={isCurrentNearest}
              query={searchQuery}
              setQuery={setSearchQuery}
              selectCity={selectCity}
              useMyLocation={useMyLocation}
            />
          </Content>
        </Box>

        <Box
          as="section"
          id="organize"
          boxSizing="border-box"
          paddingInline={SECTION_INSET}
          paddingBlock={{ base: "9", xl: "16" }}
          borderTop={`{borders.sm} ${HAIRLINE}`}
          background="colorPalette.100"
        >
          <Content
            maxW="container.xl"
            marginBottom="0"
            display="grid"
            gridTemplateColumns={{ base: "1fr", lg: "repeat(12, minmax(0, 1fr))" }}
            columnGap="6"
            alignItems={{ lg: "center" }}
            gap={{ base: "4.5", lg: 0 }}
          >
            <Box gridColumn={{ lg: "1 / span 7" }} display="flex" flexDirection="column" gap="4">
              <Eyebrow ramp="blackberry">{m.www_events_organize_eyebrow()}</Eyebrow>
              <Heading as="h2" {...SECTION_HEADING}>
                {m.www_events_organize_heading()}
              </Heading>
              <Text {...SECTION_INTRO} maxWidth="xl">
                {m.www_events_organize_body()}
              </Text>
            </Box>
            <Box gridColumn={{ lg: "9 / span 4" }} display="flex" flexDirection="column" gap="2.5">
              <Button as="a" {...({ href: "/volunteer" } as any)} variant="primary" size="lg">
                {m.www_events_organize_cta()}
              </Button>
              <Button as="a" {...({ href: "/volunteer" } as any)} variant="secondary" size="lg">
                {m.www_events_join_interest_list()}
              </Button>
              <Text
                fontSize="sm"
                lineHeight="moderate"
                color={CAPTION}
                textAlign="center"
                margin={0}
              >
                {m.www_events_organize_schools()}
              </Text>
            </Box>
          </Content>
        </Box>

        <Box
          as="section"
          boxSizing="border-box"
          paddingInline={SECTION_INSET}
          paddingBlock={SECTION_BLOCK}
          borderTop={`{borders.sm} ${HAIRLINE}`}
        >
          <Box
            maxWidth="container.lg"
            marginX="auto"
            display="flex"
            flexDirection="column"
            gap={{ base: "6", xl: "9" }}
          >
            <Box display="flex" flexDirection="column" gap="2.5" maxWidth="3xl">
              <Heading as="h2" {...SECTION_HEADING}>
                {m.www_events_steps_heading()}
              </Heading>
              <Text {...SECTION_INTRO}>{m.www_events_steps_intro()}</Text>
            </Box>
            <Steps />
          </Box>
        </Box>
      </Box>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const query = await apiFetch(EventsPageQuery, {});
  return {
    props: { query },
    revalidate: 300,
  };
};
