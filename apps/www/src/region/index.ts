/**
 * Region detection — determines a region code from the current domain name.
 *
 * This module re-exports the pure config/lookup from `./config` (safe for
 * all environments including Edge middleware), and adds React + Node.js
 * helpers that are only used in the app itself.
 */

export {
  DOMAIN_REGION_MAP,
  DEFAULT_REGION,
  REGION_HEADER,
  getRegionFromHostname,
} from "./config";

import { createContext, useContext } from "react";
import type { IncomingMessage } from "http";
import { DEFAULT_REGION, REGION_HEADER, getRegionFromHostname } from "./config";

// ---------------------------------------------------------------------------
// React context + hook — for client-side component access.
// ---------------------------------------------------------------------------

export const RegionContext = createContext<string>(DEFAULT_REGION);
export const RegionProvider = RegionContext.Provider;

/**
 * Get the current region code inside a React component.
 *
 * @example
 *   const region = useRegion();
 *   // "us" | "eu" | "uk" | "ca" | "in" | ...
 */
export function useRegion(): string {
  return useContext(RegionContext);
}

// ---------------------------------------------------------------------------
// Server-side helpers — for getServerSideProps / API routes.
// ---------------------------------------------------------------------------

/**
 * Extract the region from a Next.js `getServerSideProps` request.
 *
 * Checks the `x-codeday-region` header (set by middleware) first,
 * then falls back to parsing the `Host` header.
 *
 * @example
 *   export const getServerSideProps: GetServerSideProps = async (ctx) => {
 *     const region = getRegionFromRequest(ctx.req);
 *     return { props: { region } };
 *   };
 */
export function getRegionFromRequest(req: IncomingMessage): string {
  const headerRegion = req.headers[REGION_HEADER];
  if (typeof headerRegion === "string" && headerRegion) {
    return headerRegion;
  }

  const host = req.headers.host;
  return getRegionFromHostname(host);
}
