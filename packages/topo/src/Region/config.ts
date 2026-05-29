/**
 * Region detection — pure utility functions and types.
 *
 * This module has NO React or Node.js imports so it can safely run in
 * Edge middleware, client components, or server-side code.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A mapping of domain names to region codes. */
export type DomainRegionMap = Record<string, string>;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Default region when the hostname doesn't match any configured domain. */
export const DEFAULT_REGION = "us";

/** HTTP header name used to forward the resolved region from middleware. */
export const REGION_HEADER = "x-codeday-region";

// ---------------------------------------------------------------------------
// Pure lookup
// ---------------------------------------------------------------------------

/**
 * Resolve a region code from a hostname using the provided domain map.
 *
 * Strips port and `www.` prefix, then walks up the domain hierarchy
 * (e.g. `"www.codeday.co.uk"` → `"codeday.co.uk"` → `"co.uk"`) to find
 * the first match.
 *
 * @param hostname - The hostname to look up (e.g. from `window.location.hostname`
 *   or the `Host` request header). `null`/`undefined` returns `defaultRegion`.
 * @param domainMap - A `{ domain: regionCode }` object.
 * @param defaultRegion - Fallback region when no domain matches.
 *   Defaults to {@link DEFAULT_REGION} (`"us"`).
 */
export function getRegionFromHostname(
  hostname: string | undefined | null,
  domainMap: DomainRegionMap,
  defaultRegion: string = DEFAULT_REGION,
): string {
  if (!hostname) return defaultRegion;

  // Strip port and www prefix
  let domain = hostname.split(":")[0].toLowerCase();
  if (domain.startsWith("www.")) {
    domain = domain.slice(4);
  }

  // Walk up domain parts: "sub.codeday.co.uk" → "codeday.co.uk" → "co.uk"
  const parts = domain.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    const candidate = parts.slice(i).join(".");
    if (candidate in domainMap) {
      return domainMap[candidate];
    }
  }

  return defaultRegion;
}
