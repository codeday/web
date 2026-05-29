import { Text, Heading, Link, Image, Box } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import * as m from "@codeday/i18n/messages";
import { apiFetch } from "@codeday/topo/utils";
import { print } from "graphql";
import { GetStaticProps } from "next";
import React from "react";

import Page from "../components/Page";
import { Error404Query } from "./404.gql";

export default function Home() {
  return (
    <Page title="404 File Not Found">
      <Content>
        <Image
          alt=""
          src="https://img.codeday.org/w=1024;h=300;fit=crop;crop=faces,edges/6/t/6ttx5an4wbxypvf324er646d48ri8py88fjwbdwp5cxay8tfwo9nnmdwq9vpbseffz.jpg"
        />
        <Text as="h2" fontSize="5xl" fontWeight="bold" mt={4}>
          {m.www_404_oh_no()}
        </Text>
        <Heading as="h2" fontSize="4xl" fontWeight="normal">
          {m.www_404_not_found()}
        </Heading>
        <Box mt={4} mb={16}>
          <Text>
            {m.www_404_contact_prompt()}{" "}
            <Link href="mailto:team@codeday.org">{m.www_404_contact_link()}</Link>
          </Text>
        </Box>
      </Content>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      query: await apiFetch(print(Error404Query), {}, {}),
    },
    revalidate: 300,
  };
};
