import * as m from "@codeday/i18n/messages";
import { Box, Grid, Text, Heading } from "@codeday/topo/Atom";
import { AnnouncementPill, Band, Content, Section, Wash } from "@codeday/topo/Molecule";
import { FormatCards, RowList, StatementBlock } from "@codeday/topo/Organism";
import { apiFetch } from "@codeday/topo/utils";
import { Broadcast } from "@codeday/topocons";
import { ResultOf } from "@graphql-typed-document-node/core";
import { DateTime } from "luxon";
import { GetStaticProps } from "next";
import { toWords } from "number-to-words";
import React from "react";

import { graphql } from "@/gql";
import { useFragment } from "@/gql/fragment-masking";

import { useHomepageAnnouncement } from "../components/Index/Announcement";
import Credits from "../components/Index/Credits";
import History from "../components/Index/History";
import Impact, { ImpactAggregate } from "../components/Index/Impact";
import Live from "../components/Index/Live";
import LogoWall, { LogoWallFragment } from "../components/Index/LogoWall";
import Quote from "../components/Index/Quote";
import Stats from "../components/Index/Stats";
import Teaser from "../components/Index/Teaser";
import ThenNow from "../components/Index/ThenNow";
import { Message } from "../components/Message";
import Page from "../components/Page";
import useTwitch from "../useTwitch";

const IndexQuery = graphql(`
  query IndexQuery {
    ...PageComponent
    ...IndexLogoWallComponent
    ...IndexQuoteComponent
    ...IndexCreditsComponent
    ...IndexThenNowComponent
    ...IndexStatsComponent
    ...IndexImpactComponent
    ...IndexHistoryComponent
    ...IndexAnnouncementComponent
  }
`);

interface HomeProps {
  query: ResultOf<typeof IndexQuery>;
  seed: number;
  now: string;
}

export default function Home({ query, seed, now }: HomeProps) {
  const yearsSince2009Words = toWords(DateTime.now().year - 2009);
  const heroHeadingYears =
    yearsSince2009Words.charAt(0).toUpperCase() + yearsSince2009Words.slice(1);
  const twitch = useTwitch();
  const announcement = useHomepageAnnouncement(query, now);

  const { cms: logoWallCms } = useFragment(LogoWallFragment, query);
  const alumEmployerDisclaimer = (logoWallCms.logoWallEmployers?.items || [])
    .filter((employer: any) => employer.name && employer.legalName)
    .map((employer: any) =>
      m.www_home_logowall_disclaimer({
        name: employer.name,
        legalName: employer.legalName.replace(/\.$/, ""),
      }),
    )
    .join(" ");

  return (
    <Page
      data={query}
      slug="/"
      description={m.www_home_meta_description()}
      fundingDisclaimers={alumEmployerDisclaimer ? [alumEmployerDisclaimer] : []}
      logoHeadingLevel="span"
    >
      <Band tone="page">
        <Section ramp="hibiscus" spacing="compact" paddingTop={announcement ? "0" : "8"}>
          <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={8} alignItems="center">
            <Box>
              {announcement && (
                <Box display="flex" marginBlockEnd={{ base: "5", sm: "7" }}>
                  <AnnouncementPill
                    href={announcement.href}
                    text={announcement.text}
                    chip={announcement.chip}
                  />
                </Box>
              )}
              <StatementBlock
                size="hero"
                as="h1"
                ramp="hibiscus"
                heading={
                  <Message message={m.www_home_hero_heading} inputs={{ years: heroHeadingYears }} />
                }
                body={[m.www_home_hero_body()]}
                actions={[{ label: m.www_home_hero_action(), href: "#formats" }]}
              />
            </Box>
            <Box display={{ base: "none", lg: "block" }}>
              {twitch?.username ? (
                <Box>
                  <Box fontWeight="bold">
                    <Box as="span" color="red.700">
                      <Broadcast style={{ position: "relative", top: "-0.15em" }} /> LIVE
                      {twitch.title && ": "}
                    </Box>
                    {twitch.title && (
                      <Box as="span" color="current.textLight">
                        {twitch.title}
                      </Box>
                    )}
                  </Box>
                  <Box shadow="sm" rounded="xl" borderWidth={1} overflow="hidden">
                    <Live username={twitch.username} />
                  </Box>
                </Box>
              ) : (
                <Box shadow="sm" rounded="xl" borderWidth={1} overflow="hidden">
                  <Teaser />
                </Box>
              )}
            </Box>
          </Grid>
        </Section>

        <Section ramp="chilioil">
          <Stats data={query} />
        </Section>

        <Section id="then-now" ramp="chilioil">
          <Content maxWidth="container.lg" marginX="auto">
            <Heading
              as="h2"
              fontSize="clamp({fontSizes.3xl}, 3.4vw, {fontSizes.5xl})"
              fontWeight="700"
              color="black"
              mb={12}
            >
              {m.www_home_logowall_heading()}
            </Heading>
          </Content>

          <ThenNow data={query} />
        </Section>

        <Section ramp="chilioil">
          <Content maxWidth="container.lg" marginX="auto">
            <Heading as="h3" mb={8}>
              {m.www_home_logowall_subhead()}
            </Heading>
            <Grid
              templateColumns={{ base: "1fr", lg: "1fr 1fr" }}
              gap={{ base: 12, lg: 16 }}
              alignItems="center"
            >
              <LogoWall data={query} columns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} />
              <Quote data={query} seed={seed} />
            </Grid>
          </Content>
        </Section>

        <Section ramp="hibiscus" id="formats" paddingY={0}>
          <Content maxWidth="container.lg" marginX="auto">
            <Box marginBottom="6" maxWidth="60ch">
              <Heading
                as="h2"
                fontSize="clamp({fontSizes.3xl}, 3.4vw, {fontSizes.5xl})"
                fontWeight="700"
                margin="0"
                color="black"
              >
                {m.www_home_formats_heading()}
              </Heading>
              <Text marginTop="2" fontSize="md" color="gray.700">
                {m.www_home_formats_body()}
              </Text>
            </Box>
          </Content>
        </Section>
        <Box mb={24}>
          <Content paddingX={12} maxWidth="container.xl">
            <FormatCards
              ramp="blackberry"
              cards={[
                {
                  id: "event",
                  duration: m.www_home_formats_event_duration(),
                  name: m.www_home_formats_event_name(),
                  body: m.www_home_formats_event_body(),
                  depth: "flat",
                  actions: [{ label: m.www_home_formats_event_action(), href: "/events" }],
                },
                {
                  id: "microinternship",
                  duration: m.www_home_formats_microinternship_duration(),
                  name: m.www_home_formats_microinternship_name(),
                  body: m.www_home_formats_microinternship_body(),
                  depth: "modal",
                  span: 1.45,
                  routes: [
                    {
                      id: "own",
                      label: m.www_home_formats_microinternship_route_own_label(),
                      detail: m.www_home_formats_microinternship_route_own_detail(),
                      action: {
                        label: m.www_home_formats_microinternship_route_own_action(),
                        href: "/direct",
                      },
                    },
                    {
                      id: "credit",
                      label: m.www_home_formats_microinternship_route_credit_label(),
                      detail: m.www_home_formats_microinternship_route_credit_detail(),
                      action: {
                        label: m.www_home_formats_microinternship_route_credit_action(),
                        href: "/micro-internship#partner",
                      },
                    },
                  ],
                },
                {
                  id: "residency",
                  duration: m.www_home_formats_residency_duration(),
                  name: m.www_home_formats_residency_name(),
                  body: m.www_home_formats_residency_body(),
                  depth: "rail",
                  actions: [
                    {
                      label: m.www_home_formats_residency_action(),
                      info: {
                        heading: m.www_home_formats_residency_info_heading(),
                        body: m.www_home_formats_residency_info_body(),
                      },
                    },
                  ],
                },
              ]}
            />
          </Content>
        </Box>

        <Wash ramp="hibiscus" shape="tint">
          <Section ramp="hotsauce">
            <StatementBlock
              size="section"
              ramp="hotsauce"
              maxWidth="container.lg"
              marginX="auto"
              heading={m.www_home_whymatters_heading()}
              body={[<Message key="body" message={m.www_home_whymatters_body} />]}
            />
          </Section>
        </Wash>

        <Section ramp="chilioil">
          <Box maxWidth="container.lg" marginX="auto">
            <Box marginBottom="6" maxWidth="60ch">
              <Heading
                as="h2"
                fontSize="clamp({fontSizes.3xl}, 3.4vw, {fontSizes.5xl})"
                fontWeight="700"
                margin="0"
                color="black"
              >
                {m.www_home_impact_heading()}
              </Heading>
              <Text marginTop="2" fontSize="md" color="gray.700">
                {m.www_home_impact_body()}
              </Text>
            </Box>
          </Box>
          <Impact data={query} seed={seed} />
          <ImpactAggregate data={query} />
        </Section>

        <Section ramp="hibiscus">
          <Content maxWidth="container.lg">
            <StatementBlock
              size="section"
              ramp="hotsauce"
              maxWidth="container.lg"
              marginX="auto"
              heading={m.www_home_history_heading({ number: DateTime.now().year - 2009 })}
              mb={12}
            />
          </Content>
          <Content maxWidth="container.xl">
            <Box css={{ containerType: "inline-size", containerName: "history" }}>
              <Box
                display="grid"
                gridTemplateColumns="1fr"
                gap="6"
                css={{
                  "@container history (min-width: 820px)": { gridTemplateColumns: "1fr 62%" },
                }}
              >
                <Box fontSize="lg" color="gray.700" maxWidth="46ch">
                  {m.www_home_history_body()}
                </Box>

                <History data={query} />
              </Box>
            </Box>
          </Content>
        </Section>
      </Band>

      <Band tone="tinted">
        <Section ramp="chilioil">
          <Box maxWidth="container.lg" marginX="auto">
            <StatementBlock
              size="section"
              ramp="chilioil"
              heading={m.www_home_evidence_heading()}
              body={[<Message key="body1" message={m.www_home_evidence_body1} />]}
              actions={[{ label: m.www_home_evidence_action(), href: "/research" }]}
            />
          </Box>
        </Section>

        <Section ramp="blackberry">
          <Content maxWidth="container.lg">
            <RowList
              variant="waysIn"
              gradient="blackberry"
              rows={[
                {
                  id: "colleges",
                  lead: m.www_home_waysin_colleges_lead(),
                  body: m.www_home_waysin_colleges_body(),
                  actions: [
                    { label: m.www_home_waysin_colleges_action(), href: "/s/colleges-deck" },
                  ],
                },
                {
                  id: "companies",
                  lead: m.www_home_waysin_companies_lead(),
                  body: m.www_home_waysin_companies_body(),
                  actions: [
                    { label: m.www_home_waysin_companies_action(), href: "/s/companies-deck" },
                  ],
                },
                {
                  id: "foundations",
                  lead: m.www_home_waysin_foundations_lead(),
                  body: m.www_home_waysin_foundations_body(),
                  actions: [
                    { label: m.www_home_waysin_foundations_action(), href: "/s/foundations-deck" },
                  ],
                },
                {
                  id: "mentors",
                  lead: m.www_home_waysin_mentors_lead(),
                  body: m.www_home_waysin_mentors_body(),
                  actions: [{ label: m.www_home_waysin_mentors_action(), href: "/volunteer" }],
                },
                {
                  id: "maintainers",
                  lead: m.www_home_waysin_maintainers_lead(),
                  body: m.www_home_waysin_maintainers_body(),
                  actions: [{ label: m.www_home_waysin_maintainers_action(), href: "/s/oss-deck" }],
                },
              ]}
            />
          </Content>
        </Section>
      </Band>

      <Band tone="page">
        <Section ramp="hibiscus">
          <Box maxWidth="container.lg" marginX="auto">
            <Credits data={query} />
          </Box>
        </Section>
      </Band>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      query: await apiFetch(IndexQuery, {}, {}),
      seed: Math.random(),
      now: DateTime.utc().toISO(),
    },
    revalidate: 300,
  };
};
