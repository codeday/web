import { Grid, Image, Text, Heading } from "@codeday/topo/Atom";
import {
  Content,
  IconBox,
  IconBoxIcon as HeaderIcon,
  IconBoxText as HeaderText,
  IconBoxBody as BoxBody,
} from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { print } from "graphql";
import { GetStaticProps } from "next";
import React from "react";

import Page from "../../components/Page";
import { usePageData } from "@codeday/topo/Theme";
import { HelpIndexQuery } from "./index.gql";

export default function Help() {
  const { programs } = usePageData().cms || {};
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
  const query = await apiFetch(print(HelpIndexQuery), {}, {});

  return {
    props: {
      query,
    },
    revalidate: 300,
  };
};
