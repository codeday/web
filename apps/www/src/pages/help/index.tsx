import { Grid, Image, Text, Heading } from "@codeday/topo/Atom";
import {
  Content,
  IconBox,
  IconBoxIcon as HeaderIcon,
  IconBoxText as HeaderText,
  IconBoxBody as BoxBody,
} from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { ResultOf } from "@graphql-typed-document-node/core";
import { GetStaticProps } from "next";
import React from "react";

import { graphql } from "@/gql";
import { useFragment } from "@/gql/fragment-masking";

import Page from "../../components/Page";

export const HelpIndexFragment = graphql(`
  fragment HelpIndexComponent on Query {
    cms {
      programs(where: { archived_not: true }) {
        items {
          name
          webname
          shortDescription
          logo {
            url(transform: { width: 300, height: 100 })
          }
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

const HelpIndexQuery = graphql(`
  query HelpIndexQuery {
    ...HelpIndexComponent
  }
`);

interface HelpProps {
  query: ResultOf<typeof HelpIndexQuery>;
}

export default function Help({ query }: HelpProps) {
  const { programs } = useFragment(HelpIndexFragment, query).cms || {};
  const programsWithFaqs =
    programs?.items?.filter((p: any) => p.linkedFrom?.faqs?.items?.length > 0) || [];

  return (
    <Page slug="/help" title="Help">
      <Content mt={-8}>
        <Heading as="h2" fontSize="5xl">
          Helpdesk
        </Heading>
        <Text mb={8}>Choose which program you&apos;d like help with:</Text>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "repeat(3, 1fr)" }} gap={8}>
          {programsWithFaqs.map((program: any) => (
            <IconBox
              as="a"
              key={program.webname}
              {...({ href: `/help/${program.webname}` } as any)}
            >
              <HeaderIcon>
                <Image src={program.logo.url} h={12} alt="" />
              </HeaderIcon>
              <HeaderText>{program.name}</HeaderText>
              <BoxBody>{program.shortDescription}</BoxBody>
            </IconBox>
          ))}
        </Grid>
      </Content>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const query = await apiFetch(HelpIndexQuery, {}, {});

  return {
    props: {
      query,
    },
    revalidate: 300,
  };
};
