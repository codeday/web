import * as m from "@codeday/i18n/messages";
import { Box, Button, Eyebrow, Heading, Text } from "@codeday/topo/Atom";
import { ActionLink, Content, GradientField, Section, Wash } from "@codeday/topo/Molecule";
import { PullQuote, StatementBlock, StatTrio } from "@codeday/topo/Organism";
import { apiFetch, type Message as MessageString } from "@codeday/topo/utils";
import { UiArrowRight, UiStar } from "@codeday/topocons";
import { ResultOf } from "@graphql-typed-document-node/core";
import { GetStaticProps } from "next";
import { DefaultSeo } from "next-seo";
import React from "react";

import LogoWall, { useLogoWallDisclaimer } from "@/components/Index/LogoWall";
import { Message } from "@/components/Message";
import Page from "@/components/Page";
import { SQUIRCLE } from "@/components/Talent/Pill";
import Profile from "@/components/Talent/Profile";
import Shortlist from "@/components/Talent/Shortlist";
import TalentThenNow, { TALENT_ALUM_COLUMNS } from "@/components/Talent/ThenNow";
import { graphql } from "@/gql";
import { useFragment } from "@/gql/fragment-masking";
import { buildPublications } from "@/lib/research/normalize";
import { computeResearchStats } from "@/lib/research/stats";
import { ResearchFragment } from "@/pages/research";

const BOOKING_URL =
  process.env.NEXT_PUBLIC_TALENT_BOOKING_URL ||
  "https://calendly.com/codeday-partnerships/codeday-early-career-talent";
const DOI_PREFIX = process.env.NEXT_PUBLIC_DOI_PREFIX || "";
const CANONICAL_URL = "https://www.codeday.org/talent";

const TalentQuery = graphql(`
  query TalentQuery($talentAlumNames: [String]) {
    ...PageComponent
    ...TalentThenNowComponent
    ...IndexLogoWallComponent
    ...ResearchIndexComponent
    impact {
      studentCount
      eventCount
    }
    cms {
      regions(limit: 1) {
        total
      }
      talentQuote: testimonials(where: { sys: { id: "3ZSsSRztLYWoW2NObWYZ3s" } }, limit: 1) {
        items {
          quote
          firstName
          lastName
          title
          company
        }
      }
    }
  }
`);

const HAIRLINE = { borderTop: "sm", borderTopColor: "gray.300" } as const;
const SCROLL_OFFSET = { base: "20", md: "28" } as const;

const CARD = {
  bg: "white",
  borderWidth: "1px",
  borderColor: "gray.300",
  borderRadius: "2xl",
  display: "flex",
  flexDirection: "column",
} as const;

const ITEM_HEADING = {
  as: "h3",
  margin: "0",
  fontSize: "xl",
  fontWeight: "700",
  lineHeight: "shorter",
} as const;

interface EvidenceCard {
  id: string;
  icon: React.ReactNode;
  title: () => MessageString;
  body: () => MessageString;
}

interface Trait {
  id: string;
  name: () => MessageString;
  description: () => MessageString;
  proof: () => MessageString;
}

interface Step {
  id: string;
  title: () => MessageString;
  body: () => MessageString;
}

function LineIcon({ children }: { children: React.ReactNode }) {
  return (
    <Box
      as="svg"
      aria-hidden="true"
      boxSize="5.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...({ viewBox: "0 0 24 24" } as any)}
    >
      {children}
    </Box>
  );
}

const EVIDENCE: EvidenceCard[] = [
  {
    id: "code",
    icon: (
      <LineIcon>
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="6" cy="18" r="2.5" />
        <circle cx="18" cy="12" r="2.5" />
        <path d="M6 8.5v7" />
        <path d="M6 8.5c0 3.5 4 3.5 9.5 3.5" />
      </LineIcon>
    ),
    title: m.www_talent_evidence_code_title,
    body: m.www_talent_evidence_code_body,
  },
  {
    id: "mentor",
    icon: (
      <LineIcon>
        <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
      </LineIcon>
    ),
    title: m.www_talent_evidence_mentor_title,
    body: m.www_talent_evidence_mentor_body,
  },
  {
    id: "review",
    icon: <UiStar aria-hidden="true" boxSize="5.5" />,
    title: m.www_talent_evidence_review_title,
    body: m.www_talent_evidence_review_body,
  },
];

const TRAITS: Trait[] = [
  {
    id: "initiative",
    name: m.www_talent_traits_initiative_name,
    description: m.www_talent_traits_initiative_description,
    proof: m.www_talent_traits_initiative_proof,
  },
  {
    id: "problem-solving",
    name: m.www_talent_traits_problem_name,
    description: m.www_talent_traits_problem_description,
    proof: m.www_talent_traits_problem_proof,
  },
  {
    id: "product-sense",
    name: m.www_talent_traits_product_name,
    description: m.www_talent_traits_product_description,
    proof: m.www_talent_traits_product_proof,
  },
  {
    id: "curiosity",
    name: m.www_talent_traits_curiosity_name,
    description: m.www_talent_traits_curiosity_description,
    proof: m.www_talent_traits_curiosity_proof,
  },
];

const STEPS: Step[] = [
  { id: "bar", title: m.www_talent_how_bar_title, body: m.www_talent_how_bar_body },
  { id: "meet", title: m.www_talent_how_meet_title, body: m.www_talent_how_meet_body },
  { id: "hire", title: m.www_talent_how_hire_title, body: m.www_talent_how_hire_body },
  { id: "train", title: m.www_talent_how_train_title, body: m.www_talent_how_train_body },
];

interface TalentProps {
  query: ResultOf<typeof TalentQuery>;
}

export default function Talent({ query }: TalentProps) {
  const { cms: researchCms } = useFragment(ResearchFragment, query) || {};
  const researchStats = computeResearchStats(
    buildPublications(
      (researchCms?.externalPublications?.items || []).filter(Boolean) as any[],
      (researchCms?.publications?.items || []).filter(Boolean) as any[],
      DOI_PREFIX,
    ),
  );
  const alumEmployerDisclaimer = useLogoWallDisclaimer(query);
  const quote = query.cms.talentQuote?.items[0];

  return (
    <Page
      data={query}
      slug="/talent"
      logoHeadingLevel="span"
      fundingDisclaimers={alumEmployerDisclaimer ? [alumEmployerDisclaimer] : []}
      seo={
        <DefaultSeo
          title={m.www_talent_title()}
          description={m.www_talent_meta_description()}
          canonical={CANONICAL_URL}
          openGraph={{
            type: "website",
            locale: "en_US",
            site_name: m.www_page_site_name(),
            url: CANONICAL_URL,
          }}
          twitter={{ handle: "@codeday", site: "@codeday", cardType: "summary_large_image" }}
        />
      }
    >
      <Section
        ramp="hibiscus"
        id="top"
        spacing="compact"
        scrollMarginTop={SCROLL_OFFSET}
        bg="white"
      >
        <Content
          maxW="container.xl"
          marginBottom="0"
          display="grid"
          gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
          gap={{ base: "10", lg: "14" }}
          alignItems="center"
        >
          <Box display="flex" flexDirection="column" gap="5" minWidth="0">
            <Eyebrow ramp="hibiscus">{m.www_talent_hero_eyebrow()}</Eyebrow>
            <StatementBlock
              size="hero"
              as="h2"
              ramp="hibiscus"
              heading={<Message message={m.www_talent_hero_heading} />}
              body={[m.www_talent_hero_body()]}
            />
            <Box display="flex" flexWrap="wrap" gap="3" alignItems="center">
              <Button
                as="a"
                variant="primary"
                target="_blank"
                size="lg"
                {...({ href: BOOKING_URL } as any)}
              >
                {m.www_talent_hero_book()}
                <UiArrowRight aria-hidden="true" boxSize="4" />
              </Button>
            </Box>
          </Box>
          <Shortlist />
        </Content>
      </Section>

      <Section ramp="chilioil" id="alumni" scrollMarginTop={SCROLL_OFFSET}>
        <Content maxW="container.lg" marginBottom="12">
          <StatementBlock size="section" heading={m.www_talent_alumni_heading()} />
        </Content>
        <TalentThenNow data={query} />
      </Section>

      <Section ramp="chilioil" paddingTop="0">
        <Content maxW="container.lg" marginBottom="0">
          <Heading as="h3" mb={8}>
            {m.www_talent_employers_heading()}
          </Heading>
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", lg: "1fr 1fr" }}
            gap={{ base: 12, lg: 16 }}
            alignItems="center"
          >
            <LogoWall data={query} columns={{ base: "repeat(3, 1fr)" }} />
            {quote?.quote && (
              <PullQuote
                size="feature"
                ramp="chilioil"
                quote={quote.quote}
                quoteFontSize="clamp({fontSizes.lg}, 2.4vw, {fontSizes.2xl})"
                name={[quote.firstName, quote.lastName].filter(Boolean).join(" ")}
                role={quote.title || undefined}
                project={quote.company || undefined}
                tag={m.www_microinternship_evidence_quote_employer_label()}
              />
            )}
          </Box>
        </Content>
      </Section>

      <Section ramp="chilioil" id="signal" scrollMarginTop={SCROLL_OFFSET} {...HAIRLINE}>
        <Content
          maxW="container.lg"
          marginBottom="0"
          display="flex"
          flexDirection="column"
          gap="10"
        >
          <Box>
            <StatementBlock
              size="section"
              heading={m.www_talent_evidence_heading()}
              body={[m.www_talent_evidence_body()]}
            />
            <Text marginTop="4" marginBottom="0" fontSize="sm" color="gray.600">
              {m.www_talent_evidence_sources()}
            </Text>
          </Box>
          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap="5">
            {EVIDENCE.map((card) => (
              <Box key={card.id} {...CARD} padding="7" gap="3">
                <Box
                  boxSize="11"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bg="purple.100"
                  color="pink.700"
                  {...SQUIRCLE}
                >
                  {card.icon}
                </Box>
                <Box {...ITEM_HEADING}>{card.title()}</Box>
                <Box color="gray.700" lineHeight="moderate">
                  {card.body()}
                </Box>
              </Box>
            ))}
          </Box>
        </Content>
      </Section>

      <Wash ramp="figjam" shape="tint">
        <Section ramp="figjam" {...HAIRLINE}>
          <Content
            maxW="container.lg"
            marginBottom="0"
            display="flex"
            flexDirection="column"
            gap="10"
          >
            <StatementBlock
              size="section"
              heading={m.www_talent_traits_heading()}
              body={[m.www_talent_traits_body()]}
            />
            <Box
              display="grid"
              gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
              gap="5"
            >
              {TRAITS.map((trait) => (
                <Box key={trait.id} {...CARD} padding="6" gap="2.5">
                  <Box {...ITEM_HEADING}>{trait.name()}</Box>
                  <Box color="gray.700" lineHeight="moderate">
                    {trait.description()}
                  </Box>
                  <Box
                    marginTop="auto"
                    paddingTop="3"
                    borderTop="sm"
                    borderTopColor="gray.300"
                    fontSize="sm"
                    lineHeight="moderate"
                  >
                    <Box as="span" fontWeight="700" color="figjam.600">
                      {m.www_talent_traits_shows()}
                    </Box>
                    {trait.proof()}
                  </Box>
                </Box>
              ))}
            </Box>
            <ActionLink
              colorPalette="chilioil"
              alignSelf="flex-start"
              label={m.www_talent_traits_source()}
              href="https://arxiv.org/abs/2510.25180"
            />
          </Content>
        </Section>
      </Wash>

      <Section ramp="figjam" id="profile" scrollMarginTop={SCROLL_OFFSET} {...HAIRLINE}>
        <Content
          maxW="container.lg"
          marginBottom="0"
          display="grid"
          gridTemplateColumns={{ base: "1fr", lg: "2fr 3fr" }}
          gap={{ base: "10", lg: "16" }}
          alignItems="flex-start"
        >
          <StatementBlock
            size="section"
            heading={m.www_talent_profile_heading()}
            body={[m.www_talent_profile_body()]}
          />
          <Profile />
        </Content>
      </Section>

      <Section ramp="hibiscus" id="how" scrollMarginTop={SCROLL_OFFSET} {...HAIRLINE}>
        <Content
          maxW="container.lg"
          marginBottom="0"
          display="flex"
          flexDirection="column"
          gap="10"
        >
          <StatementBlock
            size="section"
            heading={m.www_talent_how_heading()}
            body={[m.www_talent_how_body()]}
          />
          <Box
            as="ol"
            listStyleType="none"
            margin="0"
            padding="0"
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
            gap="8"
          >
            {STEPS.map((step, index) => (
              <Box
                as="li"
                key={step.id}
                display="flex"
                flexDirection="column"
                gap="3"
                paddingTop="4"
                borderTop="sm"
                borderTopColor="gray.300"
              >
                <Box as="span" fontFamily="mono" fontSize="sm" color="hibiscus.600">
                  {String(index + 1).padStart(2, "0")}
                </Box>
                <Box {...ITEM_HEADING}>{step.title()}</Box>
                <Box color="gray.700" lineHeight="moderate">
                  {step.body()}
                </Box>
              </Box>
            ))}
          </Box>
        </Content>
      </Section>

      <Section ramp="hibiscus" id="book" scrollMarginTop={SCROLL_OFFSET} paddingTop="0">
        <Content maxW="container.lg" marginBottom="0">
          <GradientField
            ramp="hibiscus"
            borderRadius="2xl"
            paddingY={{ base: "12", md: "20" }}
            paddingX={{ base: "6", md: "16" }}
          >
            <Box display="flex" flexDirection="column" alignItems="flex-start" gap="6">
              <Heading
                as="h2"
                margin="0"
                color="trueWhite"
                fontSize="clamp({fontSizes.4xl}, 4.6vw, {fontSizes.6xl})"
                fontWeight="700"
                lineHeight="shorter"
                maxWidth="2xl"
              >
                {m.www_talent_cta_heading()}
              </Heading>
              <Text margin="0" fontSize="lg" color="whiteAlpha.900" maxWidth="xl">
                {m.www_talent_cta_body()}
              </Text>
              <Box display="flex" flexWrap="wrap" gap="3" alignItems="center" paddingTop="2">
                <Button
                  as="a"
                  variant="onColor"
                  color="colorPalette.true.800"
                  size="lg"
                  target="_blank"
                  {...({ href: BOOKING_URL } as any)}
                >
                  {m.www_talent_cta_book()}
                  <UiArrowRight aria-hidden="true" boxSize="4" />
                </Button>
                <Button
                  as="a"
                  variant="onColorOutline"
                  size="lg"
                  {...({ href: "mailto:talent@codeday.org" } as any)}
                >
                  {m.www_talent_cta_email()}
                </Button>
              </Box>
            </Box>
          </GradientField>
        </Content>
      </Section>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      query: await apiFetch(TalentQuery, { talentAlumNames: TALENT_ALUM_COLUMNS.flat() }, {}),
    },
    revalidate: 300,
  };
};
