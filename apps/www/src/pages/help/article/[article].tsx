import { Text, Heading, Link, Box, List, ListItem } from "@codeday/topo/Atom";
import { Content, ContentfulRichText } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { UiArrowRight } from "@codeday/topocons";
import { print } from "graphql";
import { DateTime } from "luxon";
import { GetStaticProps, GetStaticPaths } from "next";
import React from "react";

import Page from "../../../components/Page";
import { HelpArticleQuery, HelpArticlePathsQuery } from "./article.gql";

interface ArticleProps {
  faq: any;
}

export default function Article({ faq }: ArticleProps) {
  if (!faq) return <></>;

  return (
    <Page slug={`/help/article/${faq.sys.id}`} title={`${faq.title} ~ Help`}>
      <Content mt={-8} maxWidth="xl">
        <Heading as="h2" fontSize="5xl" mb={1} mt={1}>
          {faq.title}
        </Heading>
        <Text color="current.textLight" mb={0}>
          Last updated {DateTime.fromISO(faq.sys.publishedAt).toLocaleString(DateTime.DATETIME_MED)}
        </Text>
        <Text color="current.textLight" mb={8}>
          Applies to <Link href={`/help/${faq.program.webname}`}>{faq.program.name}</Link>
          <UiArrowRight />
          {faq.audience.map((aud: string, i: number) => (
            <React.Fragment key={aud}>
              <Link href={`/help/${faq.program.webname}/${aud.toLowerCase()}`}>{aud}s</Link>
              {i !== faq.audience.length - 1 && ","}{" "}
            </React.Fragment>
          ))}
        </Text>

        <ContentfulRichText json={faq.answer.json} links={faq.answer.links} />
        {faq?.relatedAnswers?.items?.length > 0 && (
          <Box p={4} borderWidth={1} rounded="sm">
            <Heading as="h3" fontSize="xl" mb={2}>
              Related Answers
            </Heading>
            <List listStyleType="disc">
              {faq?.relatedAnswers.items.map((related: any) => (
                <ListItem key={related.sys.id}>
                  <Link href={`/help/article/${related.sys.id}`}>{related.title}</Link>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Content>
    </Page>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const {
    cms: { faqs },
  } = await apiFetch(print(HelpArticlePathsQuery), {}, {});
  return {
    paths: faqs?.items?.map((faq: any) => ({ params: { article: faq.sys.id } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const article = params?.article as string;
  const {
    cms: { faq },
  } = await apiFetch(print(HelpArticleQuery), { article }, {});
  return {
    props: {
      faq,
    },
    revalidate: 300,
  };
};
