import { NextApiRequest, NextApiResponse } from "next";

import { findCategory } from "@/lib/blog/categories";
import { fetchPostPage } from "@/lib/blog/fetch";
import { MAX_SEARCH_LENGTH } from "@/lib/blog/posts";
import { cmsLocale } from "@/utils/cmsLocale";

const MAX_SKIP = 1000;

function param(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function BlogPosts(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    res.status(405).end();
    return;
  }

  const skip = Number.parseInt(param(req.query.skip) || "0", 10);
  const categorySlug = param(req.query.category);
  const category = findCategory(categorySlug);
  if (!Number.isInteger(skip) || skip < 0 || skip > MAX_SKIP || (categorySlug && !category)) {
    res.status(400).json({ error: "Invalid query" });
    return;
  }

  try {
    const page = await fetchPostPage(
      cmsLocale(param(req.query.locale) || undefined),
      {
        category: category?.value ?? null,
        search: param(req.query.q).slice(0, MAX_SEARCH_LENGTH),
        excludeSlug: param(req.query.exclude) || null,
      },
      skip,
    );
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    res.status(200).json(page);
  } catch {
    res.status(502).json({ error: "Could not load posts" });
  }
}
