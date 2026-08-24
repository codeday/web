import * as m from "@codeday/i18n/messages";
import { Box, Grid, Heading, Image, Link, Text } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { usePageData } from "@codeday/topo/Theme";
import { apiFetch } from "@codeday/topo/utils";
import { print } from "graphql";
import { GetStaticProps } from "next";

import EmploymentChart from "../components/Donate/EmploymentChart";
import PrestigeGapChart from "../components/Donate/PrestigeGapChart";
import StoryList from "../components/Donate/StoryList";
import Page from "../components/Page";
import { DonateQuery } from "./donate.gql";

function DonateBox(props: any) {
  return (
    <Grid templateColumns={{ base: "1fr", sm: "2fr 1fr" }} gap={6} alignItems="center" {...props}>
      <Box>
        <a href="#XKKVUQAL" style={{ display: "none" }}></a>
      </Box>

      <Box>
        <Grid templateColumns="repeat(2, 1fr)" gap={2} maxW="200px" mb={3}>
          <Link
            href="https://www.guidestar.org/profile/shared/88ca3b85-4294-40a3-a922-415c75f0b9e5"
            target="_blank"
          >
            <Image src="https://widgets.guidestar.org/TransparencySeal/8867365" maxHeight={32} />
          </Link>
          <Link href="https://www.charitynavigator.org/ein/264742589" target="_blank">
            <Image src="/charity-navigator.png" maxHeight={32} />
          </Link>
        </Grid>
        <Text fontSize="xs" color="current.textLight" maxW="200px">
          {m.www_donate_disclaimer()}
        </Text>
      </Box>
    </Grid>
  );
}

export default function Donate() {
  const {
    cms: { mission },
  } = usePageData();

  return (
    <Page title="Donate" slug="/donate" minimal>
      <Content mt={-8} maxWidth="container.sm">
        <Heading as="h2" fontSize="5xl" mt={-2} mb={8} lineHeight="1">
          {m.www_donate_form_heading()}
        </Heading>
        <Text mb={4}>
          {m.www_donate_form_description({ mission: mission?.items?.[0]?.value.toLowerCase() })}
        </Text>

        <DonateBox mb={12} />

        <Heading as="h3" fontSize="4xl" mb={4} lineHeight="1.1">
          {m.www_donate_heading()}
        </Heading>

        <EmploymentChart mb={8} />
        <PrestigeGapChart mb={8} />

        <Text fontSize="lg" mb={4}>
          {m.www_donate_description()}{" "}
          <Text as="span" fontWeight="bold">
            {m.www_donate_impact_students()}
          </Text>
        </Text>

        <DonateBox />

        <Text mb={12} fontSize="xl" p={2} bg="yellow">
          {m.www_donate_impact_line()}
        </Text>

        <Heading as="h2" fontSize="4xl" mb={4} lineHeight="1">
          {m.www_donate_stories_heading()}
        </Heading>

        <Text mb={4} fontSize="xl">
          {m.www_donate_stories_description()}
        </Text>

        <StoryList />
 
        <DonateBox />
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
