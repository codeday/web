import { describe, expect, it } from "vitest";

import { splitHighlight } from "@/lib/blog/title";

describe("splitHighlight", () => {
  it("splits the title around an exact match", () => {
    expect(splitHighlight("How we ran CodeDay in 40 cities", "40 cities")).toEqual([
      "How we ran CodeDay in ",
      "40 cities",
      "",
    ]);
  });

  it("returns null when the phrase is empty or missing from the title", () => {
    expect(splitHighlight("A title", null)).toBeNull();
    expect(splitHighlight("A title", "  ")).toBeNull();
    expect(splitHighlight("A title", "a TITLE")).toBeNull();
  });
});
