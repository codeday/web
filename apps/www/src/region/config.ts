// ---------------------------------------------------------------------------
// Configuration — edit this map to add/change domain → region mappings.
// ---------------------------------------------------------------------------

/** Map of domain names to region codes. */
export const DOMAIN_REGION_MAP: Record<string, string> = {
  "codeday.org": "us",
  "codeday.us": "us",
  "codeday.ca": "ca",
  "codeday.co.uk": "uk",
  "codeday.in": "in",
  "codeday.ee": "eu",
  "codeday.se": "eu",
  "codeday.it": "eu",
  "codeday.fr": "eu",
  "codeday.es": "eu",
  "codeday.ch": "eu",
  "codeday.be": "eu",
};

/** Region used when the hostname doesn't match any entry above. */
export const DEFAULT_REGION = "us";

/** Header name set by middleware for downstream use in getServerSideProps. */
export const REGION_HEADER = "x-codeday-region";

// ---------------------------------------------------------------------------
// Pure lookup — works in any environment (client, server, Edge, middleware).
// This file has NO React or Node.js imports so it can run anywhere.
// ---------------------------------------------------------------------------

/**
 * Resolve a region code from a hostname.
 *
 * Strips port and `www.` prefix, then walks up the domain hierarchy
 * (e.g. "www.codeday.co.uk" → "codeday.co.uk" → "co.uk") to find
 * the first match in `DOMAIN_REGION_MAP`.
 */
export function getRegionFromHostname(hostname: string | undefined | null): string {
  if (!hostname) return DEFAULT_REGION;

  // Strip port and www prefix
  let domain = hostname.split(":")[0].toLowerCase();
  if (domain.startsWith("www.")) {
    domain = domain.slice(4);
  }

  // Walk up domain parts: "sub.codeday.co.uk" → "codeday.co.uk" → "co.uk"
  const parts = domain.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    const candidate = parts.slice(i).join(".");
    if (candidate in DOMAIN_REGION_MAP) {
      return DOMAIN_REGION_MAP[candidate];
    }
  }

  return DEFAULT_REGION;
}
