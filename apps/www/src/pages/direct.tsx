import * as m from "@codeday/i18n/messages";
import { getLocale } from "@codeday/i18n/runtime";
import { Box, Button, SquircleLogo } from "@codeday/topo/Atom";
import { Band, CognitoForm, Content, Section, Wash } from "@codeday/topo/Molecule";
import { NumberWithDetails, StatementBlock, StatTrio } from "@codeday/topo/Organism";
import { apiFetch } from "@codeday/topo/utils";
import { fixLocaleCasing } from "@codeday/utils";
import { ResultOf } from "@graphql-typed-document-node/core";
import { DateTime } from "luxon";
import { GetStaticProps } from "next";
import React, { useEffect, useState } from "react";

import { graphql } from "@/gql";

import { Message } from "../components/Message";
import Checklist from "../components/MicroInternship/Checklist";
import PartnerPill from "../components/MicroInternship/PartnerPill";
import Questions from "../components/MicroInternship/Questions";
import RegistrationCountdown from "../components/MicroInternship/RegistrationCountdown";
import Page from "../components/Page";

const MicroInternshipRegisterQuery = graphql(`
  query MicroInternshipRegisterQuery($now: CmsDateTime!) {
    cms {
      events(
        where: { program: { webname: "direct" }, registrationsCloseAt_gt: $now }
        order: registrationsCloseAt_ASC
        limit: 1
      ) {
        items {
          id
          registrationsCloseAt
        }
      }
    }
    labs {
      statOutcomes {
        studentCount
      }
    }
    ...MicroInternshipQuestionsComponent
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
  gap: "6",
} as const;

interface MicroInternshipRegisterProps {
  query: ResultOf<typeof MicroInternshipRegisterQuery>;
}

export default function MicroInternshipRegister({ query }: MicroInternshipRegisterProps) {
  const [selectedOption, setSelectedOption] = useState<"pay" | "scholarship" | null>(null);
  const event = query.cms?.events?.items[0] ?? null;

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const selectOption = (option: "pay" | "scholarship") => {
    setSelectedOption(option);
    document.getElementById("options")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Page
      slug="/direct"
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
              {/* The partner lockup reads as one image to assistive tech,
                labelled with the "CodeDay + Mentors in Tech" copy it replaced.
                Mentors in Tech only publishes a white-on-transparent PNG
                (from mentorsintech.org), which would vanish on this light
                band, so it's used as a mask over MinT's own brand green
                rather than rendered as an <img>. That green isn't in our
                palette, so it's hard-coded: #4F8072 is the darker shade
                mentorsintech.org itself uses on light grounds, not the
                brighter #92DDC8 mint it uses on dark ones, which washes out
                against this band. */}
              <Box
                display="flex"
                alignItems="center"
                gap="3"
                role="img"
                aria-label={m.www_microinternship_individual_title_eyebrow()}
              >
                <SquircleLogo h="8" w="8" onWash={false} aria-hidden />
                <Box as="span" fontSize="2xl" fontWeight="700" color="gray.500" aria-hidden>
                  +
                </Box>
                <Box
                  h="8"
                  aspectRatio="1130 / 511"
                  bg="#4F8072"
                  maskImage="url(/mentors-in-tech.png)"
                  maskSize="contain"
                  maskRepeat="no-repeat"
                  maskPosition="center"
                  aria-hidden
                />
              </Box>
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
          {event?.registrationsCloseAt && (
            <Content
              maxW="container.xl"
              marginTop="9"
              marginBottom="0"
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              gap="3"
            >
              <RegistrationCountdown closesAt={event.registrationsCloseAt} />
              <Box display="flex" flexWrap="wrap" gap="3">
                <Button
                  variant="primary"
                  colorPalette="blackberry"
                  onClick={() => selectOption("pay")}
                >
                  {m.www_microinternship_individual_options_pay_cta()}
                </Button>
                <Button
                  variant="ghost"
                  colorPalette="blackberry"
                  onClick={() => selectOption("scholarship")}
                >
                  {m.www_microinternship_individual_options_scholarship_cta()}
                </Button>
              </Box>
              <Box fontSize="md" color="gray.700">
                {m.www_microinternship_individual_title_due({
                  date: isMounted
                    ? DateTime.fromISO(event.registrationsCloseAt)
                        .setLocale(fixLocaleCasing(getLocale()))
                        .toLocaleString(DateTime.DATETIME_FULL)
                    : "",
                })}
              </Box>
            </Content>
          )}
        </Section>

        <Section ramp="blackberry">
          <StatTrio
            maxWidth="container.lg"
            marginX="auto"
            items={[
              {
                id: "students",
                value: query.labs.statOutcomes.studentCount,
                format: "integer",
                label: m.www_microinternship_individual_stats_students_label(),
              },
              {
                id: "jobs",
                value: 70,
                format: "percent",
                label: m.www_microinternship_individual_stats_jobs_label(),
              },
              {
                id: "mentors",
                value: m.www_microinternship_individual_stats_mentors_value(),
                format: "integer",
                label: m.www_microinternship_individual_stats_mentors_label(),
              },
            ]}
          />
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
                <Content maxW="container.md">
                  <CognitoForm
                    formId={131}
                    prefill={{ Scholarship: selectedOption === "scholarship" }}
                  />
                </Content>
              ) : (
                <>
                  <Box
                    display="grid"
                    gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    gap="3"
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
      query: await apiFetch(MicroInternshipRegisterQuery, { now: new Date().toISOString() }, {}),
    },
    revalidate: 300,
  };
};
