/**
 * App-specific region wiring for apps/www.
 *
 * Re-exports generic helpers from @codeday/topo/Region and provides
 * thin wrappers that bake in the app's DOMAIN_REGION_MAP.
 */

// Re-export generic helpers from topo
export { RegionProvider, RegionContext, useRegion } from "@codeday/topo/Region";
export { DEFAULT_REGION, REGION_HEADER, type DomainRegionMap } from "@codeday/topo/Region/config";

// Re-export the app-specific domain map
export { DOMAIN_REGION_MAP } from "./config";

import type { GetServerSidePropsContext } from "next";
import { getRegionFromHostname } from "@codeday/topo/Region/config";
import { getRegionFromContext as _getRegionFromContext } from "@codeday/topo/Region";
import { DOMAIN_REGION_MAP } from "./config";

/**
 * Get the region from hostname, using this app's domain map.
 */
export function getAppRegionFromHostname(hostname: string | undefined | null): string {
  return getRegionFromHostname(hostname, DOMAIN_REGION_MAP);
}

/**
 * Get the region from a `getServerSideProps` context, using this app's domain map.
 */
export function getRegionFromContext(ctx: GetServerSidePropsContext): string {
  return _getRegionFromContext(ctx, DOMAIN_REGION_MAP);
}
