import * as m from "@codeday/i18n/messages";
import {
  Box,
  Text,
  Heading,
  Link,
  Button,
  Divider,
  Card,
  CardHeader,
  CardBody,
} from "@codeday/topo/Atom";
import { Highlight } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { ResultOf } from "@graphql-typed-document-node/core";
import { DateTime } from "luxon";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useState, useRef } from "react";

import { graphql } from "@/gql";
import { useFragment } from "@/gql/fragment-masking";

import MuxAutoplayVideo from "../../components/MuxAutoplayVideo";
import Page from "../../components/Page";
import PhotoGallery, {
  VolunteerPhotoGalleryFragment,
} from "../../components/Volunteer/PhotoGallery";
import RemindMe from "../../components/Volunteer/RemindMe";
import Testimonials, {
  VolunteerTestimonialsFragment,
} from "../../components/Volunteer/Testimonials";
import Wizard from "../../components/Volunteer/Wizard";

export const VolunteerFragment = graphql(`
  fragment VolunteerComponent on Query {
    clear {
      events(where: { startDate: { gt: $now } }) {
        name
        contentfulWebname
        dontAcceptVolunteers: getMetadata(key: "volunteers.form.hide")
        region {
          name
          countryName
          aliases
        }
      }
    }
  }
`);

export const VolunteerQuery = graphql(`
  query VolunteerQuery($now: ClearDateTime!) {
    ...VolunteerComponent
    ...VolunteerTestimonials
    ...VolunteerPhotoGallery
  }
`);

interface VolunteerProps {
  query: ResultOf<typeof VolunteerQuery>;
  seed: number;
  layout?: string;
  startBackground?: string;
  startRegion?: string;
  startPage?: string;
}

export default function Volunteer({
  query,
  seed,
  layout,
  startBackground,
  startRegion,
  startPage,
}: VolunteerProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const { asPath, query: routerQuery } = useRouter();
  const { clear } = useFragment(VolunteerFragment, query);
  const [wizardVisible, setWizardVisible] = useState(false);

  const secondText = (
    <>
      CodeDay volunteers help with everything from mentoring, to judging, to operational support at
      events.{" "}
      <Highlight>
        Most volunteer roles do not involve yourself coding, so we encourage you to apply,
        regardless of your technical background!
      </Highlight>{" "}
    </>
  );

  const signUp = (
    <Card colorPalette="marmalade" ref={formRef}>
      <CardHeader>
        <Heading as="h3" fontSize="xl" color="trueWhite">
          {m.www_volunteer_signup_heading()}
        </Heading>
      </CardHeader>
      <CardBody>
        {layout !== "go" && (
          <>
            <Box display={{ base: "block", md: "none" }} textAlign="center">
              <RemindMe />
              {!wizardVisible && (
                <>
                  <Text mt={4}>{m.www_volunteer_or()}</Text>
                  <Button
                    size="sm"
                    variant="secondary"
                    colorPalette="marmalade"
                    onClick={() => setWizardVisible(true)}
                  >
                    {m.www_volunteer_fill_out_now()}
                  </Button>
                </>
              )}
            </Box>
            <Divider
              display={{ base: wizardVisible ? "block" : "none", md: "none" }}
              mt={8}
              mb={8}
            />
          </>
        )}
        <Box display={{ base: wizardVisible || layout === "go" ? "block" : "none", md: "block" }}>
          <Wizard
            startBackground={startBackground}
            startPage={startPage !== undefined ? parseInt(startPage, 10) : undefined}
            startRegion={startRegion}
            events={clear.events}
            formRef={formRef}
            after={
              routerQuery?.return && routerQuery?.returnto
                ? `https://${routerQuery.return}.codeday.org/${routerQuery.returnto}`
                : undefined
            }
          />
        </Box>
      </CardBody>
    </Card>
  );

  return (
    <Page slug={`/${asPath}`} title="Volunteer" noFun>
      <NextSeo
        description="We need you to help students find their place in the tech industry! (Even if you don't have a tech background!)`"
        openGraph={{
          title: "Volunteer for CodeDay",
          description: `We need you to help students find their place in the tech industry! (Even if you don't have a tech background!)`,
          images: [
            {
              url: "https://f2.codeday.org/d5pti1xheuyu/5HXduujNbKhEwAsFchjNcU/5ca87b445e48ae78593b8a4841e94775/gray-wallaby-965e09f9_o.jpg?w=1200&h=630&fit=fill",
              width: 1200,
              height: 630,
              alt: "Volunteers watching a presentation at CodeDay.",
            },
          ],
        }}
      />
      <Content mt={-8}>
        {layout !== "go" && (
          <>
            <Box
              display="grid"
              gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
              gap={{ base: 6, md: 10 }}
              alignItems="center"
              mt={{ base: 4, md: 8 }}
              mb={{ base: 8, md: 12 }}
            >
              <Box>
                <Heading
                  as="h2"
                  fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                  mb={4}
                  textAlign={{ base: "center", md: "left" }}
                >
                  {m.www_volunteer_help_students()}
                </Heading>
                <Text fontSize="lg" textAlign={{ base: "center", md: "left" }}>
                  Thousands of volunteers just like you have{" "}
                  <Highlight>helped 50,000+ students find their place in tech,</Highlight> but
                  hundreds of thousands more still need your help.
                </Text>
                <Text fontSize="lg" display={{ base: "none", md: "block" }} textAlign="left" mt={2}>
                  {secondText}
                </Text>
              </Box>
              <Box>
                <MuxAutoplayVideo
                  videoId="c1BhPbPJvRjeGvUutUIgrCG5bCsgT021q"
                  startAt={14}
                  showUnmuteOverlay
                  borderRadius={{ base: "24px", md: "40px" }}
                  overflow="hidden"
                />
              </Box>
            </Box>
          </>
        )}
        {signUp}
      </Content>
      {layout !== "go" && (
        <>
          <Content display={{ base: "block", md: "none" }} mt={12}>
            <Text fontSize="lg">{secondText}</Text>
          </Content>
          <Content mt={12}>
            <Heading as="h3" textAlign="center" fontSize="3xl">
              {m.www_volunteer_lasting_impacts()}
            </Heading>
          </Content>
          <Content mt={8} mb={12}>
            <Box
              display="grid"
              gridTemplateColumns={{ base: "1fr", md: "1fr 2fr" }}
              gap={8}
              alignItems="start"
            >
              <Card display={{ base: "none", md: "block" }}>
                <CardBody textAlign="left">
                  <Heading as="h3" fontSize="xl">
                    {m.www_volunteer_time_commitment()}
                  </Heading>
                  <Text mb={2}>
                    {m.www_volunteer_time_varies()}
                    <br />
                    {m.www_volunteer_time_options()}
                  </Text>
                  <Heading as="h3" fontSize="xl">
                    {m.www_volunteer_deadline()}
                  </Heading>
                  <Text mb={2}>{m.www_volunteer_deadline_desc()}</Text>
                  <Heading as="h3" fontSize="xl">
                    {m.www_volunteer_requirements()}
                  </Heading>
                  <Text mb={2}>{m.www_volunteer_requirements_desc()}</Text>
                  <Heading as="h3" fontSize="xl">
                    {m.www_volunteer_groups_corporate()}
                  </Heading>
                  <Text>
                    <Link href="mailto:volunteer@codeday.org">{m.www_volunteer_email_us()}</Link>{" "}
                    {m.www_volunteer_or_word()}{" "}
                    <Link href="/volunteer/share">{m.www_volunteer_share_coworkers()}</Link>
                  </Text>
                </CardBody>
              </Card>
              <Box maxW="container.md">
                <Testimonials data={query} seed={seed} />
              </Box>
            </Box>
          </Content>
          <Content wide>
            <PhotoGallery data={query} />
          </Content>
        </>
      )}
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const query = await apiFetch(VolunteerQuery, { now: DateTime.now().minus({ months: 6 }) }, {});
  return {
    props: {
      query,
      seed: Math.random(),
    },
    revalidate: 300,
  };
};
