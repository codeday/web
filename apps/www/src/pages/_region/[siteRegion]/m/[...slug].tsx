import { Spinner } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { CalendlyEmbed as Calendly } from "@codeday/topo/Molecule";
import React from "react";

import Page from "@/components/Page";
import { withRegionStaticPaths, withRegionStaticProps } from "@/utils/region";

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

export const getStaticPaths = withRegionStaticPaths(async () => {
  return {
    paths: [],
    fallback: true,
  };
});

export const getStaticProps = withRegionStaticProps(async ({ params }) => {
  const slug = params?.slug as string[];
  return {
    props: {
      slug,
    },
    revalidate: 300,
  };
});
