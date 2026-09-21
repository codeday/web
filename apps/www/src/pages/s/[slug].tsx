import { Box, RatioBox } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { GetServerSideProps } from "next";
import React from "react";

import { graphql } from "@/gql";

import Page from "../../components/Page";

const EmbedBySlugQuery = graphql(`
  query EmbedBySlugQuery($slug: String!) {
    cms {
      embeds(where: { slug: $slug }, limit: 1) {
        items {
          title
          type
          embed
          file {
            url
          }
        }
      }
    }
  }
`);

interface EmbedPageProps {
  slug: string;
  title: string;
  type: string | null;
  embed: string | null;
  file: string | null;
}

function EmbedContent({
  type,
  embed,
  file,
}: {
  type: string | null;
  embed: string | null;
  file: string | null;
}) {
  switch (type) {
    case "figma":
      if (!embed) return null;
      return (
        <Content maxW="container.lg">
          <RatioBox w={16} h={9} auto="h" autoDefault="600">
            <Box
              borderRadius="lg"
              as="iframe"
              {...({
                src: embed,
                allowFullScreen: true,
              } as any)}
              width="100%"
              height="100%"
              border="0"
            />
          </RatioBox>
        </Content>
      );
    case "pdf-portrait":
      if (!file) return null;
      return (
        <Content maxW="container.md">
          <RatioBox w={8.5} h={11} auto="h" autoDefault="800">
            <Box
              borderRadius="lg"
              as="iframe"
              {...({ src: file } as any)}
              width="100%"
              height="100%"
              border="0"
            />
          </RatioBox>
        </Content>
      );
    case "pdf-landscape":
      if (!file) return null;
      return (
        <Content maxW="container.lg">
          <RatioBox w={16} h={10} auto="h" autoDefault="600">
            <Box
              borderRadius="lg"
              as="iframe"
              {...({ src: file } as any)}
              width="100%"
              height="100%"
              border="0"
            />
          </RatioBox>
        </Content>
      );
    default:
      return null;
  }
}

export default function EmbedPage({ slug, title, type, embed, file }: EmbedPageProps) {
  return (
    <Page slug={`/s/${slug}`} title={title}>
      <Content full>
        <EmbedContent type={type} embed={embed} file={file} />
      </Content>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string;
  const resp = await apiFetch(EmbedBySlugQuery, { slug }, {});
  const embed = resp?.cms?.embeds?.items?.[0];

  if (!embed) {
    return { notFound: true };
  }

  return {
    props: {
      slug,
      title: embed.title,
      type: embed.type,
      embed: embed.embed,
      file: embed.file?.url ?? null,
    },
  };
};
