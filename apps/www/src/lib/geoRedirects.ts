import { TLD_REGION_MAP } from "@codeday/topo/Region/config";
import type { NextConfig } from "next";

type Redirect = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>[number];

export interface CountryDomain {
  iso3166Alpha2Code?: string | null;
  domainName?: string | null;
}

export const DEFAULT_DOMAIN = "codeday.org";

const COUNTRY_HEADER = "x-vercel-ip-country";

const PRODUCTION_DOMAINS = Object.keys(TLD_REGION_MAP).map((tld) => `codeday.${tld}`);

function hostPattern(domains: string[]): string {
  return `(?:www\\.)?(?:${domains.map((d) => d.replace(/\./g, "\\.")).join("|")})`;
}

// With `locale: false`, Next matches against the path with its locale already inserted, so a
// bare path arrives as `/_default/...` (including API routes, which are excluded here).
function redirectsTo(
  domain: string,
  locales: readonly string[],
  has: NonNullable<Redirect["has"]>,
  missing: NonNullable<Redirect["missing"]>,
): Redirect[] {
  const conditions = {
    locale: false as const,
    permanent: false,
    has: [...has, { type: "host" as const, value: hostPattern(PRODUCTION_DOMAINS) }],
    missing: [{ type: "host" as const, value: hostPattern([domain]) }, ...missing],
  };
  return [
    {
      ...conditions,
      source: `/:locale(${locales.join("|")})/:path*`,
      destination: `https://www.${domain}/:locale/:path*`,
    },
    {
      ...conditions,
      source: "/_default/:path((?!api(?:/|$)).*)?",
      destination: `https://www.${domain}/:path*`,
    },
  ];
}

export function geoRedirects(configs: CountryDomain[], locales: readonly string[]): Redirect[] {
  const domainByCountry = new Map<string, string>();
  for (const { iso3166Alpha2Code, domainName } of configs) {
    if (!iso3166Alpha2Code || !domainName) continue;
    const country = iso3166Alpha2Code.toUpperCase();
    // A country sent to two different domains would bounce between them forever.
    if (!domainByCountry.has(country)) {
      domainByCountry.set(country, domainName.toLowerCase().replace(/^www\./, ""));
    }
  }

  const countriesByDomain = new Map<string, Set<string>>();
  for (const [country, domain] of domainByCountry) {
    if (domain === DEFAULT_DOMAIN) continue;
    countriesByDomain.set(domain, (countriesByDomain.get(domain) ?? new Set()).add(country));
  }

  const regional = [...countriesByDomain].flatMap(([domain, countries]) =>
    redirectsTo(
      domain,
      locales,
      [{ type: "header", key: COUNTRY_HEADER, value: `(?:${[...countries].join("|")})` }],
      [],
    ),
  );

  const regionalCountries = [...countriesByDomain.values()].flatMap((c) => [...c]);
  const fallback = redirectsTo(
    DEFAULT_DOMAIN,
    locales,
    [{ type: "header", key: COUNTRY_HEADER }],
    regionalCountries.length > 0
      ? [{ type: "header", key: COUNTRY_HEADER, value: `(?:${regionalCountries.join("|")})` }]
      : [],
  );

  return [...regional, ...fallback];
}
