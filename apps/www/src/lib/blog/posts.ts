import type { CmsBlogPostFilter } from "@/gql/graphql";

export const PAGE_SIZE = 9;
export const MAX_SEARCH_LENGTH = 100;

export interface PostQuery {
  category: string | null;
  search: string;
  excludeSlug?: string | null;
}

export interface PostPage<T> {
  posts: T[];
  total: number;
}

export function searchTerms(search: string): string[] {
  return search.slice(0, MAX_SEARCH_LENGTH).trim().split(/\s+/).filter(Boolean);
}

export function buildPostFilter({ category, search, excludeSlug }: PostQuery): CmsBlogPostFilter {
  const conditions: CmsBlogPostFilter[] = [];
  if (category) conditions.push({ category });
  if (excludeSlug) conditions.push({ slug_not: excludeSlug });

  const terms = searchTerms(search);
  if (terms.length > 0) {
    conditions.push({
      OR: [
        {
          AND: terms.map((term) => ({
            OR: [
              { title_contains: term },
              { previewText_contains: term },
              { tags_contains_some: [term] },
            ],
          })),
        },
        { tags_contains_some: [terms.join(" ")] },
      ],
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}
