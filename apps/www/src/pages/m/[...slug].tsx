import { Spinner } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { GetStaticProps, GetStaticPaths } from "next";
import React from "react";

import { CalendlyEmbed as Calendly } from "@codeday/topo/Molecule";
import Page from "../../components/Page";

interface CalendlyPageProps {
  slug: string[];
}

export default function CalendlyPage({ slug }: CalendlyPageProps) {
  return (
    <Page slug={`/m/${slug}`} title="Schedule Meeting">
      <Content>
        {!slug ? (
          <Spinner />
        ) : (
          <Calendly mt={-8} slug={slug[0]} meeting={slug.length > 1 ? slug[1] : undefined} />
        )}
      </Content>
    </Page>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string[];
  return {
    props: {
      slug,
    },
    revalidate: 300,
  };
};
