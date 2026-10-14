import { describe, expect, it } from "vitest";

import { geoRedirects } from "@/lib/geoRedirects";

const CONFIGS = [
  { iso3166Alpha2Code: "US", domainName: "codeday.org" },
  { iso3166Alpha2Code: "FR", domainName: "codeday.org" },
  { iso3166Alpha2Code: "CA", domainName: "codeday.ca" },
  { iso3166Alpha2Code: "GB", domainName: "codeday.co.uk" },
  { iso3166Alpha2Code: "EE", domainName: "codeday.ee" },
  { iso3166Alpha2Code: null, domainName: "codeday.in" },
];

describe("geoRedirects", () => {
  const redirects = geoRedirects(CONFIGS, ["en-us", "fr-fr"]);
  const byDestination = (domain: string) =>
    redirects.find((r) => r.destination === `https://www.${domain}/:path*`);

  it("adds temporary redirects per regional domain plus a codeday.org fallback", () => {
    expect(redirects.map((r) => r.destination)).toEqual([
      "https://www.codeday.ca/:locale/:path*",
      "https://www.codeday.ca/:path*",
      "https://www.codeday.co.uk/:locale/:path*",
      "https://www.codeday.co.uk/:path*",
      "https://www.codeday.ee/:locale/:path*",
      "https://www.codeday.ee/:path*",
      "https://www.codeday.org/:locale/:path*",
      "https://www.codeday.org/:path*",
    ]);
    expect(redirects.every((r) => r.permanent === false && r.locale === false)).toBe(true);
  });

  it("keeps the locale and drops Next's internal _default locale", () => {
    expect(redirects.map((r) => r.source)).toContain("/:locale(en-us|fr-fr)/:path*");
    expect(redirects.map((r) => r.source)).toContain("/_default/:path((?!api(?:/|$)).*)?");
  });

  it("never redirects a domain to itself", () => {
    expect(byDestination("codeday.ca")?.missing).toContainEqual({
      type: "host",
      value: "(?:www\\.)?(?:codeday\\.ca)",
    });
  });

  it("sends every other country to codeday.org", () => {
    const fallback = byDestination("codeday.org");
    expect(fallback?.has).toContainEqual({ type: "header", key: "x-vercel-ip-country" });
    expect(fallback?.missing).toContainEqual({
      type: "header",
      key: "x-vercel-ip-country",
      value: "(?:CA|GB|EE)",
    });
  });

  it("only applies on production CodeDay hosts", () => {
    const hostRule = redirects[0].has?.find((h) => h.type === "host");
    const matches = (host: string) => new RegExp(`^${hostRule?.value}$`).test(host);
    expect(matches("www.codeday.org")).toBe(true);
    expect(matches("codeday.co.uk")).toBe(true);
    expect(matches("www-corp.vercel.app")).toBe(false);
    expect(matches("localhost")).toBe(false);
  });

  it("never loops, even when a country is listed under two domains", () => {
    const rules = geoRedirects(
      [
        ...CONFIGS,
        { iso3166Alpha2Code: "IN", domainName: "codeday.in" },
        { iso3166Alpha2Code: "CA", domainName: "codeday.ee" },
      ],
      ["en-us"],
    );
    const anchored = (pattern: string) => new RegExp(`^${pattern}$`);
    const conditionMatches = (
      c: { type: string; key?: string; value?: string },
      host: string,
      country: string,
    ) => {
      const actual = c.type === "host" ? host : country;
      return c.value === undefined ? true : anchored(c.value).test(actual);
    };
    const nextHost = (host: string, country: string) =>
      rules
        .find(
          (r) =>
            (r.has ?? []).every((c) => conditionMatches(c, host, country)) &&
            !(r.missing ?? []).some((c) => conditionMatches(c, host, country)),
        )
        ?.destination.match(/^https:\/\/([^/]+)/)?.[1];

    const hosts = [
      "www.codeday.org",
      "www.codeday.ca",
      "www.codeday.in",
      "www.codeday.ee",
      "www.codeday.co.uk",
      "www.codeday.fr",
    ];
    for (const country of ["US", "CA", "IN", "EE", "GB", "FR", "JP"]) {
      for (const host of hosts) {
        const target = nextHost(host, country);
        if (target) expect(nextHost(target, country)).toBeUndefined();
      }
    }
    expect(nextHost("www.codeday.in", "IN")).toBeUndefined();
    expect(nextHost("www.codeday.org", "CA")).toBe("www.codeday.ca");
  });
});
