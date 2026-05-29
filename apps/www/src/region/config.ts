/**
 * Region configuration for apps/www.
 *
 * Re-exports everything from @codeday/topo/Region/config (Edge-safe).
 * To add app-specific domain overrides, define and export a RegionMap here.
 */

export {
  DEFAULT_REGION,
  REGION_HEADER,
  TLD_REGION_MAP,
  getRegionFromHostname,
  type RegionMap,
} from "@codeday/topo/Region/config";
