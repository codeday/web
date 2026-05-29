import { Heading, Text } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import * as m from "@codeday/i18n/messages";
import { apiFetch } from "@codeday/topo/utils";
import { print } from "graphql";
import { GetStaticProps } from "next";

import Page from "../components/Page";
import { usePageData } from "@codeday/topo/Theme";
import { DonateQuery } from "./donate.gql";

export default function Donate() {
  const {
    cms: { mission },
  } = usePageData();
  return (
    <Page title="Donate" slug="/donate">
      <Content maxWidth="container.sm">
        <Heading as="h2" fontSize="5xl" mt={-2} mb={8}>
          {m.www_donate_heading()}
        </Heading>
        <Text>
          {m.www_donate_description({ mission: mission?.items?.[0]?.value.toLowerCase() })}
        </Text>
      </Content>
      <Content maxWidth="376px">
        <a href="#XKKVUQAL" style={{ display: "none" }}></a>
      </Content>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      query: await apiFetch(print(DonateQuery), {}, {}),
    },
    revalidate: 300,
  };
};
