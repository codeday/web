/**
 * Region detection — pure utility functions and types.
 *
 * This module has NO React or Node.js imports so it can safely run in
 * Edge middleware, client components, or server-side code.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A mapping of TLD suffixes or full domain names to region codes. */
export type RegionMap = Record<string, string>;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default region when the hostname doesn't match any configured TLD. */
export const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us";

/** HTTP header name used to forward the resolved region from middleware. */
export const REGION_HEADER = "x-codeday-region";

/**
 * Default TLD → region map. Covers common CodeDay country-code TLDs.
 *
 * Apps can override individual entries or add new ones by passing an
 * `overrides` map to {@link getRegionFromHostname}.
 */
export const TLD_REGION_MAP: RegionMap = {
  "org": "us",
  "us": "us",
  "ca": "canada",
  "co.uk": "uk",
  "in": "india",
  "ee": "estonia",
  "se": "estonia",
  "it": "estonia",
  "fr": "estonia",
  "es": "estonia",
  "ch": "estonia",
  "be": "estonia",
};

// ---------------------------------------------------------------------------
// Pure lookup
// ---------------------------------------------------------------------------

/**
 * Resolve a region code from a hostname.
 *
 * 1. If `overrides` is provided, checks for a full-domain match first
 *    (e.g. `"staging.codeday.org"` → `"eu"`).
 * 2. Extracts the TLD from the hostname (supports multi-part TLDs like
 *    `co.uk`) and looks it up in the TLD map.
 *
 * @param hostname - The hostname to look up (e.g. from `window.location.hostname`
 *   or the `Host` request header). `null`/`undefined` returns `defaultRegion`.
 * @param overrides - Optional per-app overrides. Full domain names here take
 *   priority over TLD matching. TLD keys here are merged on top of the
 *   built-in {@link TLD_REGION_MAP}.
 * @param defaultRegion - Fallback region when nothing matches.
 *   Defaults to {@link DEFAULT_REGION} (`"us"`).
 */
export function getRegionFromHostname(
  hostname: string | undefined | null,
  overrides?: RegionMap,
  defaultRegion: string = DEFAULT_REGION,
): string {
  if (!hostname) return defaultRegion;

  // Strip port and www prefix
  let domain = hostname.split(":")[0].toLowerCase();
  if (domain.startsWith("www.")) {
    domain = domain.slice(4);
  }

  // 1. Check overrides for a full-domain match (walk up from full domain)
  if (overrides) {
    const parts = domain.split(".");
    for (let i = 0; i < parts.length - 1; i++) {
      const candidate = parts.slice(i).join(".");
      if (candidate in overrides) {
        return overrides[candidate];
      }
    }
  }

  // 2. Extract TLD and match against the TLD map (walk up from the end)
  const parts = domain.split(".");
  for (let len = parts.length - 1; len >= 1; len--) {
    const tld = parts.slice(-len).join(".");
    // Check overrides for TLD-level keys too
    if (overrides && tld in overrides) {
      return overrides[tld];
    }
    if (tld in TLD_REGION_MAP) {
      return TLD_REGION_MAP[tld];
    }
  }

  return defaultRegion;
}
