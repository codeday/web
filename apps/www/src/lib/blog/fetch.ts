import { apiFetch } from "@codeday/topo/utils";
import { ResultOf } from "@graphql-typed-document-node/core";

import { normalizePostSummary } from "./normalize";
import { buildPostFilter, PAGE_SIZE, type PostPage, type PostQuery } from "./posts";
import { BlogFeaturedPostQuery, BlogPostsQuery } from "./queries";
import type { BlogPostSummary } from "./types";

type SummaryItem = Parameters<typeof normalizePostSummary>[0];

function normalizeAll(items: (SummaryItem | null)[]): BlogPostSummary[] {
  return items.flatMap((item) => {
    const post = item ? normalizePostSummary(item) : null;
    return post ? [post] : [];
  });
}

export async function fetchPostPage(
  locale: string,
  query: PostQuery,
  skip = 0,
): Promise<PostPage<BlogPostSummary>> {
  const { cms }: ResultOf<typeof BlogPostsQuery> = await apiFetch(
    BlogPostsQuery,
    { locale, skip, limit: PAGE_SIZE, where: buildPostFilter(query) },
    {},
  );
  return {
    posts: normalizeAll(cms?.blogPosts?.items ?? []),
    total: cms?.blogPosts?.total ?? 0,
  };
}

export async function fetchFeaturedPost(locale: string): Promise<BlogPostSummary | null> {
  const { cms }: ResultOf<typeof BlogFeaturedPostQuery> = await apiFetch(
    BlogFeaturedPostQuery,
    { locale },
    {},
  );
  return normalizeAll(cms?.blogPosts?.items ?? [])[0] ?? null;
}
