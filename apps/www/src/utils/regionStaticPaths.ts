import { baseLocale } from "@codeday/i18n/locales";
import { REGIONS } from "@codeday/topo/Region";
import { apiFetch } from "@codeday/topo/utils";
import type { ResultOf } from "@graphql-typed-document-node/core";
import type { GetStaticPaths } from "next";

import { graphql } from "@/gql";

/**
 * Decides which locales get prebuilt for each region. Anything not prebuilt still renders on its
 * first request (`fallback`), so a strategy only trades build time for first-visit latency.
 */
export type PrebuildStrategy = (siteLocales: string[]) => Promise<(region: string) => string[]>;

export const prebuildAllLocales: PrebuildStrategy = async (siteLocales) => () => siteLocales;

const RegionCommonLocalesQuery = graphql(`
  query RegionCommonLocalesQuery {
    cms {
      localizationConfigs(limit: 100) {
        items {
          id
          commonLocales
        }
      }
    }
  }
`);

export const prebuildCommonLocales: PrebuildStrategy = async () => {
  const data: ResultOf<typeof RegionCommonLocalesQuery> = await apiFetch(
    RegionCommonLocalesQuery,
    {},
    {},
  );
  const commonLocales = new Map<string, string[]>();
  for (const item of data?.cms?.localizationConfigs?.items ?? []) {
    if (!item?.id) continue;
    commonLocales.set(
      item.id,
      (item.commonLocales ?? []).flatMap((locale) => (locale ? [locale.toLowerCase()] : [])),
    );
  }
  return (region) => {
    const regionLocales = commonLocales.get(region);
    return regionLocales?.length ? regionLocales : [baseLocale];
  };
};

export function getRegionStaticPaths(strategy: PrebuildStrategy): GetStaticPaths {
  return async ({ locales = [] }) => {
    const siteLocales = locales.filter((locale) => locale !== "_default");
    const localesFor = await strategy(siteLocales);
    return {
      paths: REGIONS.flatMap((siteRegion) =>
        localesFor(siteRegion)
          .filter((locale) => siteLocales.includes(locale))
          .map((locale) => ({ params: { siteRegion }, locale })),
      ),
      fallback: "blocking",
    };
  };
}

export function getOnDemandStaticPaths(fallback: true | "blocking"): GetStaticPaths {
  return async () => ({ paths: [], fallback });
}
