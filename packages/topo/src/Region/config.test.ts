import { describe, expect, it } from "vitest";

import { DEFAULT_REGION, getRegionFromHostname, isRegion } from "./config";

describe("getRegionFromHostname", () => {
  it.each([
    ["www.codeday.org", "us"],
    ["codeday.ca", "ca"],
    ["www.codeday.co.uk:443", "uk"],
    ["codeday.fr", "estonia"],
    ["codeday.ca.localhost:3000", "ca"],
    ["localhost:3000", DEFAULT_REGION],
    ["web-git-branch.vercel.app", DEFAULT_REGION],
  ])("resolves %s to %s", (hostname, region) => {
    expect(getRegionFromHostname(hostname)).toBe(region);
  });
});

describe("isRegion", () => {
  it("accepts every region a domain can resolve to", () => {
    expect(isRegion("us")).toBe(true);
    expect(isRegion("ca")).toBe(true);
    expect(isRegion("estonia")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isRegion("canada")).toBe(false);
    expect(isRegion("[siteRegion]")).toBe(false);
    expect(isRegion(undefined)).toBe(false);
  });
});
