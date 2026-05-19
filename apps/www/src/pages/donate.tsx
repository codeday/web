import { Heading, Text } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
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
          Make a Donation to CodeDay
        </Heading>
        <Text>
          Your donation will advance our mission of {mission?.items?.[0]?.value.toLowerCase()} As a
          501(c)(3) non-profit, donations from US individuals and companies are tax-deductible.
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
