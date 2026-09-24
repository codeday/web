import * as m from "@codeday/i18n/messages";
import { Box, Button, Eyebrow, GradientText } from "@codeday/topo/Atom";
import { Band, Content, Section, Wash } from "@codeday/topo/Molecule";
import { PullQuote, StatementBlock } from "@codeday/topo/Organism";
import { apiFetch } from "@codeday/topo/utils";
import { ResultOf } from "@graphql-typed-document-node/core";
import { GetStaticProps } from "next";
import React from "react";

import { graphql } from "@/gql";

import Impact from "../../components/Index/Impact";
import Checklist from "../../components/MicroInternship/Checklist";
import Evidence from "../../components/MicroInternship/Evidence";
import HeroField from "../../components/MicroInternship/HeroField";
import HowItWorks from "../../components/MicroInternship/HowItWorks";
import PartnerPill from "../../components/MicroInternship/PartnerPill";
import Page from "../../components/Page";

const MicroInternshipQuery = graphql(`
  query MicroInternshipQuery {
    ...PageComponent
    ...IndexImpactComponent
    ...MicroInternshipEvidenceComponent
  }
`);

const HAIRLINE = { borderTop: "sm", borderTopColor: "current.border" } as const;

const CARD = {
  boxSizing: "border-box",
  padding: "{spacing.9} {spacing.9} {spacing.8}",
  background: "white",
  borderRadius: "4xl",
  border: "1.5px solid",
  display: "flex",
  flexDirection: "column",
  gap: "5",
} as const;

interface MicroInternshipProps {
  query: ResultOf<typeof MicroInternshipQuery>;
  seed: number;
}

export default function MicroInternship({ query, seed }: MicroInternshipProps) {
  return (
    <Page
      data={query}
      slug="/micro-internship"
      title={m.www_navmenu_microinternship()}
      description={m.www_microinternship_meta_description()}
      logoHeadingLevel="span"
    >
      <Band tone="page">
        <Section ramp="blackberry" spacing="compact" paddingTop="0">
          <Content
            maxW="container.xl"
            marginBottom="0"
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={{ base: "7", md: "6" }}
            alignItems="center"
          >
            <Box display="flex" flexDirection="column" gap={{ base: "4.5", md: "6" }}>
              <Eyebrow ramp="blackberry" color="colorPalette.600">
                {m.www_microinternship_hero_eyebrow()}
              </Eyebrow>
              <StatementBlock
                size="hero"
                as="h1"
                ramp="blackberry"
                heading={
                  <>
                    {m.www_microinternship_hero_heading_lead()}
                    <GradientText ramp="blackberry">
                      {m.www_microinternship_hero_heading_highlight()}
                    </GradientText>
                    {m.www_microinternship_hero_heading_after()}
                  </>
                }
                body={[m.www_microinternship_hero_body()]}
              />
              <Box display="flex" gap="3" flexWrap={{ base: "wrap", md: "nowrap" }}>
                <Button
                  as="a"
                  variant="primary"
                  colorPalette="blackberry"
                  width={{ base: "full", md: "auto" }}
                  {...({ href: "#register" } as any)}
                >
                  {m.www_microinternship_hero_cta_register()}
                </Button>
                <Button
                  as="a"
                  variant="secondary"
                  colorPalette="blackberry"
                  width={{ base: "full", md: "auto" }}
                  {...({ href: "#how" } as any)}
                >
                  {m.www_microinternship_hero_cta_how()}
                </Button>
              </Box>
            </Box>
            <HeroField />
          </Content>
        </Section>

        <Section ramp="blackberry" {...HAIRLINE}>
          <Content maxW="container.lg" marginBottom="6">
            <StatementBlock
              size="section"
              heading={m.www_home_impact_heading()}
              body={[m.www_home_impact_body()]}
            />
          </Content>
          <Impact data={query} seed={seed} variant="contributions" />
        </Section>

        <Section ramp="blackberry" id="how" scrollMarginTop="76px" {...HAIRLINE}>
          <Content maxW="container.lg" marginBottom="12">
            <StatementBlock size="section" heading={m.www_microinternship_how_heading()} />
          </Content>
          <HowItWorks />
        </Section>

        <Section ramp="blackberry" {...HAIRLINE}>
          <Content
            maxW="container.xl"
            marginBottom="0"
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "1fr {sizes.lg}" }}
            gap={{ base: "9", md: "16" }}
            alignItems="center"
          >
            <Box display="flex" flexDirection="column" gap="5">
              <StatementBlock
                size="section"
                heading={m.www_microinternship_afterward_heading()}
                body={[m.www_microinternship_afterward_body()]}
              />
              <Box fontSize="sm" lineHeight="moderate" color="gray.600" maxWidth="lg">
                {m.www_microinternship_afterward_hiring_line()}{" "}
                <Box
                  as="a"
                  color="colorPalette.600"
                  textDecoration="underline"
                  {...({ href: "https://doi.org/10.1145/3770762.3772529" } as any)}
                >
                  {m.www_microinternship_afterward_hiring_link()}
                </Box>
                .
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" gap="5">
              {/* A standard-serif, white "paper" surface — deliberately
                  unlike the rest of the page's design language — so the
                  entry reads as an actual resume line rather than a
                  Topo card. `trueWhite`/`trueBlack`/`blackAlpha.*` are used
                  throughout instead of `white`/`black`/`gray.*` — those
                  flip with dark mode, but this card is meant to stay
                  literal paper-and-ink in both modes. */}
              <Box
                boxSizing="border-box"
                padding="{spacing.8} {spacing.9}"
                background="trueWhite"
                border="1px solid"
                borderColor="blackAlpha.200"
                borderRadius="lg"
                boxShadow="0 20px 40px rgba(18,5,16,0.08)"
                display="flex"
                flexDirection="column"
                gap="5"
                color="trueBlack"
                fontFamily="Georgia, 'Times New Roman', Times, serif"
              >
                <Box
                  as="span"
                  fontSize="xs"
                  letterSpacing="0.08em"
                  textTransform="uppercase"
                  color="blackAlpha.600"
                >
                  {m.www_microinternship_afterward_resume_label()}
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="2.5"
                  fontSize="md"
                  lineHeight="moderate"
                >
                  <Box display="flex" justifyContent="space-between" gap="4" alignItems="baseline">
                    <Box as="strong" fontSize="lg">
                      {m.www_microinternship_afterward_resume_project()}
                    </Box>
                    <Box as="span" fontStyle="italic" color="blackAlpha.600">
                      {m.www_microinternship_afterward_resume_date()}
                    </Box>
                  </Box>
                  <Box color="blackAlpha.800">
                    — {m.www_microinternship_afterward_resume_summary()}
                  </Box>
                  <Box color="blackAlpha.800">
                    — {m.www_microinternship_afterward_resume_reviewer()}
                  </Box>
                  <Box color="blackAlpha.600" fontStyle="italic">
                    {m.www_microinternship_afterward_resume_program_line()}
                  </Box>
                </Box>
              </Box>
              <PullQuote ramp="blackberry">
                &ldquo;{m.www_microinternship_afterward_resume_quote()}&rdquo;
                <Box as="footer" marginTop="1.5" fontSize="sm" fontStyle="normal" color="gray.600">
                  {m.www_microinternship_afterward_resume_quote_caption()}
                </Box>
              </PullQuote>
            </Box>
          </Content>
        </Section>

        <Wash ramp="blackberry" shape="tint">
          <Section ramp="blackberry" {...HAIRLINE}>
            <Content
              id="register"
              maxW="container.xl"
              marginBottom="0"
              scrollMarginTop="20"
              display="flex"
              flexDirection="column"
              gap="9"
            >
              <Content maxW="container.lg" marginBottom="0">
                <StatementBlock
                  size="section"
                  heading={m.www_microinternship_register_heading()}
                  body={[m.www_microinternship_register_body()]}
                />
              </Content>

              <Box
                display="grid"
                gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap="5"
              >
                <Box {...CARD} borderColor="current.border">
                  <Box display="flex" flexDirection="column" gap="2">
                    <Box as="h3" margin="0" fontSize="2xl" fontWeight="700" lineHeight="shorter">
                      {m.www_microinternship_register_school_heading()}
                    </Box>
                    <Box fontSize="md" lineHeight="moderate" color="gray.700">
                      {m.www_microinternship_register_school_body()}
                    </Box>
                  </Box>
                  <Box
                    boxSizing="border-box"
                    padding="{spacing.4.5} {spacing.5}"
                    borderRadius="2xl"
                    border="1.5px dashed"
                    borderColor="colorPalette.400"
                    display="flex"
                    flexDirection="column"
                    gap="1.5"
                  >
                    <Box
                      as="span"
                      fontFamily="mono"
                      fontSize="xs"
                      letterSpacing="0.04em"
                      textTransform="uppercase"
                      color="colorPalette.600"
                    >
                      {m.www_microinternship_register_school_link_label()}
                    </Box>
                    <Box as="span" fontFamily="mono" fontSize="sm" color="gray.700">
                      {m.www_microinternship_register_school_link_example()}
                    </Box>
                  </Box>
                  <Box marginTop="auto" fontSize="sm" lineHeight="moderate" color="gray.600">
                    {m.www_microinternship_register_school_partner_prompt()}{" "}
                    <Box
                      as="a"
                      color="colorPalette.600"
                      textDecoration="underline"
                      {...({ href: "/micro-internship/school-partnership" } as any)}
                    >
                      {m.www_microinternship_register_school_partner_link()}
                    </Box>
                    .
                  </Box>
                </Box>

                <Box {...CARD} borderColor="black">
                  <Box display="flex" flexDirection="column" gap="2">
                    <Box as="h3" margin="0" fontSize="2xl" fontWeight="700" lineHeight="shorter">
                      {m.www_microinternship_register_own_heading()}
                    </Box>
                    <Box fontSize="md" lineHeight="moderate" color="gray.700">
                      {m.www_microinternship_register_own_body()}
                    </Box>
                  </Box>
                  <Checklist
                    items={[
                      m.www_microinternship_register_own_check1(),
                      m.www_microinternship_register_own_check2(),
                      m.www_microinternship_register_own_check3(),
                    ]}
                  />
                  <Button
                    as="a"
                    variant="primary"
                    colorPalette="blackberry"
                    marginTop="auto"
                    {...({ href: "/direct" } as any)}
                  >
                    {m.www_microinternship_register_own_cta()}
                  </Button>
                </Box>
              </Box>

              <PartnerPill id="partner" />
            </Content>
          </Section>
        </Wash>

        <Section ramp="blackberry" {...HAIRLINE}>
          <Content maxW="container.lg" display="flex" flexDirection="column" gap="10">
            <StatementBlock
              size="section"
              heading={m.www_microinternship_evidence_heading()}
              body={[m.www_microinternship_evidence_body()]}
            />
            <Evidence data={query} seed={seed} />
          </Content>
        </Section>
      </Band>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      query: await apiFetch(MicroInternshipQuery, {}, {}),
      seed: Math.random(),
    },
    revalidate: 300,
  };
};
