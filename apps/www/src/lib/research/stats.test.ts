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

const MENEZES = { name: "Tyler Menezes", codeDayAffiliated: true };
const EXTERNAL_A = { name: "Anita Sarma", codeDayAffiliated: false };
const EXTERNAL_B = { name: "Igor Steinmacher", codeDayAffiliated: false };

describe("computeResearchStats", () => {
  it("counts papers, collapses repeated venues across years, counts distinct external coauthors", () => {
    const stats = computeResearchStats([
      paper("SIGCSE TS 2024", [MENEZES, EXTERNAL_A]),
      { ...paper("SIGCSE TS 2026", [MENEZES, EXTERNAL_A]) }, // same venue family, different year
      paper("Koli Calling 2022", [MENEZES, EXTERNAL_B]),
      { ...paper("Some Talk", [MENEZES]), type: "talk", kind: "talk" },
    ]);

    expect(stats.peerReviewed).toBe(3);
    expect(stats.venues).toBe(2); // "SIGCSE TS" once, "Koli Calling" once
    expect(stats.coauthors).toBe(2); // Sarma, Steinmacher — Menezes excluded
    expect(stats.talks).toBe(1);
  });
});
