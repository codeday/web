import { describe, expect, it } from "vitest";

import { computeResearchStats } from "./stats";
import type { Publication } from "./types";

function paper(venue: string, authors: Publication["authors"]): Publication {
  return {
    id: venue,
    type: "paper",
    kind: "conference",
    year: 2024,
    title: venue,
    authors,
    venue,
    venueLong: venue,
    topics: [],
    links: [],
  };
}

const MENEZES = { name: "Tyler Menezes" };
const EXTERNAL_A = { name: "Anita Sarma" };
const EXTERNAL_B = { name: "Igor Steinmacher" };

describe("computeResearchStats", () => {
  it("counts papers, collapses repeated venues across years, counts distinct authors", () => {
    const stats = computeResearchStats([
      paper("SIGCSE TS 2024", [MENEZES, EXTERNAL_A]),
      { ...paper("SIGCSE TS 2026", [MENEZES, EXTERNAL_A]) },
      paper("Koli Calling 2022", [MENEZES, EXTERNAL_B]),
      { ...paper("Some Talk", [MENEZES]), type: "talk", kind: "talk" },
    ]);

    expect(stats.count).toBe(4);
    expect(stats.venues).toBe(3);
    expect(stats.coauthors).toBe(3);
    expect(stats.talks).toBe(1);
  });
});
