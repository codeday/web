import * as m from "@codeday/i18n/messages";
import { Text, Link, Heading, Skelly, Spinner, Box, List, ListItem } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { ResultOf } from "@graphql-typed-document-node/core";
import { DateTime } from "luxon";
import { GetStaticProps } from "next";

import { graphql } from "@/gql";
import { useFragment } from "@/gql/fragment-masking";

import Page from "../components/Page";
import Error404 from "./404";

export const DataFragment = graphql(`
  fragment DataComponent on Query {
    cms {
      publications(where: { type: "dataset" }) {
        items {
          title
          doiSuffix
          publicationDate
          contributors {
            name
          }
        }
      }
    }
  }
`);

const DataListPublicationsQuery = graphql(`
  query DataListPublicationsQuery {
    ...DataComponent
  }
`);

interface HomeProps {
  query: ResultOf<typeof DataListPublicationsQuery>;
}

export default function Home({ query }: HomeProps) {
  const { cms } = useFragment(DataFragment, query);

  if (!cms) {
    return (
      <Page slug={`/data`}>
        <Content>
          <Skelly h={12} mb={4} />
          <Spinner />
        </Content>
      </Page>
    );
  }

  if (cms?.publications?.items.length < 1) {
    return <Error404 />;
  }

  return (
    <Page slug={`/data`} title="Open Datasets">
      <Content mt={-8} mb={2}>
        <Heading as="h2" fontSize={{ base: "2xl", md: "4xl" }} mb={2}>
          {m.www_data_heading()}
        </Heading>
        <Box mb={4}>
          <Link
            fontSize="sm"
            {...({
              href: `https://doi.org/${process.env.NEXT_PUBLIC_DOI_PREFIX}/${process.env.NEXT_PUBLIC_DATABASE_DOI}`,
            } as any)}
          >
            https://doi.org/{process.env.NEXT_PUBLIC_DOI_PREFIX}/
            {process.env.NEXT_PUBLIC_DATABASE_DOI}
          </Link>
        </Box>
        <List listStyleType="disc" pl={4}>
          {cms.publications.items.map((p: any) => (
            <ListItem key={p.doiSuffix}>
              <Box
                as="a"
                {...({ href: `/doi/${process.env.NEXT_PUBLIC_DOI_PREFIX}/${p.doiSuffix}` } as any)}
              >
                <Link as="span">{p.title}</Link>
                <Text fontSize="sm">
                  {p.contributors.length > 0 ? (
                    <>{p.contributors.map((c: any) => c.name).join("; ")}, </>
                  ) : null}
                  {DateTime.fromISO(p.publicationDate).toFormat("MMMM dd, yyyy")}
                </Text>
              </Box>
            </ListItem>
          ))}
        </List>
      </Content>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      query: await apiFetch(DataListPublicationsQuery, {}, {}),
    },
    revalidate: 300,
  };
};
