import { describe, expect, it } from "vitest";

import {
  normalizeExternalPublication,
  normalizeSelfPublication,
  sortPublications,
} from "./normalize";
import type { RawExternalPublication, RawSelfPublication } from "./normalize";

// Fixtures pulled from the live `graph.codeday.org` schema (real records —
// see the DOIs), not invented data.
const POSTER: RawExternalPublication = {
  title: "Closing The Gap Between Classrooms and Industry With Open-Source Internships",
  authors: ["Alexander Parra", "Mingjie Jiang", "Tyler Menezes"],
  type: "conference-paper",
  venue: "SIGCSE TS 2021",
  venueLong: "Proceedings of the 52nd ACM Technical Symposium on Computer Science Education",
  venueDetails: "Poster",
  doi: "10.1145/3408877.3439576",
  preprint: null,
  publicationDate: "2021-03-03T00:00:00.000Z",
  abstract: null,
  topic: null,
};

const CONFERENCE_PAPER: RawExternalPublication = {
  title:
    "How Gender, Ethnicity, and Public Presentation Shape Coding Perseverance after Hackathons",
  authors: ["Emilia Gan", "Tyler Menezes", "Benjamin Mako Hill"],
  type: "conference-paper",
  venue: "Koli Calling 2022",
  venueLong:
    "Proceedings of the 22nd Koli Calling International Conference on Computing Education Research",
  venueDetails: "Koli, Finland",
  doi: "10.1145/3564721.3564727",
  preprint: null,
  publicationDate: "2022-11-17T00:00:00.000Z",
  abstract: null,
  topic: ["Broadening participation"],
};

const JOURNAL_PAPER: RawExternalPublication = {
  title:
    "Charting Uncertain Waters: A Socio-Technical Roadmap for Sustaining Open Source Communities in the Age of GenAI",
  authors: ["Zixuan Feng", "Tyler Menezes"],
  type: "journal-paper",
  venue: "ACM TOSEM",
  venueLong: "ACM Transactions on Software Engineering and Methodology",
  venueDetails: "Volume 35, Issue 8. Journal-first presentation at FSE 2026, Montreal",
  doi: "10.1145/3789210",
  preprint: "https://arxiv.org/abs/2508.04921",
  publicationDate: "2026-07-16T00:00:00.000Z",
  abstract: null,
  topic: ["Open source", "GenAI"],
};

const PRESENTATION: RawSelfPublication = {
  title: "Conference Presentation for Charting Uncertain Waters",
  type: "presentation",
  venue: "34th ACM International Conference on the Foundations of Software Engineering",
  doiSuffix: "20640.1608",
  publicationDate: "2026-07-07T12:00:00.000-07:00",
  description: "Presentation delivered at FSE2026.",
  contributors: [{ name: "Tyler Menezes", affiliation: null }],
  topic: ["Open source", "GenAI"],
};

const DATASET: RawSelfPublication = {
  title: 'Supplemental Files for "The Open Source Resume"',
  type: "dataset",
  venue: null,
  doiSuffix: "dkr1ysunc72wyzsdgtlrykdn",
  publicationDate: "2025-10-18T14:17:00.000-07:00",
  description: "This dataset includes anonymized hiring manager agreements.",
  contributors: [
    { name: "Utsab Saha", affiliation: "Computing Talent Initiative" },
    { name: "Tyler Menezes", affiliation: null },
  ],
  topic: ["Hiring"],
};

describe("normalizeExternalPublication", () => {
  it("marks venueDetails='Poster' as kind poster and drops it from `where`", () => {
    const pub = normalizeExternalPublication(POSTER);
    expect(pub.type).toBe("paper");
    expect(pub.kind).toBe("poster");
    expect(pub.where).toBeUndefined();
  });

  it("maps a plain conference paper to kind conference with a location `where`", () => {
    const pub = normalizeExternalPublication(CONFERENCE_PAPER);
    expect(pub.kind).toBe("conference");
    expect(pub.where).toBe("Koli, Finland");
    expect(pub.year).toBe(2022);
  });

  it("maps journal-paper to kind journal and carries the arXiv preprint as a link", () => {
    const pub = normalizeExternalPublication(JOURNAL_PAPER);
    expect(pub.kind).toBe("journal");
    expect(pub.links).toContainEqual({ label: "arXiv", url: "https://arxiv.org/abs/2508.04921" });
  });

  it("flags only the statically-known CodeDay author", () => {
    const pub = normalizeExternalPublication(CONFERENCE_PAPER);
    const byName = Object.fromEntries(pub.authors.map((a) => [a.name, a.codeDayAffiliated]));
    expect(byName["Tyler Menezes"]).toBe(true);
    expect(byName["Emilia Gan"]).toBe(false);
    expect(byName["Benjamin Mako Hill"]).toBe(false);
  });
});

describe("normalizeSelfPublication", () => {
  it("maps a presentation to type talk with a human date", () => {
    const pub = normalizeSelfPublication(PRESENTATION, "10.60507");
    expect(pub.type).toBe("talk");
    expect(pub.date).toBe("July 7, 2026");
    expect(pub.doi).toBe("10.60507/20640.1608");
  });

  it("uses contributor affiliation to decide CodeDay authorship", () => {
    const pub = normalizeSelfPublication(DATASET, "10.60507");
    const byName = Object.fromEntries(pub.authors.map((a) => [a.name, a.codeDayAffiliated]));
    expect(byName["Utsab Saha"]).toBe(false);
    expect(byName["Tyler Menezes"]).toBe(true);
    expect(pub.type).toBe("dataset");
  });
});

describe("sortPublications", () => {
  it("sorts descending by year", () => {
    const sorted = sortPublications([
      normalizeExternalPublication(POSTER), // 2021
      normalizeExternalPublication(JOURNAL_PAPER), // 2026
      normalizeExternalPublication(CONFERENCE_PAPER), // 2022
    ]);
    expect(sorted.map((p) => p.year)).toEqual([2026, 2022, 2021]);
  });
});
