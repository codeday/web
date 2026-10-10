import { graphql } from "@/gql";
import { FragmentType, useFragment as unmask } from "@/gql/fragment-masking";

import { readingMinutes } from "./body";
import type { BlogAuthor, BlogImage, BlogPostSummary } from "./types";

export const BlogPostSummaryFragment = graphql(`
  fragment BlogPostSummary on CmsBlogPost {
    slug
    title
    titleHighlight
    category
    tags
    featured
    publishDate
    previewText
    previewImage {
      url
      description
      width
      height
    }
    body {
      json
    }
    author
    authorAccount {
      username
      name
      title
      bio
      picture
    }
  }
`);

interface RawAsset {
  url?: string | null;
  description?: string | null;
  width?: number | null;
  height?: number | null;
}

export function normalizeImage(asset: RawAsset | null | undefined): BlogImage | null {
  if (!asset?.url) return null;
  return {
    url: asset.url,
    alt: asset.description ?? "",
    width: asset.width ?? null,
    height: asset.height ?? null,
  };
}

interface RawAccount {
  username?: string | null;
  name?: string | null;
  title?: string | null;
  bio?: string | null;
  picture?: string | null;
}

export function normalizeAuthor(
  username: string | null | undefined,
  account: RawAccount | null | undefined,
): BlogAuthor {
  const handle = account?.username ?? username ?? "";
  return {
    username: handle,
    name: account?.name ?? handle,
    title: account?.title ?? null,
    bio: account?.bio ?? null,
    picture: account?.picture ?? null,
  };
}

export function normalizePostSummary(
  data: FragmentType<typeof BlogPostSummaryFragment>,
): BlogPostSummary | null {
  const post = unmask(BlogPostSummaryFragment, data);
  if (!post.slug || !post.title || !post.publishDate) return null;
  return {
    slug: post.slug,
    title: post.title,
    titleHighlight: post.titleHighlight ?? null,
    category: post.category ?? "",
    tags: (post.tags ?? []).filter((t): t is string => !!t),
    featured: !!post.featured,
    publishDate: post.publishDate,
    previewText: post.previewText ?? "",
    previewImage: normalizeImage(post.previewImage),
    readingMinutes: readingMinutes(post.body?.json as any),
    author: normalizeAuthor(post.author, post.authorAccount),
  };
}
