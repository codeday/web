import { Heading } from "@codeday/topo/Atom";
import { Content, ContentfulRichText } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { print } from "graphql";
import { GetStaticProps } from "next";
import React from "react";

import Page from "../components/Page";
import { usePageData } from "@codeday/topo/Theme";
import { EcoQuery } from "./eco.gql";

export default function Eco() {
  const { details } = usePageData().cms;

  return (
    <Page title="Ecological Footprint" slug="/eco">
      <Content maxWidth="container.md">
        <Heading as="h2" fontSize="5xl" mt={-2} mb={8}>
          Ecological Footprint
        </Heading>
        <ContentfulRichText json={details?.items[0]?.richValue?.json} />
      </Content>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      query: await apiFetch(print(EcoQuery), {}, {}),
    },
    revalidate: 300,
  };
};
