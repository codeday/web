import * as m from "@codeday/i18n/messages";
import { getLocale } from "@codeday/i18n/runtime";
import { Box, Button, Card, Eyebrow, Image } from "@codeday/topo/Atom";
import { ActionLink, Content, Section } from "@codeday/topo/Molecule";
import { MailingListSubscribe } from "@codeday/topo/Organism";
import { apiFetch } from "@codeday/topo/utils";
import { ResultOf } from "@graphql-typed-document-node/core";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import AuthorAvatar from "@/components/Blog/AuthorAvatar";
import PostCard from "@/components/Blog/PostCard";
import Toolbar from "@/components/Blog/Toolbar";
import Page from "@/components/Page";
import { categoryLabel, findCategory } from "@/lib/blog/categories";
import { fetchFeaturedPost, fetchPostPage } from "@/lib/blog/fetch";
import { formatPublishDate, imageUrl } from "@/lib/blog/format";
import { BlogPageQuery } from "@/lib/blog/queries";
import type { BlogPostSummary } from "@/lib/blog/types";
import {
  type PostPages,
  type PostPagesQuery,
  postPagesKey,
  usePostPages,
} from "@/lib/blog/usePostPages";
import { cmsLocale } from "@/utils/cmsLocale";

const SEARCH_DEBOUNCE_MS = 250;
const NEWSLETTER_LIST: string | null = null;

const SOFT_CARD = {
  borderRadius: "2xl",
  borderWidth: "1px",
  borderColor: "current.border",
  backgroundImage:
    "linear-gradient(160deg, {colors.hibiscus.50} 0%, {colors.current.background} 100%)",
} as const;

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debounced;
}

function queryParam(value: string | string[] | undefined): string | null {
  return (Array.isArray(value) ? value[0] : value) || null;
}

interface BlogIndexProps {
  query: ResultOf<typeof BlogPageQuery>;
  featured: BlogPostSummary | null;
  initialPage: PostPages;
}

export default function BlogIndex({ query, featured, initialPage }: BlogIndexProps) {
  const router = useRouter();
  const locale = getLocale();
  const category = findCategory(queryParam(router.query.category)) ?? null;

  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS).trim();
  const searchParam = queryParam(router.query.q);
  useEffect(() => {
    if (searchParam) setSearchInput(searchParam);
  }, [searchParam]);

  const setCategory = (slug: string | null) => {
    const { category: _category, ...rest } = router.query;
    void router.replace(
      { pathname: router.pathname, query: slug ? { ...rest, category: slug } : rest },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  const showFeatured = !!featured && !search && (!category || featured.category === category.value);
  const pages = usePostPages(
    initialPage,
    {
      category: category?.slug ?? null,
      search,
      excludeSlug: showFeatured ? featured.slug : null,
    },
    locale,
  );

  return (
    <Page data={query} title={m.www_blog_title()} slug="/blog" logoHeadingLevel="span">
      <Section ramp="hibiscus" spacing="compact" paddingTop="0">
        <Content maxW="container.lg" marginBottom="0">
          <Eyebrow as="h1" color="hibiscus.600" display="block" fontSize="xs" marginBottom="5">
            {m.www_blog_title()}
          </Eyebrow>

          <Toolbar
            category={category?.slug ?? null}
            onCategoryChange={setCategory}
            search={searchInput}
            onSearchChange={setSearchInput}
          />

          {showFeatured && (
            <Box
              as="a"
              {...({ href: `/blog/${featured.slug}` } as any)}
              className="group"
              colorPalette="chilioil"
              display="grid"
              gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
              marginTop="8"
              borderRadius="3xl"
              overflow="hidden"
              color="trueWhite"
              textDecoration="none"
              backgroundImage="radial-gradient(125% 135% at 20% 12%, {colors.colorPalette.gradient.critical})"
              transitionProperty="transform"
              transitionDuration="moderate"
              _hover={{ transform: "translateY(calc({spacing.1} * -1))" }}
              focusVisibleRing="outside"
              focusRingColor="hibiscus.600"
            >
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                padding={{ base: "6", md: "10" }}
                minWidth="0"
              >
                <Eyebrow color="hibiscus.true.400">
                  {m.www_blog_featured_eyebrow({ category: categoryLabel(featured.category) })}
                </Eyebrow>
                <Box
                  as="h2"
                  marginTop="3"
                  fontSize="clamp({fontSizes.2xl}, 3.2vw, {fontSizes.4xl})"
                  fontWeight="700"
                  lineHeight="shorter"
                  letterSpacing="tight"
                  _groupHover={{ textDecoration: "underline" }}
                >
                  {featured.title}
                </Box>
                <Box marginTop="3" fontSize={{ base: "md", md: "lg" }} color="whiteAlpha.900">
                  {featured.previewText}
                </Box>
                <Box display="flex" alignItems="center" gap="3" marginTop="6">
                  <AuthorAvatar
                    author={featured.author}
                    size="md"
                    boxShadow="0 0 0 2px {colors.whiteAlpha.400}"
                  />
                  <Box minWidth="0">
                    <Box fontWeight="700" fontSize="sm">
                      {featured.author.name}
                    </Box>
                    <Box fontSize="xs" color="whiteAlpha.800">
                      {formatPublishDate(featured.publishDate, locale)} ·{" "}
                      {m.www_blog_reading_time({ minutes: featured.readingMinutes })}
                    </Box>
                  </Box>
                </Box>
                <ActionLink
                  as="span"
                  label={m.www_blog_read_post()}
                  marginTop="6"
                  color="trueWhite"
                />
              </Box>
              {featured.previewImage && (
                <Box order={{ base: -1, md: 0 }} padding="3" paddingBottom={{ base: "0", md: "3" }}>
                  <Image
                    src={imageUrl(featured.previewImage.url, 1200)}
                    alt={featured.previewImage.alt}
                    width="full"
                    height="full"
                    minHeight={{ md: "72" }}
                    aspectRatio={{ base: "16/9", md: "auto" }}
                    objectFit="cover"
                    borderRadius="2xl"
                  />
                </Box>
              )}
            </Box>
          )}

          <Box
            aria-busy={pages.loading}
            opacity={pages.current ? 1 : 0.5}
            transitionProperty="opacity"
            transitionDuration="moderate"
          >
            {(pages.total > 0 || !showFeatured) && (
              <Box
                display="flex"
                alignItems="baseline"
                justifyContent="space-between"
                gap="4"
                marginTop="12"
                marginBottom="6"
              >
                <Box
                  as="h2"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="700"
                  lineHeight="shorter"
                  letterSpacing="tight"
                >
                  {category ? category.label() : m.www_blog_latest_heading()}
                </Box>
                <Box
                  fontFamily="mono"
                  fontSize="sm"
                  color="current.textLight"
                  whiteSpace="nowrap"
                  aria-live="polite"
                >
                  {pages.total === 1
                    ? m.www_blog_post_count_one({ count: pages.total })
                    : m.www_blog_post_count({ count: pages.total })}
                </Box>
              </Box>
            )}

            {pages.posts.length > 0 && (
              <Box
                as="ul"
                listStyleType="none"
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(min(100%, {sizes.72}), 1fr))"
                gap="6"
              >
                {pages.posts.map((post) => (
                  <Box as="li" key={post.slug}>
                    <PostCard post={post} />
                  </Box>
                ))}
              </Box>
            )}

            {pages.current && pages.total === 0 && !showFeatured && (
              <Box
                borderWidth="1px"
                borderStyle="dashed"
                borderColor="gray.400"
                borderRadius="2xl"
                bg="gray.50"
                paddingBlock="12"
                paddingInline="6"
                textAlign="center"
              >
                <Box fontFamily="mono" fontSize="md" color="hibiscus.800">
                  {m.www_blog_empty_code()}
                </Box>
                <Box marginTop="2" fontSize="sm" color="current.textLight">
                  {search ? m.www_blog_empty_search() : m.www_blog_empty_category()}
                </Box>
              </Box>
            )}
          </Box>

          {pages.error ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="3"
              marginTop="10"
              role="alert"
            >
              <Box fontSize="sm" color="current.textLight">
                {m.www_blog_load_error()}
              </Box>
              <Button variant="secondary" colorPalette="hibiscus" onClick={pages.retry}>
                {m.www_blog_retry()}
              </Button>
            </Box>
          ) : (
            pages.hasMore && (
              <Box display="flex" justifyContent="center" marginTop="10">
                <Button
                  variant="secondary"
                  colorPalette="hibiscus"
                  loading={pages.loading}
                  onClick={pages.loadMore}
                >
                  {m.www_blog_load_more()}
                </Button>
              </Box>
            )
          )}

          {NEWSLETTER_LIST && (
            <Card
              variant="plain"
              {...SOFT_CARD}
              display="grid"
              gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
              alignItems="center"
              gap={{ base: "6", md: "10" }}
              marginTop="16"
              padding={{ base: "6", md: "10" }}
            >
              <Box>
                <Eyebrow color="hibiscus.600">{m.www_blog_newsletter_eyebrow()}</Eyebrow>
                <Box
                  as="h2"
                  marginTop="2"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  fontWeight="700"
                  lineHeight="shorter"
                  letterSpacing="tight"
                >
                  {m.www_blog_newsletter_heading()}
                </Box>
                <Box marginTop="2" fontSize="md" color="current.textLight">
                  {m.www_blog_newsletter_body()}
                </Box>
              </Box>
              <MailingListSubscribe
                emailList={NEWSLETTER_LIST}
                label={m.www_blog_newsletter_email_label()}
                placeholder={m.www_blog_newsletter_placeholder()}
                inputType="email"
                variant="primary"
                colorPalette="hibiscus"
              />
            </Card>
          )}
        </Content>
      </Section>
    </Page>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const cmsLocaleCode = cmsLocale(locale);
  const [query, featured] = await Promise.all([
    apiFetch(BlogPageQuery, { locale: cmsLocaleCode }, {}),
    fetchFeaturedPost(cmsLocaleCode),
  ]);
  const pageQuery: PostPagesQuery = {
    category: null,
    search: "",
    excludeSlug: featured?.slug ?? null,
  };
  const initialPage: PostPages = {
    key: postPagesKey(pageQuery),
    ...(await fetchPostPage(cmsLocaleCode, pageQuery)),
  };
  return {
    props: { query, featured, initialPage },
    revalidate: 300,
  };
};
