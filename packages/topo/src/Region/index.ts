export {
  DEFAULT_REGION,
  REGION_HEADER,
  TLD_REGION_MAP,
  getRegionFromHostname,
  type RegionMap,
} from "./config";

import type { GetServerSidePropsContext, GetStaticPropsContext } from "next";
import { createContext, useContext } from "react";

import { DEFAULT_REGION, REGION_HEADER, getRegionFromHostname, type RegionMap } from "./config";

export const RegionContext = createContext<string>(DEFAULT_REGION);
export const RegionProvider = RegionContext.Provider;

export function useRegion(): string {
  return useContext(RegionContext);
}

export function getRegionFromContext(
  ctx: GetServerSidePropsContext,
  overrides?: RegionMap,
  defaultRegion: string = DEFAULT_REGION,
): string {
  const req = ctx.req;

  const headerRegion = req.headers[REGION_HEADER];
  if (typeof headerRegion === "string" && headerRegion) {
    return headerRegion;
  }

  const host = req.headers.host;
  return getRegionFromHostname(host, overrides, defaultRegion);
}
