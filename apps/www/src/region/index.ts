/**
 * Region wiring for apps/www.
 *
 * Re-exports from @codeday/topo/Region. If this app needs domain-level
 * overrides, define a RegionMap here and pass it to the helpers.
 */

export {
  RegionProvider,
  RegionContext,
  useRegion,
  getRegionFromHostname,
  getRegionFromContext,
} from "@codeday/topo/Region";
