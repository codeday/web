import { Box, Grid, Image, Text, Heading } from "@codeday/topo/Atom";
import {
  Content,
  IconBox,
  IconBoxIcon as HeaderIcon,
  IconBoxText as HeaderText,
} from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import {
  Backpack as StudentIcon,
  BuildingHome as ParentIcon,
  BuildingSchool as SchoolIcon,
  BuildingOffice as PartnerIcon,
  IdCard as VolunteerIcon,
} from "@codeday/topocons";
import { ResultOf } from "@graphql-typed-document-node/core";
import { GetStaticProps, GetStaticPaths } from "next";
import React from "react";

import { graphql } from "@/gql";
import { useFragment } from "@/gql/fragment-masking";

import Page from "../../../components/Page";

export const HelpProgramIndexFragment = graphql(`
  fragment HelpProgramIndexComponent on Query {
    cms {
      programs(where: { webname: $programWebname }, limit: 1) {
        items {
          name
        }
      }
      events(where: { program: { webname: $programWebname } }, limit: 15) {
        items {
          linkedFrom {
            pressPhotos(limit: 1) {
              items {
                photo {
                  url(transform: { width: 1024, height: 250, resizeStrategy: FILL, quality: 80 })
                }
              }
            }
          }
        }
      }
      faqs(where: { program: { webname: $programWebname } }, limit: 1000) {
        items {
          audience
        }
      }
    }
  }
`);

const HelpProgramIndexQuery = graphql(`
  query HelpProgramIndexQuery($programWebname: String!) {
    ...HelpProgramIndexComponent
  }
`);

const HelpProgramIndexPathsQuery = graphql(`
  query HelpProgramIndexPathsQuery {
    cms {
      programs {
        items {
          webname
          linkedFrom {
            faqs(limit: 1) {
              items {
                sys {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`);

const icons: Record<string, React.ReactElement> = {
  Student: <StudentIcon />,
  Parent: <ParentIcon />,
  School: <SchoolIcon />,
  Partner: <PartnerIcon />,
  Volunteer: <VolunteerIcon />,
};

interface ProgramProps {
  query: ResultOf<typeof HelpProgramIndexQuery>;
  programWebname: string;
}

export default function Program({ query, programWebname }: ProgramProps) {
  const { programs, faqs, events } = useFragment(HelpProgramIndexFragment, query)?.cms || {};

  if (!programWebname) return <></>;

  const program = programs?.items[0] || null;
  const audiences =
    faqs?.items
      ?.map((faq: any) => faq.audience)
      .reduce((accum: string[], auds: string[]) => [...accum, ...auds], [])
      .reduce(
        (accum: string[], aud: string) => (accum.includes(aud) ? accum : [...accum, aud]),
        [],
      ) || [];

  const photos =
    events?.items
      ?.map((e: any) => e?.linkedFrom?.pressPhotos?.items[0]?.photo?.url)
      .filter((photo: any) => photo) || [];
  const photo = photos[0] || null;

  return (
    <Page slug={`/help/${programWebname}`} title={`${program.name} ~ Help`}>
      <Content mt={-8}>
        {photo && <Image src={photo} alt="" w="full" mb={8} rounded="sm" />}
        <Heading as="h2" fontSize="5xl">
          {program.name} Helpdesk
        </Heading>
        <Text mb={8}>Which best describes you?</Text>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "repeat(3, 1fr)" }} gap={8}>
          {audiences.map((aud: string) => (
            <IconBox
              as="a"
              key={aud}
              {...({ href: `/help/${programWebname}/${aud.toLowerCase()}` } as any)}
            >
              <HeaderIcon>
                <Box
                  display="inline-block"
                  rounded="full"
                  bg="red.600"
                  color="white"
                  p={4}
                  fontSize="4xl"
                  textAlign="center"
                >
                  {icons[aud]}
                </Box>
              </HeaderIcon>
              <HeaderText>{aud}</HeaderText>
            </IconBox>
          ))}
        </Grid>
      </Content>
    </Page>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = await apiFetch(HelpProgramIndexPathsQuery, {}, {});

  return {
    paths: query.cms.programs?.items
      ?.filter((program: any) => program?.linkedFrom?.faqs?.items?.length > 0)
      .map((program: any) => ({ params: { program: program.webname } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const program = params?.program as string;
  const query = await apiFetch(HelpProgramIndexQuery, { programWebname: program }, {});

  return {
    props: {
      query,
      programWebname: program,
    },
    revalidate: 300,
  };
};
