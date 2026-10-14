export {
  DEFAULT_REGION,
  REGIONS,
  TLD_REGION_MAP,
  getRegionFromHostname,
  isRegion,
  type RegionMap,
} from "./config";

import { createContext, useContext } from "react";

import { DEFAULT_REGION } from "./config";

export interface RegionLocalization {
  name?: string | null;
  contactDefaultType?: string | null;
  contactDefaultValue?: string | null;
  legalEntity?: {
    legalName?: string | null;
    identifierName?: string | null;
    identifier?: string | null;
  } | null;
}

export interface RegionContextValue {
  region: string;
  localization?: RegionLocalization | null;
}

export const RegionContext = createContext<RegionContextValue>({ region: DEFAULT_REGION });
export const RegionProvider = RegionContext.Provider;

export function useRegion(): string {
  return useContext(RegionContext).region;
}

export function useRegionLocalization(): RegionLocalization | null | undefined {
  return useContext(RegionContext).localization;
}
