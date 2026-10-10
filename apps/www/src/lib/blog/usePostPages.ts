import { useCallback, useEffect, useRef, useState } from "react";

import type { PostPage } from "./posts";
import type { BlogPostSummary } from "./types";

export interface PostPagesQuery {
  category: string | null;
  search: string;
  excludeSlug: string | null;
}

export interface PostPages extends PostPage<BlogPostSummary> {
  key: string;
}

export function postPagesKey({ category, search, excludeSlug }: PostPagesQuery): string {
  return JSON.stringify([category ?? "", search.trim(), excludeSlug ?? ""]);
}

async function fetchPage(
  query: PostPagesQuery,
  locale: string,
  skip: number,
  signal: AbortSignal,
): Promise<PostPage<BlogPostSummary>> {
  const params = new URLSearchParams({ skip: String(skip), locale });
  if (query.category) params.set("category", query.category);
  if (query.search.trim()) params.set("q", query.search.trim());
  if (query.excludeSlug) params.set("exclude", query.excludeSlug);
  const res = await fetch(`/api/blog/posts?${params}`, { signal });
  if (!res.ok) throw new Error(`Failed to load posts: ${res.status}`);
  return res.json();
}

export function usePostPages(initial: PostPages, query: PostPagesQuery, locale: string) {
  const key = postPagesKey(query);
  const [results, setResults] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);
  const queryRef = useRef(query);
  queryRef.current = query;

  const start = () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(false);
    return controller;
  };

  useEffect(() => {
    if (results.key === key) return undefined;
    if (key === initial.key) {
      controllerRef.current?.abort();
      setResults(initial);
      setLoading(false);
      return undefined;
    }
    const controller = start();
    fetchPage(queryRef.current, locale, 0, controller.signal)
      .then((page) => {
        setResults({ key, ...page });
        setLoading(false);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, [key, locale, attempt]);

  const loadMore = useCallback(() => {
    const controller = start();
    const loadedKey = results.key;
    fetchPage(queryRef.current, locale, results.posts.length, controller.signal)
      .then((page) => {
        setResults((current) => {
          if (current.key !== loadedKey) return current;
          const seen = new Set(current.posts.map((p) => p.slug));
          return {
            key: loadedKey,
            total: page.total,
            posts: [...current.posts, ...page.posts.filter((p) => !seen.has(p.slug))],
          };
        });
        setLoading(false);
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setError(true);
        setLoading(false);
      });
  }, [results, locale]);

  const current = results.key === key;
  return {
    posts: results.posts,
    total: results.total,
    current,
    loading: loading || (!current && !error),
    error,
    hasMore: current && results.posts.length < results.total,
    loadMore,
    retry: () => (current ? loadMore() : setAttempt((a) => a + 1)),
  };
}
