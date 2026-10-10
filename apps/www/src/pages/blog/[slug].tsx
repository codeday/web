import * as m from "@codeday/i18n/messages";
import { getLocale } from "@codeday/i18n/runtime";
import { Box, Breadcrumb, Card, Eyebrow, GradientText, Image } from "@codeday/topo/Atom";
import { Section } from "@codeday/topo/Molecule";
import { apiFetch } from "@codeday/topo/utils";
import { ResultOf } from "@graphql-typed-document-node/core";
import { GetStaticPaths, GetStaticProps } from "next";
import React from "react";

import ArticleBody, { type BlogAsset } from "@/components/Blog/ArticleBody";
import AuthorAvatar from "@/components/Blog/AuthorAvatar";
import ShareButtons from "@/components/Blog/ShareButtons";
import Page, { DOMAIN } from "@/components/Page";
import { prepareBody } from "@/lib/blog/body";
import { categorySlug } from "@/lib/blog/categories";
import { formatPublishDate, imageUrl } from "@/lib/blog/format";
import { highlightCode } from "@/lib/blog/highlight";
import { normalizeImage, normalizePostSummary } from "@/lib/blog/normalize";
import { BlogPageQuery, BlogPostQuery } from "@/lib/blog/queries";
import { splitHighlight } from "@/lib/blog/title";
import type { BlogImage, BlogPostSummary, RichTextNode } from "@/lib/blog/types";
import { cmsLocale } from "@/utils/cmsLocale";

const READING_WIDTH = "2xl";

interface BlogPost extends BlogPostSummary {
  subhead: string | null;
  heroImage: BlogImage | null;
  heroImageCaption: string | null;
  body: RichTextNode | null;
  assets: Record<string, BlogAsset>;
}

interface BlogPostPageProps {
  query: ResultOf<typeof BlogPageQuery>;
  post: BlogPost;
}

const SOFT_PILL = {
  display: "inline-flex",
  alignItems: "center",
  height: "7",
  paddingInline: "3",
  borderRadius: "full",
  bg: "gray.50",
  boxShadow: "inset 0 0 0 1px {colors.current.border}",
  color: "hibiscus.800",
  fontSize: "xs",
  fontWeight: "500",
  textDecoration: "none",
  _hover: { bg: "gray.100" },
} as const;

export default function BlogPostPage({ query, post }: BlogPostPageProps) {
  const locale = getLocale();
  const url = `${DOMAIN}/blog/${post.slug}`;
  const titleParts = splitHighlight(post.title, post.titleHighlight);
  const cover = post.heroImage ?? post.previewImage;
  const slug = categorySlug(post.category);

  return (
    <Page
      data={query}
      title={post.title}
      description={post.previewText}
      image={post.previewImage ? imageUrl(post.previewImage.url, 1200, "jpg") : undefined}
      slug={`/blog/${post.slug}`}
      logoHeadingLevel="span"
    >
      <Section ramp="hibiscus" spacing="compact" paddingTop="0">
        <Box as="article">
          <Box as="header" maxWidth={READING_WIDTH} marginInline="auto">
            <Breadcrumb.Root aria-label={m.www_blog_breadcrumb_label()}>
              <Breadcrumb.List fontFamily="mono" fontSize="sm" gap="2">
                <Breadcrumb.Item>
                  <Breadcrumb.Link asChild color="current.textLight">
                    <Box as="a" {...({ href: "/blog" } as any)}>
                      blog
                    </Box>
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator color="current.textLight">/</Breadcrumb.Separator>
                <Breadcrumb.Item>
                  <Breadcrumb.Link asChild color="current.textLight">
                    <Box as="a" {...({ href: `/blog?category=${slug}` } as any)}>
                      {slug}
                    </Box>
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb.Root>

            <Box
              as="h1"
              marginTop="8"
              fontSize="clamp({fontSizes.3xl}, 5vw, {fontSizes.5xl})"
              fontWeight="800"
              lineHeight="1.05"
              letterSpacing="tight"
              css={{ textWrap: "balance" }}
            >
              {titleParts ? (
                <>
                  {titleParts[0]}
                  <GradientText ramp="hibiscus">{titleParts[1]}</GradientText>
                  {titleParts[2]}
                </>
              ) : (
                post.title
              )}
            </Box>
            {(post.subhead || post.previewText) && (
              <Box
                as="p"
                marginTop="5"
                fontSize={{ base: "lg", md: "xl" }}
                lineHeight="moderate"
                color="current.textLight"
              >
                {post.subhead || post.previewText}
              </Box>
            )}

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap="4"
              marginTop="8"
              paddingBlock="4"
              borderBlockWidth="1px"
              borderColor="current.border"
            >
              <Box display="flex" alignItems="center" gap="3" minWidth="0">
                <AuthorAvatar author={post.author} size="md" />
                <Box minWidth="0">
                  <Box fontSize="sm">
                    <Box as="span" fontWeight="700">
                      {post.author.name}
                    </Box>
                    {post.author.title && (
                      <Box as="span" color="current.textLight">
                        , {post.author.title}
                      </Box>
                    )}
                  </Box>
                  <Box fontSize="xs" color="current.textLight">
                    <Box as="time" {...({ dateTime: post.publishDate } as any)}>
                      {formatPublishDate(post.publishDate, locale)}
                    </Box>{" "}
                    · {m.www_blog_reading_time({ minutes: post.readingMinutes })}
                  </Box>
                </Box>
              </Box>
              <ShareButtons url={url} title={post.title} />
            </Box>
          </Box>

          {cover && (
            <Box as="figure" maxWidth="container.lg" marginInline="auto" marginTop="10">
              <Image
                src={imageUrl(cover.url, 2000)}
                alt={cover.alt}
                htmlWidth={cover.width ?? undefined}
                htmlHeight={cover.height ?? undefined}
                width="full"
                height="auto"
                borderRadius="3xl"
              />
              {post.heroImageCaption && (
                <Box as="figcaption" marginTop="3" fontSize="sm" color="current.textLight">
                  {post.heroImageCaption}
                </Box>
              )}
            </Box>
          )}

          <Box maxWidth={READING_WIDTH} marginInline="auto" marginTop="10" minWidth="0">
            {post.body && <ArticleBody body={post.body} assets={post.assets} />}

            {post.tags.length > 0 && (
              <Box
                as="ul"
                aria-label={m.www_blog_tags_label()}
                listStyleType="none"
                display="flex"
                flexWrap="wrap"
                gap="2"
                marginTop="10"
              >
                {post.tags.map((tag) => (
                  <Box as="li" key={tag}>
                    <Box
                      as="a"
                      {...({ href: `/blog?q=${encodeURIComponent(tag)}` } as any)}
                      {...SOFT_PILL}
                    >
                      {tag}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}

            <Card
              variant="plain"
              display="flex"
              flexDirection="row"
              alignItems="flex-start"
              gap="5"
              marginTop="12"
              padding={{ base: "5", md: "6" }}
              borderRadius="2xl"
              backgroundImage="linear-gradient(160deg, {colors.hibiscus.50} 0%, {colors.current.background} 100%)"
            >
              <AuthorAvatar author={post.author} size="xl" />
              <Box minWidth="0">
                <Eyebrow color="hibiscus.600">{m.www_blog_written_by()}</Eyebrow>
                <Box marginTop="1" fontWeight="700" fontSize="lg">
                  {post.author.name}
                </Box>
                {post.author.bio && (
                  <Box marginTop="2" fontSize="sm" lineHeight="moderate" color="current.textLight">
                    {post.author.bio}
                  </Box>
                )}
              </Box>
            </Card>
          </Box>
        </Box>
      </Section>
    </Page>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const cmsLocaleCode = cmsLocale(locale);
  const [query, result]: [ResultOf<typeof BlogPageQuery>, ResultOf<typeof BlogPostQuery>] =
    await Promise.all([
      apiFetch(BlogPageQuery, { locale: cmsLocaleCode }, {}),
      apiFetch(BlogPostQuery, { locale: cmsLocaleCode, slug: params?.slug }, {}),
    ]);

  const item = result.cms?.blogPosts?.items?.[0];
  const summary = item ? normalizePostSummary(item) : null;
  if (!item || !summary) return { notFound: true, revalidate: 60 };

  const assets: Record<string, BlogAsset> = {};
  for (const asset of item.body?.links?.assets?.block ?? []) {
    const image = normalizeImage(asset);
    if (asset && image) assets[asset.sys.id] = { ...image, contentType: asset.contentType ?? null };
  }

  const post: BlogPost = {
    ...summary,
    subhead: item.subhead ?? null,
    heroImage: normalizeImage(item.heroImage),
    heroImageCaption: item.heroImageCaption ?? null,
    body: prepareBody(item.body?.json as RichTextNode | undefined, highlightCode),
    assets,
  };

  return {
    props: { query, post },
    revalidate: 300,
  };
};
