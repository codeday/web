import type { ParsedUrlQuery } from "querystring";

import { useRouter } from "next/router";
import { useCallback } from "react";

const REGION_PAGES_PREFIX = "/_region/[siteRegion]";

function toPublicPathname(pathname: string): string {
  return pathname.startsWith(REGION_PAGES_PREFIX)
    ? pathname.slice(REGION_PAGES_PREFIX.length) || "/"
    : pathname;
}

export function usePublicPathname(): string {
  return toPublicPathname(useRouter().pathname);
}

export function useReplaceQuery() {
  const router = useRouter();
  return useCallback(
    (query: ParsedUrlQuery, { scroll }: { scroll?: boolean } = {}) => {
      const { siteRegion: _siteRegion, ...publicQuery } = query;
      return router.replace(
        {
          pathname: router.pathname,
          query: { ...publicQuery, siteRegion: router.query.siteRegion },
        },
        { pathname: toPublicPathname(router.pathname), query: publicQuery },
        { shallow: true, scroll },
      );
    },
    [router],
  );
}
