import { describe, expect, it } from "vitest";

import { buildPostFilter, MAX_SEARCH_LENGTH, searchTerms } from "@/lib/blog/posts";

describe("buildPostFilter", () => {
  it("returns an empty filter when nothing is selected", () => {
    expect(buildPostFilter({ category: null, search: "  " })).toEqual({});
  });

  it("filters by category and excludes the featured post", () => {
    expect(
      buildPostFilter({ category: "Micro-Internships", search: "", excludeSlug: "featured" }),
    ).toEqual({
      AND: [{ category: "Micro-Internships" }, { slug_not: "featured" }],
    });
  });

  it("requires every search term to match a title, excerpt or tag, or the whole query to match a tag", () => {
    expect(buildPostFilter({ category: null, search: " open  source " })).toEqual({
      AND: [
        {
          OR: [
            {
              AND: [
                {
                  OR: [
                    { title_contains: "open" },
                    { previewText_contains: "open" },
                    { tags_contains_some: ["open"] },
                  ],
                },
                {
                  OR: [
                    { title_contains: "source" },
                    { previewText_contains: "source" },
                    { tags_contains_some: ["source"] },
                  ],
                },
              ],
            },
            { tags_contains_some: ["open source"] },
          ],
        },
      ],
    });
  });
});

describe("searchTerms", () => {
  it("caps the query length", () => {
    const terms = searchTerms("a".repeat(MAX_SEARCH_LENGTH + 50));
    expect(terms[0]).toHaveLength(MAX_SEARCH_LENGTH);
  });
});
