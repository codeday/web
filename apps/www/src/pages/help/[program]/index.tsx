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
import { print } from "graphql";
import { GetStaticProps, GetStaticPaths } from "next";
import React from "react";

import Page from "../../../components/Page";
import { usePageData } from "@codeday/topo/Theme";
import { HelpProgramIndexQuery, HelpProgramIndexPathsQuery } from "./index.gql";

const icons: Record<string, React.ReactElement> = {
  Student: <StudentIcon />,
  Parent: <ParentIcon />,
  School: <SchoolIcon />,
  Partner: <PartnerIcon />,
  Volunteer: <VolunteerIcon />,
};

interface ProgramProps {
  programWebname: string;
}

export default function Program({ programWebname }: ProgramProps) {
  const { programs, faqs, events } = usePageData().cms || {};

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
        {photo && <Image src={photo} alt="" w="100%" mb={8} rounded="sm" />}
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
  const query = await apiFetch(print(HelpProgramIndexPathsQuery), {}, {});

  return {
    paths: query.cms.programs?.items
      ?.filter((program: any) => program?.linkedFrom?.faqs?.items?.length > 0)
      .map((program: any) => ({ params: { program: program.webname } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const program = params?.program as string;
  const query = await apiFetch(print(HelpProgramIndexQuery), { programWebname: program }, {});

  return {
    props: {
      query,
      programWebname: program,
    },
    revalidate: 300,
  };
};
