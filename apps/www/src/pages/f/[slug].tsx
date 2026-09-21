import { Heading, Image, Skelly, Spinner, Box, Grid } from "@codeday/topo/Atom";
import { Content, CognitoForm, ContentfulRichText } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { ResultOf } from "@graphql-typed-document-node/core";
import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import React from "react";

import { graphql } from "@/gql";
import { useFragment } from "@/gql/fragment-masking";

import Page from "../../components/Page";
import Error404 from "../404";

const ListFormsQuery = graphql(`
  query ListFormsQuery {
    cms {
      forms {
        items {
          slug
        }
      }
    }
  }
`);

export const FormFragment = graphql(`
  fragment FormComponent on Query {
    cms {
      forms(where: { slug: $slug }, limit: 1) {
        items {
          title
          cognitoForm
          slug
          prefill
          image {
            url(transform: { width: 1000, height: 300, resizeStrategy: CROP })
          }
          details {
            json
            links {
              assets {
                block {
                  sys {
                    id
                  }
                  contentType
                  url
                }
              }
            }
          }
          sidebar {
            json
            links {
              assets {
                block {
                  sys {
                    id
                  }
                  contentType
                  url
                }
              }
            }
          }
        }
      }
    }
  }
`);

const FormQuery = graphql(`
  query FormQuery($slug: String) {
    ...FormComponent
  }
`);

interface HomeProps {
  pageQuery: ResultOf<typeof FormQuery>;
}

export default function Home({ pageQuery }: HomeProps) {
  const { cms } = useFragment(FormFragment, pageQuery) || {};
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
              <Box bg="blue.100" color="blue.900" borderColor="blue.600" borderWidth={1} p={4}>
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
  const listQuery = await apiFetch(ListFormsQuery, {}, {});

  return {
    paths:
      listQuery?.cms?.forms?.items?.map((i: any) => ({
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
      pageQuery: await apiFetch(FormQuery, { slug }, {}),
    },
    revalidate: 300,
  };
};
