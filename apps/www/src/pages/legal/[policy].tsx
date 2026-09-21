import { Heading, Skelly } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { Markdown } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { GetStaticProps, GetStaticPaths } from "next";
import { notFound } from "next/navigation";
import React from "react";

import { graphql } from "@/gql";

import Page from "../../components/Page";

const LegalPathsQuery = graphql(`
  query LegalPathsQuery {
    notion {
      pages(parentSlug: "legal") {
        slug
      }
    }
  }
`);

const LegalContentQuery = graphql(`
  query LegalContentQuery($slug: String!, $parentSlug: String!) {
    notion {
      page(slug: $slug, parentSlug: $parentSlug) {
        title
        slug
        content
      }
    }
  }
`);

const TermageddonLegalContentQuery = graphql(`
  query TermageddonLegalContentQuery {
    termageddon {
      terms(locale: "en-US") {
        disclaimer
        tos
        cookies: cookiePolicy
        privacy: privacyPolicy
      }
    }
  }
`);

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
  const { notion } = await apiFetch(LegalPathsQuery, {}, {});
  return {
    paths: [
      ...notion.pages.map((p: any) => ({ params: { policy: p.slug } })),
      ...TERMAGEDDON_POLICIES.map((p) => ({ params: { policy: p } })),
    ],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (TERMAGEDDON_POLICIES.includes(params!.policy as string)) {
    const data = await apiFetch(TermageddonLegalContentQuery, {}, {});
    const terms = data?.termageddon?.terms;
    if (!terms?.[params!.policy as string]) {
      return { notFound: true };
    }

    return {
      props: {
        page: {
          content: terms[params!.policy as string],
          title:
            params!.policy === "tos"
              ? "Terms of Service"
              : (params!.policy as string).charAt(0).toUpperCase() + params!.policy.slice(1),
        },
        slug: params!.policy,
      },
      revalidate: 300,
    };
  } else {
    const data = await apiFetch(
      LegalContentQuery,
      { slug: params!.policy, parentSlug: "legal" },
      {},
    );
    if (!data.notion) {
      return { notFound: true };
    }
    return {
      props: data.notion,
      revalidate: 300,
    };
  }
};
