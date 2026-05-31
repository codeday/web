import { Box, Grid, Image, Text, Heading } from "@codeday/topo/Atom";
import { Content, ContentfulRichText } from "@codeday/topo/Molecule";
import { useColorMode, usePageData } from "@codeday/topo/Theme";
import { apiFetch } from "@codeday/topo/utils";
import { UiX } from "@codeday/topocons";
import { print } from "graphql";
import { GetStaticProps, GetStaticPaths } from "next";
import React, { useState } from "react";

import Page from "../../../components/Page";

import { HelpProgramAudienceQuery, HelpProgramAudiencePathsQuery } from "./audience.gql";

interface AudienceProps {
  programWebname: string;
  audience: string;
}

export default function Audience({ programWebname, audience }: AudienceProps) {
  const { colorMode } = useColorMode();
  const [tag, setTag] = useState<string | null>(null);

  if (!programWebname || !audience) return <></>;

  const { programs, faqs, events } = usePageData().cms || {};
  const program = programs?.items[0] || null;

  const photos =
    events?.items
      ?.map((e: any) => e?.linkedFrom?.pressPhotos?.items[0]?.photo?.url)
      .filter((photo: any) => photo) || [];
  const photo = photos[0] || null;

  const allTags = faqs?.items
    ?.map((faq: any) => faq.tags || [])
    .reduce((accum: string[], tags: string[]) => [...accum, ...tags], [])
    .reduce((accum: string[], t: string) => (accum.includes(t) ? accum : [...accum, t]), []);

  const filteredFaqs = !tag
    ? faqs?.items
    : faqs?.items?.filter((faq: any) => faq?.tags?.includes(tag));

  return (
    <Page
      slug={`/help/${programWebname}/${audience.toLowerCase()}`}
      title={`${audience} ~ ${program.name} ~ Help`}
    >
      <Content mt={-8}>
        {photo && <Image src={photo} alt="" w="100%" mb={8} rounded="sm" />}
        <Heading as="h2" fontSize="5xl" mb={4}>
          {program.name} {audience} Helpdesk
        </Heading>

        {allTags?.length > 0 && (
          <Box borderWidth={1} p={2} mb={4} rounded="sm">
            <Text fontWeight="bold" color="current.textLight" mb={1}>
              Show only questions about:
            </Text>
            {allTags.map((t: string) => (
              <Box
                key={t}
                display="inline-block"
                borderWidth={1}
                rounded="sm"
                onClick={() => setTag(t === tag ? null : t)}
                mr={2}
                mb={2}
                p={1}
                pl={2}
                pr={2}
                cursor="pointer"
                color={t === tag ? "current.text" : "current.textLight"}
              >
                {t}
                {t === tag && (
                  <>
                    {" "}
                    <UiX />
                  </>
                )}
              </Box>
            ))}
          </Box>
        )}

        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
          {filteredFaqs?.map((faq: any) => (
            <Box
              key={faq.sys.id}
              as="a"
              display="block"
              p={4}
              pb={0}
              {...({ href: `/help/article/${faq.sys.id}` } as any)}
              rounded="sm"
              borderWidth={1}
              mb={2}
              shadow="sm"
              maxHeight={48}
              overflowY="hidden"
              position="relative"
            >
              <Heading as="h3" fontSize="xl" mb={4}>
                {faq.title}
              </Heading>
              <ContentfulRichText json={faq.answer.json} h1Size="xl" />
              <Box
                position="absolute"
                height={24}
                background={
                  colorMode === "light"
                    ? "linear-gradient(0deg, rgba(255,255,255,1) 25%, rgba(255,255,255,0) 100%)"
                    : "linear-gradient(0deg, rgba(41,41,41,1) 25%, rgba(41,41,41,0) 100%)"
                }
                bottom={0}
                left={0}
                right={0}
              >
                &nbsp;
              </Box>
              <Box
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                textAlign="center"
                textDecoration="underline"
                color="blue.800"
                pb={2}
              >
                Read More
              </Box>
            </Box>
          ))}
        </Grid>
      </Content>
    </Page>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = await apiFetch(print(HelpProgramAudiencePathsQuery), {}, {});

  return {
    paths: query.cms.programs?.items
      ?.filter((program: any) => program?.linkedFrom?.faqs?.items?.length > 0)
      .map((program: any) => {
        const audiences =
          program?.linkedFrom?.faqs?.items
            ?.map((faq: any) => faq.audience)
            .reduce((accum: string[], auds: string[]) => [...accum, ...auds], [])
            .reduce(
              (accum: string[], aud: string) => (accum.includes(aud) ? accum : [...accum, aud]),
              [],
            ) || [];

        return audiences.map((aud: string) => ({
          params: { program: program.webname, audience: aud.toLowerCase() },
        }));
      })
      .reduce((accum: any[], elem: any[]) => [...accum, ...elem], []),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const program = params?.program as string;
  const audience = params?.audience as string;
  const audienceName = audience.charAt(0).toUpperCase() + audience.slice(1);
  const query = await apiFetch(
    print(HelpProgramAudienceQuery),
    { programWebname: program, audience: audienceName },
    {},
  );

  return {
    props: {
      query,
      programWebname: program,
      audience: audienceName,
    },
    revalidate: 300,
  };
};
