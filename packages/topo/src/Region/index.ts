/**
 * Region detection — React context, hooks, and server-side helpers.
 *
 * Re-exports the pure config/lookup from `./config` and adds:
 * - `RegionProvider` / `useRegion()` for client-side React components
 * - `getRegionFromContext()` for Next.js `getServerSideProps`
 */

export {
  DEFAULT_REGION,
  REGION_HEADER,
  TLD_REGION_MAP,
  getRegionFromHostname,
  type RegionMap,
} from "./config";

import { createContext, useContext } from "react";
import type { GetServerSidePropsContext } from "next";
import { DEFAULT_REGION, REGION_HEADER, getRegionFromHostname, type RegionMap } from "./config";

// ---------------------------------------------------------------------------
// React context + hook
// ---------------------------------------------------------------------------

export const RegionContext = createContext<string>(DEFAULT_REGION);
export const RegionProvider = RegionContext.Provider;

/**
 * Get the current region code inside a React component.
 *
 * The region is set by wrapping your component tree with `<RegionProvider>`.
 *
 * @example
 *   const region = useRegion(); // "us" | "eu" | "uk" | "ca" | "in" | ...
 */
export function useRegion(): string {
  return useContext(RegionContext);
}

// ---------------------------------------------------------------------------
// Server-side helper
// ---------------------------------------------------------------------------

/**
 * Extract the region from a Next.js `getServerSideProps` context.
 *
 * Reads the `x-codeday-region` header (set by middleware) first, then
 * falls back to parsing the `Host` header against the TLD map.
 *
 * @param ctx - The Next.js `getServerSideProps` context object.
 * @param overrides - Optional per-app overrides (full domains or extra TLDs).
 * @param defaultRegion - Fallback when nothing matches (default: `"us"`).
 *
 * @example
 *   export const getServerSideProps: GetServerSideProps = async (ctx) => {
 *     const region = getRegionFromContext(ctx);
 *     return { props: { region } };
 *   };
 */
export function getRegionFromContext(
  ctx: GetServerSidePropsContext,
  overrides?: RegionMap,
  defaultRegion: string = DEFAULT_REGION,
): string {
  const req = ctx.req;

  // Prefer the pre-resolved header from middleware
  const headerRegion = req.headers[REGION_HEADER];
  if (typeof headerRegion === "string" && headerRegion) {
    return headerRegion;
  }

  // Fallback: parse the Host header
  const host = req.headers.host;
  return getRegionFromHostname(host, overrides, defaultRegion);
}
