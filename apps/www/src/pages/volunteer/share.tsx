import * as m from "@codeday/i18n/messages";
import { Box, Grid, Text, Heading, Link } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { ResultOf } from "@graphql-typed-document-node/core";
import { GetStaticProps } from "next";
import React from "react";

import { graphql } from "@/gql";
import { useFragment } from "@/gql/fragment-masking";

import Page from "../../components/Page";
import VideoTestimonialThumbnail from "../../components/VideoTestimonialThumbnail";
import ProgramInfo, { ProgramInfoFragment } from "../../components/Volunteer/ProgramInfo";
import { upcomingEvents } from "../../utils/time";

export const VolunteerShareFragment = graphql(`
  fragment VolunteerShareComponent on Query {
    cms {
      testimonials: testimonials(where: { featured: true, type_in: ["Volunteer", "Mentor"] }) {
        items {
          firstName
          lastName
          title
          company
          video {
            url
          }
          ...VideoTestimonialThumbnailComponent
        }
      }
    }
  }
`);

const VolunteerShareQuery = graphql(`
  query VolunteerShareQuery {
    ...VolunteerShareComponent
    ...VolunteerProgramInfoComponent
  }
`);

const PROGRAM_WEIGHT = ["primary", "secondary", "minor"];

interface VolunteerProps {
  query: ResultOf<typeof VolunteerShareQuery>;
}

export default function Volunteer({ query }: VolunteerProps) {
  const {
    cms: { volunteerPrograms },
  } = useFragment(ProgramInfoFragment, query);
  const {
    cms: { testimonials },
  } = useFragment(VolunteerShareFragment, query);
  const programsWithUpcoming =
    volunteerPrograms?.items
      ?.map((program: any) => {
        return {
          ...program,
          upcoming: upcomingEvents(program.linkedFrom?.events?.items || []),
        };
      })
      .sort((a: any, b: any) => {
        if (a.upcoming.length > 0 && b.upcoming.length > 0)
          return a.upcoming[0].startsAt - b.upcoming[0].startsAt;
        if (a.upcoming.length > 0) return -1;
        if (b.upcoming.length > 0) return 1;
        return PROGRAM_WEIGHT.indexOf(a.type) - PROGRAM_WEIGHT.indexOf(b.type);
      }) || [];

  const videoTestimonial = testimonials?.items?.filter((t: any) => t.video)[0];

  return (
    <Page slug="/volunteer" title="Volunteer">
      <Content mt={-8}>
        <Heading as="h2" fontSize="5xl" mb={8} mt={8}>
          {m.www_share_heading()}
        </Heading>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "3fr 2fr" }} gap={8}>
          <Box>
            <Text fontSize="xl" mb={8}>
              We need everyone&apos;s help to create a more inclusive tech future for students!
              (Even if you don&apos;t have a tech background!) For corporate volunteering please
              email us at <Link href="mailto:volunteer@codeday.org">volunteer@codeday.org</Link>.
            </Text>
          </Box>
          <Box>
            <Heading as="h3" fontSize="md" color="current.textLight" textAlign="center" mb={2}>
              {m.www_share_hear_why({ name: videoTestimonial.firstName })}
              {videoTestimonial.company && (
                <>
                  {videoTestimonial.title ? `, ${videoTestimonial.title} at ` : " from "}
                  {videoTestimonial.company}
                  {videoTestimonial.title && ","}
                </>
              )}{" "}
              volunteers:
            </Heading>
            <VideoTestimonialThumbnail video={videoTestimonial} />
          </Box>
        </Grid>
        <Box>
          {programsWithUpcoming
            .filter((program: any) => program.volunteerDetails)
            .map((program: any) => (
              <ProgramInfo key={program.webname} program={program} />
            ))}
        </Box>
      </Content>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const query = await apiFetch(VolunteerShareQuery, {}, {});
  return {
    props: {
      query,
    },
    revalidate: 300,
  };
};
