import { Heading, Skelly } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { print } from "graphql";
import { GetStaticProps, GetStaticPaths } from "next";
import React from "react";

import { Markdown } from "@codeday/topo/Molecule";
import Page from "../../components/Page";
import { usePageData } from "@codeday/topo/Theme";
import { LegalPathsQuery, LegalContentQuery, TermageddonLegalContentQuery } from "./policy.gql";
import { notFound } from "next/navigation";

interface PolicyProps {
  slug: string;
  page: { title: string; content: string } | undefined;
}

export default function Policy({ slug, page }: PolicyProps) {
  return (
    <Page title={page.title} slug={`/legal/${slug}`}>
      <Content>
        <Heading as="h2" fontSize="5xl" mt={-2} mb={8} lineHeight="1.6">
          {page.title}
        </Heading>
        <Markdown baseHeadingLevel={3} allowHtml>
          {page.content}
        </Markdown>
      </Content>
    </Page>
  );
}

const TERMAGEDDON_POLICIES = ["tos", "privacy", "cookies", "disclaimer"];
export const getStaticPaths: GetStaticPaths = async () => {
  const { notion } = await apiFetch(print(LegalPathsQuery), {}, {});
  return {
    paths: [
      ...notion.pages.map((p: any) => ({ params: { policy: p.slug } })),
      ...TERMAGEDDON_POLICIES.map((p) => ({ params: { policy: p } })),
    ],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (TERMAGEDDON_POLICIES.includes(params!.policy as string)) {
    const data = await apiFetch(print(TermageddonLegalContentQuery), {}, {});
    const terms = data?.termageddon?.terms;
    if (!terms?.[params!.policy as string]) {
      return { notFound: true };
    }

    return {
      props: {
        page: {
          content: terms[params!.policy as string],
          title: params!.policy === "tos" ? "Terms of Service" : (params!.policy as string).charAt(0).toUpperCase() + params!.policy.slice(1),
        },
        slug: params!.policy,
      },
      revalidate: 300,
    };

  } else {
    const data = await apiFetch(
      print(LegalContentQuery),
      { slug: params!.policy, parentSlug: "legal" },
      {},
    )
    if (!data.notion) {
      return { notFound: true };
    }
    return {
      props: data.notion,
      revalidate: 300,
    };
  }
};
