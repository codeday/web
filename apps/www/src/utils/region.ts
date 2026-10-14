import { DEFAULT_REGION, isRegion, type RegionLocalization } from "@codeday/topo/Region";
import { apiFetch } from "@codeday/topo/utils";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticPaths,
  GetStaticProps,
  GetStaticPropsContext,
} from "next";

import { graphql } from "@/gql";
import { cmsLocale } from "@/utils/cmsLocale";

export interface RegionFeatures {
  donate: boolean;
}

const DEFAULT_FEATURES: RegionFeatures = {
  donate: true,
};

const REGION_FEATURES: Record<string, Partial<RegionFeatures>> = {
  estonia: { donate: false },
  uk: { donate: false },
};

export function getRegionFeatures(region: string): RegionFeatures {
  return { ...DEFAULT_FEATURES, ...REGION_FEATURES[region] };
}

export interface RegionPageProps {
  region: string;
  regionLocalization: RegionLocalization | null;
}

interface RegionPageOptions {
  requires?: keyof RegionFeatures;
}

const RegionLocalizationQuery = graphql(`
  query RegionLocalizationQuery($region: String!, $locale: String!) {
    cms {
      localizationConfigs(where: { id: $region }, locale: $locale, limit: 1) {
        items {
          name
          contactDefaultType
          contactDefaultValue
          legalEntity {
            legalName
            identifierName
            identifier
          }
        }
      }
    }
  }
`);

function resolveRegion(
  ctx: GetStaticPropsContext | GetServerSidePropsContext,
  { requires }: RegionPageOptions,
): string | null {
  const region = ctx.params?.siteRegion;
  if (!isRegion(region)) return null;
  if (requires && !getRegionFeatures(region)[requires]) return null;
  return region;
}

async function fetchRegionLocalization(
  region: string,
  locale: string | undefined,
): Promise<RegionLocalization | null> {
  const data = await apiFetch(RegionLocalizationQuery, { region, locale: cmsLocale(locale) }, {});
  return data?.cms?.localizationConfigs?.items?.[0] ?? null;
}

export function withRegionStaticProps<P extends Record<string, any>>(
  fn: GetStaticProps<P>,
  options: RegionPageOptions = {},
): GetStaticProps<P & RegionPageProps> {
  return async (ctx) => {
    const region = resolveRegion(ctx, options);
    if (!region) return { notFound: true };

    const [regionLocalization, result] = await Promise.all([
      fetchRegionLocalization(region, ctx.locale),
      fn(ctx),
    ]);
    if (!("props" in result)) return result;
    return { ...result, props: { ...result.props, region, regionLocalization } };
  };
}

export function withRegionServerSideProps<P extends Record<string, any>>(
  fn: GetServerSideProps<P>,
  options: RegionPageOptions = {},
): GetServerSideProps<P & RegionPageProps> {
  return async (ctx) => {
    const region = resolveRegion(ctx, options);
    if (!region) return { notFound: true };

    const [regionLocalization, result] = await Promise.all([
      fetchRegionLocalization(region, ctx.locale),
      fn(ctx),
    ]);
    if (!("props" in result)) return result;
    return { ...result, props: { ...(await result.props), region, regionLocalization } };
  };
}

export const getRegionStaticPaths: GetStaticPaths = async ({ locales = [] }) => ({
  paths: locales
    .filter((locale) => locale !== "_default")
    .map((locale) => ({ params: { siteRegion: DEFAULT_REGION }, locale })),
  fallback: "blocking",
});

export function withRegionStaticPaths(fn: GetStaticPaths): GetStaticPaths {
  return async (ctx) => {
    const { paths, fallback } = await fn(ctx);
    return {
      fallback,
      paths: paths.map((path) =>
        typeof path === "string"
          ? `/_region/${DEFAULT_REGION}${path}`
          : { ...path, params: { ...path.params, siteRegion: DEFAULT_REGION } },
      ),
    };
  };
}
