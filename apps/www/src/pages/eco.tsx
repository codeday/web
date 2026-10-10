import * as m from "@codeday/i18n/messages";
import { Heading } from "@codeday/topo/Atom";
import { Content, ContentfulRichText } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { ResultOf } from "@graphql-typed-document-node/core";
import { GetStaticProps } from "next";
import React from "react";

import Page from "@/components/Page";
import { graphql } from "@/gql";
import { useFragment } from "@/gql/fragment-masking";
import { cmsLocale } from "@/utils/cmsLocale";

export const EcoFragment = graphql(`
  fragment EcoComponent on Query {
    cms {
      details: strings(where: { key: "eco.details" }, limit: 1, locale: $locale) {
        items {
          richValue {
            json
          }
        }
      }
    }
  }
`);

const EcoQuery = graphql(`
  query EcoQuery($locale: String!) {
    ...EcoComponent
  }
`);

interface EcoProps {
  query: ResultOf<typeof EcoQuery>;
}

export default function Eco({ query }: EcoProps) {
  const { details } = useFragment(EcoFragment, query).cms;

  return (
    <Page title="Ecological Footprint" slug="/eco">
      <Content maxWidth="container.md">
        <Heading as="h2" fontSize="5xl" mt={-2} mb={8}>
          {m.www_eco_heading()}
        </Heading>
        <ContentfulRichText json={details?.items[0]?.richValue?.json} />
      </Content>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      query: await apiFetch(EcoQuery, { locale: cmsLocale(locale) }, {}),
    },
    revalidate: 300,
  };
};
