import * as m from "@codeday/i18n/messages";
import { Box, Button, Eyebrow } from "@codeday/topo/Atom";
import { Band, CognitoForm, Content, Section, Wash } from "@codeday/topo/Molecule";
import { NumberWithDetails, StatementBlock } from "@codeday/topo/Organism";
import { apiFetch } from "@codeday/topo/utils";
import { ResultOf } from "@graphql-typed-document-node/core";
import { GetStaticProps } from "next";
import React, { useState } from "react";

import { graphql } from "@/gql";

import { Message } from "../../components/Message";
import Checklist from "../../components/MicroInternship/Checklist";
import PartnerPill from "../../components/MicroInternship/PartnerPill";
import Questions from "../../components/MicroInternship/Questions";
import Page from "../../components/Page";

const MicroInternshipRegisterQuery = graphql(`
  query MicroInternshipRegisterQuery {
    ...MicroInternshipQuestionsComponent
  }
`);

const HAIRLINE = { borderTop: "sm", borderTopColor: "current.border" } as const;

// Two ways to cover the cost of the same program share this card shell —
// "Register and pay" is the default (ink outline, dark button), "Apply for a
// scholarship" the alternative (hairline outline, outline button).
const CARD = {
  boxSizing: "border-box",
  padding: "{spacing.9} {spacing.9} {spacing.8}",
  background: "white",
  borderRadius: "4xl",
  border: "1.5px solid",
  display: "flex",
  flexDirection: "column",
  gap: "6",
} as const;

interface MicroInternshipRegisterProps {
  query: ResultOf<typeof MicroInternshipRegisterQuery>;
}

export default function MicroInternshipRegister({ query }: MicroInternshipRegisterProps) {
  const [selectedOption, setSelectedOption] = useState<"pay" | "scholarship" | null>(null);

  return (
    <Page
      slug="/micro-internship/register"
      title={m.www_microinternship_individual_breadcrumb_current()}
      description={m.www_microinternship_individual_meta_description()}
      logoHeadingLevel="span"
    >
      <Band tone="page">
        <Section ramp="blackberry" spacing="compact">
          <Content
            maxW="container.xl"
            marginBottom="0"
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "1fr {sizes.md}" }}
            columnGap="16"
            rowGap="7"
            alignItems="end"
          >
            <Box display="flex" flexDirection="column" gap="6">
              <Eyebrow ramp="blackberry" color="colorPalette.600">
                {m.www_microinternship_hero_eyebrow()}
              </Eyebrow>
              <StatementBlock
                size="hero"
                as="h1"
                ramp="blackberry"
                heading={<Message message={m.www_microinternship_individual_title_heading} />}
                body={[m.www_microinternship_individual_title_body()]}
              />
            </Box>
            <Box
              boxSizing="border-box"
              padding="{spacing.6} {spacing.7}"
              borderRadius="3xl"
              background="colorPalette.100"
              display="flex"
              flexDirection="column"
              gap="2.5"
            >
              <Box
                as="span"
                fontFamily="mono"
                fontSize="xs"
                letterSpacing="0.04em"
                textTransform="uppercase"
                color="colorPalette.600"
              >
                {m.www_microinternship_individual_title_school_eyebrow()}
              </Box>
              <Box fontSize="md" lineHeight="moderate" color="gray.700">
                {m.www_microinternship_individual_title_school_body_lead()}{" "}
                <Box
                  as="a"
                  color="colorPalette.600"
                  textDecoration="underline"
                  {...({ href: "/micro-internship#register" } as any)}
                >
                  {m.www_microinternship_individual_title_school_body_link()}
                </Box>
                .
              </Box>
            </Box>
          </Content>
        </Section>

        <Section ramp="blackberry" {...HAIRLINE}>
          <Content maxW="container.lg" marginBottom="9">
            <StatementBlock
              size="section"
              heading={m.www_microinternship_individual_things_heading()}
            />
          </Content>
          <Content maxW="container.lg" marginBottom="0" display="flex" flexDirection="column">
            <NumberWithDetails
              ramp="blackberry"
              items={[
                {
                  id: "micro",
                  number: m.www_microinternship_individual_things_micro_number(),
                  heading: m.www_microinternship_individual_things_micro_heading(),
                  body: <Message message={m.www_microinternship_individual_things_micro_body} />,
                },
                {
                  id: "mentors",
                  number: m.www_microinternship_individual_things_mentors_number(),
                  heading: m.www_microinternship_individual_things_mentors_heading(),
                  body: <Message message={m.www_microinternship_individual_things_mentors_body} />,
                },
                {
                  id: "workshops",
                  number: m.www_microinternship_individual_things_workshops_number(),
                  heading: m.www_microinternship_individual_things_workshops_heading(),
                  body: (
                    <Message message={m.www_microinternship_individual_things_workshops_body} />
                  ),
                },
                {
                  id: "residency",
                  number: m.www_microinternship_individual_things_residency_number(),
                  heading: m.www_microinternship_individual_things_residency_heading(),
                  body: (
                    <Message message={m.www_microinternship_individual_things_residency_body} />
                  ),
                },
              ]}
            />
          </Content>
        </Section>

        <Wash ramp="blackberry" shape="tint">
          <Section ramp="blackberry" {...HAIRLINE}>
            <Content
              id="options"
              maxW="container.xl"
              marginBottom="0"
              scrollMarginTop="20"
              display="flex"
              flexDirection="column"
              gap="8"
            >
              {selectedOption ? (
                <CognitoForm
                  formId={131}
                  prefill={{ Scholarship: selectedOption === "scholarship" }}
                />
              ) : (
                <>
                  <StatementBlock
                    size="section"
                    maxWidth="container.lg"
                    heading={m.www_microinternship_individual_options_heading()}
                    body={[
                      <Message
                        key="body"
                        message={m.www_microinternship_individual_options_body}
                      />,
                    ]}
                  />

                  <Box
                    display="grid"
                    gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    gap="5"
                  >
                    <Box {...CARD} borderColor="black">
                      <Box display="flex" flexDirection="column" gap="2">
                        <Box as="h3" margin="0" fontSize="2xl" fontWeight="700">
                          {m.www_microinternship_individual_options_pay_heading()}
                        </Box>
                        <Box fontSize="md" lineHeight="moderate" color="gray.700">
                          {m.www_microinternship_individual_options_pay_body()}
                        </Box>
                      </Box>
                      <Button
                        variant="primary"
                        colorPalette="blackberry"
                        marginTop="auto"
                        onClick={() => setSelectedOption("pay")}
                      >
                        {m.www_microinternship_individual_options_pay_cta()}
                      </Button>
                    </Box>

                    <Box {...CARD} borderColor="current.border">
                      <Box display="flex" flexDirection="column" gap="2">
                        <Box as="h3" margin="0" fontSize="2xl" fontWeight="700">
                          {m.www_microinternship_individual_options_scholarship_heading()}
                        </Box>
                        <Box fontSize="md" lineHeight="moderate" color="gray.700">
                          {m.www_microinternship_individual_options_scholarship_body()}
                        </Box>
                      </Box>
                      <Button
                        variant="secondary"
                        colorPalette="blackberry"
                        marginTop="auto"
                        onClick={() => setSelectedOption("scholarship")}
                      >
                        {m.www_microinternship_individual_options_scholarship_cta()}
                      </Button>
                    </Box>
                  </Box>

                  <PartnerPill />
                </>
              )}
            </Content>
          </Section>
        </Wash>

        <Section ramp="blackberry" {...HAIRLINE}>
          <Content
            maxW="container.lg"
            marginBottom="0"
            display="flex"
            flexDirection="column"
            gap="7"
          >
            <StatementBlock
              size="section"
              heading={m.www_microinternship_individual_qa_heading()}
            />
            <Questions data={query} />
          </Content>
        </Section>
      </Band>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      query: await apiFetch(MicroInternshipRegisterQuery, {}, {}),
    },
    revalidate: 300,
  };
};
