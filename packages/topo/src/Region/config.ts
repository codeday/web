export type RegionMap = Record<string, string>;

export const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us";

export const REGION_HEADER = "x-codeday-region";

export const TLD_REGION_MAP: RegionMap = {
  org: "us",
  us: "us",
  ca: "canada",
  "co.uk": "uk",
  in: "india",
  ee: "estonia",
  se: "estonia",
  it: "estonia",
  fr: "estonia",
  es: "estonia",
  ch: "estonia",
  be: "estonia",
};

export function getRegionFromHostname(
  hostname: string | undefined | null,
  overrides?: RegionMap,
  defaultRegion: string = DEFAULT_REGION,
): string {
  if (!hostname) return defaultRegion;

  let domain = hostname.split(":")[0].toLowerCase();
  if (domain.startsWith("www.")) {
    domain = domain.slice(4);
  }

  if (overrides) {
    const parts = domain.split(".");
    for (let i = 0; i < parts.length - 1; i++) {
      const candidate = parts.slice(i).join(".");
      if (candidate in overrides) {
        return overrides[candidate];
      }
    }
  }

  const parts = domain.split(".");
  for (let len = parts.length - 1; len >= 1; len--) {
    const tld = parts.slice(-len).join(".");
    if (overrides && tld in overrides) {
      return overrides[tld];
    }
    if (tld in TLD_REGION_MAP) {
      return TLD_REGION_MAP[tld];
    }
  }

  return defaultRegion;
}
