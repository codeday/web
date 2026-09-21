import * as m from "@codeday/i18n/messages";
import { Box, Button, Eyebrow, GradientText } from "@codeday/topo/Atom";
import { ActionLink, Band, CONTENT_INSET, Content, Section, Wash } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { ResultOf } from "@graphql-typed-document-node/core";
import { GetStaticProps } from "next";
import React from "react";

import { graphql } from "@/gql";
import { useFragment } from "@/gql/fragment-masking";

import Page from "../components/Page";
import FeaturedBlock from "../components/Research/FeaturedBlock";
import ResearchIndexSection from "../components/Research/Index";
import Stats from "../components/Research/Stats";
import {
  normalizeExternalPublication,
  normalizeSelfPublication,
  sortPublications,
} from "../lib/research/normalize";
import { computeResearchStats } from "../lib/research/stats";
import type { Publication } from "../lib/research/types";

export const ResearchFragment = graphql(`
  fragment ResearchIndexComponent on Query {
    cms {
      externalPublications(limit: 100, order: [publicationDate_DESC]) {
        items {
          title
          authors
          type
          venue
          venueLong
          venueDetails
          doi
          preprint
          publicationDate
          abstract
          topic
        }
      }
      publications(limit: 100, order: [publicationDate_DESC]) {
        items {
          title
          type
          venue
          doiSuffix
          publicationDate
          description
          contributors {
            name
            affiliation
          }
          topic
        }
      }
    }
  }
`);

export const ResearchIndexQuery = graphql(`
  query ResearchIndexQuery {
    ...ResearchIndexComponent
  }
`);

interface ResearchProps {
  query: ResultOf<typeof ResearchIndexQuery>;
}

const DOI_PREFIX = process.env.NEXT_PUBLIC_DOI_PREFIX || "";

export default function Research({ query }: ResearchProps) {
  const { cms } = useFragment(ResearchFragment, query) || {};

  const external = (cms?.externalPublications?.items || []).filter(Boolean) as any[];
  const self = (cms?.publications?.items || []).filter(Boolean) as any[];

  const publications: Publication[] = sortPublications([
    ...external.map((p) => normalizeExternalPublication(p)),
    ...self.map((p) => normalizeSelfPublication(p, DOI_PREFIX)),
  ]);

  const stats = computeResearchStats(publications);
  const featured = publications.find((p) => p.type === "paper");

  return (
    <Page
      title={m.www_navmenu_research()}
      slug="/research"
      description={m.www_research_meta_description()}
      logoHeadingLevel="span"
    >
      <Band tone="page">
        <Section ramp="chilioil" spacing="compact" paddingTop="0">
          <Content
            maxW="container.xl"
            marginBottom="0"
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "1.15fr .85fr" }}
            gap={{ base: "9", md: "12" }}
            alignItems="center"
          >
            <Box>
              <Eyebrow ramp="chilioil" color="colorPalette.600">
                {m.www_research_hero_eyebrow()}
              </Eyebrow>
              <Box
                as="h1"
                fontSize="clamp({fontSizes.4xl}, 5.4vw, {fontSizes.6xl})"
                fontWeight="800"
                lineHeight="1.0"
                letterSpacing="tight"
                maxWidth="14ch"
                marginBlockStart="3.5"
                css={{ textWrap: "balance" }}
              >
                {m.www_research_hero_h1_lead()}
                <GradientText ramp="chilioil">{m.www_research_hero_h1_highlight()}</GradientText>
              </Box>
              <Box
                fontSize="lg"
                lineHeight="moderate"
                color="gray.700"
                maxWidth="56ch"
                marginBlockStart="4.5"
              >
                {m.www_research_hero_standfirst_before()}
                <Box as="strong" color="black">
                  {m.www_research_hero_standfirst_count({ count: stats.count })}
                </Box>
                {m.www_research_hero_standfirst_after()}
              </Box>
              <Box display="flex" gap="3" flexWrap="wrap" marginBlockStart="7">
                <Button
                  as="a"
                  variant="primary"
                  colorPalette="chilioil"
                  {...({ href: "#index" } as any)}
                >
                  {m.www_research_hero_cta_browse()}
                </Button>
                <Button
                  as="a"
                  variant="secondary"
                  colorPalette="chilioil"
                  {...({ href: "#work-with-us" } as any)}
                >
                  {m.www_research_hero_cta_programs()}
                </Button>
              </Box>
            </Box>
            <Box>{featured && <FeaturedBlock publication={featured} />}</Box>
          </Content>
        </Section>
        <Section ramp="chilioil" spacing="compact">
          <Stats stats={stats} />
        </Section>
        <Section ramp="chilioil" spacing="compact" paddingInline="0">
          <ResearchIndexSection publications={publications} />
        </Section>
      </Band>

      <Wash
        ramp="chilioil"
        shape="tint"
        colorPalette="chilioil"
        id="work-with-us"
        scrollMarginTop="20"
      >
        <Box maxWidth="6xl" marginInline="auto" paddingInline={CONTENT_INSET} paddingBlock="14">
          <Eyebrow ramp="chilioil">{m.www_research_closing_eyebrow()}</Eyebrow>

          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
            gap="9"
            marginBlockStart="4.5"
          >
            <Box>
              <Box as="h2" fontSize="3xl" fontWeight="700" lineHeight="shorter">
                {m.www_research_closing_heading()}
              </Box>
              <Box fontSize="md" color="gray.700" lineHeight="moderate" marginBlockStart="2.5">
                {m.www_research_closing_body()}
              </Box>
            </Box>

            <Box borderTop="sm" borderTopColor="colorPalette.300" paddingTop="4">
              <Box fontSize="md" fontWeight="600">
                {m.www_research_closing_researchers_label()}
              </Box>
              <Box fontSize="md" color="gray.700" lineHeight="moderate" marginBlockStart="2">
                {m.www_research_closing_researchers_body()}
              </Box>
              <Box marginBlockStart="3">
                <ActionLink
                  label={m.www_research_closing_researchers_link()}
                  href="mailto:research@codeday.org"
                />
              </Box>
            </Box>

            <Box borderTop="sm" borderTopColor="colorPalette.300" paddingTop="4">
              <Box fontSize="md" fontWeight="600">
                {m.www_research_closing_evaluators_label()}
              </Box>
              <Box fontSize="md" color="gray.700" lineHeight="moderate" marginBlockStart="2">
                {m.www_research_closing_evaluators_body()}
              </Box>
              <Box marginBlockStart="3">
                <ActionLink
                  label={m.www_research_closing_evaluators_link()}
                  href="mailto:research@codeday.org"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Wash>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      query: await apiFetch(ResearchIndexQuery, {}, {}),
    },
    revalidate: 300,
  };
};
