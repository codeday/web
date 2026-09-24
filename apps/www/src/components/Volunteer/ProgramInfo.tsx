import { Box, Grid, Text, List, ListItem, Button } from "@codeday/topo/Atom";
import { ContentfulRichText } from "@codeday/topo/Molecule";
import React from "react";

import { graphql } from "@/gql";

import { formatInterval } from "../../utils/time";
import ProgramShareBlurb from "./ProgramShareBlurb";
import { VOLUNTEER_ROLES } from "./wizardConfig";

export const ProgramInfoFragment = graphql(`
  fragment VolunteerProgramInfoComponent on Query {
    cms {
      volunteerPrograms: programs(limit: 15, where: { archived_not: true }) {
        items {
          name
          webname
          shortDescription
          virtual
          volunteerUrl
          volunteerDetails {
            json
          }
          volunteerBlurb {
            json
          }
          volunteerRecruitingResources(limit: 10) {
            items {
              title
              contentType
              url
              preview: url(transform: { width: 100, height: 100, resizeStrategy: FILL })
            }
          }
          type
          volunteerPositions
          linkedFrom {
            events(limit: 100) {
              items {
                startsAt
                endsAt
              }
            }
          }
        }
      }
    }
  }
`);

const ROLE_COLORS: Record<string, string> = Object.keys(VOLUNTEER_ROLES).reduce(
  (accum, type) => ({ [type]: (VOLUNTEER_ROLES as any)[type].color, ...accum }),
  {},
);

interface ProgramInfoProps {
  program: any;
}

export default function ProgramInfo({ program }: ProgramInfoProps) {
  return (
    <Box border="current.borderColor" borderWidth={1} p={4} mb={8}>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8}>
        <Box>
          <Box fontSize="3xl" fontWeight="bold" mb={4}>
            {program.name}
          </Box>
          {program.upcoming.length > 0 && (
            <Box mb={4}>
              <Text bold mb={1}>
                Upcoming Dates
              </Text>
              <List listStyleType="disc" pl={2}>
                {program.upcoming.slice(0, 3).map((event: any) => (
                  <ListItem>{formatInterval(event.startsAt, event.endsAt)}</ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>

        <Box>
          <ContentfulRichText json={program.volunteerDetails.json} />
          {program.virtual && (
            <Box fontWeight="bold" color="red.700">
              Online volunteer opportunity.
            </Box>
          )}
        </Box>

        <Box position="relative" pb={{ base: null, md: 16 }}>
          {program.volunteerPositions?.map((pos: string) => (
            <Box
              display="inline-block"
              p={1}
              mr={1}
              mb={1}
              borderWidth={1}
              borderColor={`${ROLE_COLORS[pos]}.700`}
              rounded="md"
              bg={`${ROLE_COLORS[pos]}.50`}
              color={`${ROLE_COLORS[pos]}.700`}
            >
              {pos.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1))}s
            </Box>
          ))}
          <Button
            as="a"
            {...({ href: `/volunteer/${program.webname}` } as any)}
            target="_blank"
            rel="noopener"
            w="full"
            mb={4}
            position={{ base: null, md: "absolute" }}
            bottom={{ base: null, md: 0 }}
            left={{ base: null, md: 0 }}
          >
            Learn More
          </Button>
        </Box>
      </Grid>
      <ProgramShareBlurb program={program} />
    </Box>
  );
}
