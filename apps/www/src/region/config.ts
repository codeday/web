/**
 * App-specific domain → region configuration for apps/www.
 *
 * This file is Edge-safe (no React or Node.js imports) so middleware
 * can import it directly.  Generic helpers come from @codeday/topo.
 */

import type { DomainRegionMap } from "@codeday/topo/Region/config";

export { DEFAULT_REGION, REGION_HEADER, getRegionFromHostname } from "@codeday/topo/Region/config";

/** Domain → region map for the CodeDay website. */
export const DOMAIN_REGION_MAP: DomainRegionMap = {
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
