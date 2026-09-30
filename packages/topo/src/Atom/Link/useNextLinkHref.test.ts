import { describe, expect, it } from "vitest";

import { isInternalPageHref } from "./useNextLinkHref";

describe("isInternalPageHref", () => {
  it.each([
    "/",
    "/research",
    "/micro-internship#partner",
    "/events?region=seattle",
    "/en-us/research",
    "/doi/10.55129/cd.2024.001",
  ])("treats %s as an internal page", (href) => {
    expect(isInternalPageHref(href)).toBe(true);
  });

  it.each([
    undefined,
    "",
    "#assets",
    "?q=1",
    "research",
    "//cdn.example.com/x",
    "https://www.codeday.org/research",
    "mailto:team@codeday.org",
    "tel:+18888000000",
    "/api/og",
    "/_next/static/chunk.js",
    "/favicon.ico",
    "/pro/deck.pdf",
    "/site.webmanifest",
  ])("does not treat %s as an internal page", (href) => {
    expect(isInternalPageHref(href)).toBe(false);
  });
});
