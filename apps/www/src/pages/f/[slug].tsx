import { Heading, Image, Skelly, Spinner, Box, Grid } from "@codeday/topo/Atom";
import { Content, CognitoForm } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { print } from "graphql";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import React from "react";

import ContentfulRichText from "../../components/ContentfulRichText";
import Page from "../../components/Page";
import { usePageData } from "@codeday/topo/Theme";
import Error404 from "../404";
import { FormQuery, ListFormsQuery } from "./form.gql";

export default function Home() {
  const { cms } = usePageData();
  const { query } = useRouter();

  if (!cms) {
    return (
      <Page slug={`/f/${query.slug}`}>
        <Content>
          <Skelly h={12} mb={4} />
          <Spinner />
        </Content>
      </Page>
    );
  }

  if (cms?.forms?.items.length < 1) {
    return <Error404 />;
  }

  const { image, title, cognitoForm, details, sidebar, prefill: cmsPrefill } = cms.forms.items[0];

  return (
    <Page slug={`/f/${query.slug}`} title={title}>
      <Content>
        {image && <Image src={image.url} alt="" mb={4} mt={-4} rounded="md" />}
        <Heading as="h2" fontSize="4xl" mb={8}>
          {title}
        </Heading>
        <Grid
          templateColumns={sidebar ? { base: "1fr", md: "3fr 2fr", lg: "2fr 1fr" } : "1fr"}
          gap={8}
        >
          <Box>
            {details && <ContentfulRichText json={details?.json ?? {}} links={details.links} />}
            {/* TODO(@oohwooh) make this better - leftover stuff in `query` might contaminate the prefill with things we don't want,
            plus `query` is deprecated now in nextjs. Maybe cms should provide allowlist of what fields can be prefilled?
            */}
            <CognitoForm formId={cognitoForm} prefill={{ ...query, ...cmsPrefill }} fallback />
          </Box>
          {sidebar && (
            <Box>
              <Box bg="blue.50" color="blue.900" borderColor="blue.600" borderWidth={1} p={4}>
                <ContentfulRichText json={sidebar?.json ?? {}} links={sidebar.links} h1Size="2xl" />
              </Box>
            </Box>
          )}
        </Grid>
      </Content>
    </Page>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = await apiFetch(print(ListFormsQuery), {}, {});

  return {
    paths:
      query?.cms?.forms?.items?.map((i: any) => ({
        params: {
          slug: i.slug,
        },
      })) || [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  return {
    props: {
      query: await apiFetch(print(FormQuery), { slug }, {}),
    },
    revalidate: 300,
  };
};
