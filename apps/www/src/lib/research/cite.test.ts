import { describe, expect, it } from "vitest";

import { acmReference, bibtex, formatAuthorsACM } from "./cite";
import type { Publication } from "./types";

const POSTER: Publication = {
  id: "poster",
  type: "paper",
  kind: "poster",
  year: 2021,
  title: "Closing The Gap Between Classrooms and Industry With Open-Source Internships",
  authors: [{ name: "Alexander Parra" }, { name: "Mingjie Jiang" }, { name: "Tyler Menezes" }],
  venue: "SIGCSE TS 2021",
  venueLong: "Proceedings of the 52nd ACM Technical Symposium on Computer Science Education",
  doi: "10.1145/3408877.3439576",
  topics: [],
  links: [{ label: "DOI", url: "https://doi.org/10.1145/3408877.3439576" }],
};

const JOURNAL_PAPER: Publication = {
  id: "journal",
  type: "paper",
  kind: "journal",
  year: 2026,
  title: "Charting Uncertain Waters",
  authors: [{ name: "Tyler Menezes" }],
  venue: "ACM TOSEM",
  venueLong: "ACM Transactions on Software Engineering and Methodology",
  doi: "10.1145/3789210",
  topics: [],
  links: [],
};

const TALK: Publication = {
  id: "talk",
  type: "talk",
  kind: "talk",
  year: 2026,
  title: "Conference Presentation for Charting Uncertain Waters",
  authors: [{ name: "Tyler Menezes" }],
  venue: "34th ACM International Conference on the Foundations of Software Engineering",
  venueLong: "34th ACM International Conference on the Foundations of Software Engineering",
  doi: "10.60507/20640.1608",
  topics: [],
  links: [],
};

const DATASET_NO_VENUE: Publication = {
  id: "dataset",
  type: "dataset",
  year: 2025,
  title: 'Supplemental Files for "The Open Source Resume"',
  authors: [{ name: "Utsab Saha" }, { name: "Tyler Menezes" }],
  venue: "",
  venueLong: "",
  doi: "10.60507/dkr1ysunc72wyzsdgtlrykdn",
  topics: [],
  links: [],
};

describe("formatAuthorsACM", () => {
  it("reduces a full name to initials + surname", () => {
    expect(formatAuthorsACM(["Tyler Menezes"])).toBe("T. Menezes");
  });
  it("joins three authors with a serial 'and', no Oxford comma", () => {
    expect(formatAuthorsACM(["Alexander Parra", "Mingjie Jiang", "Tyler Menezes"])).toBe(
      "A. Parra, M. Jiang and T. Menezes",
    );
  });
  it("handles a middle name", () => {
    expect(formatAuthorsACM(["Benjamin Mako Hill"])).toBe("B. M. Hill");
  });
});

describe("acmReference", () => {
  it("formats a paper with venue and short-venue parenthetical", () => {
    expect(acmReference(POSTER)).toBe(
      "A. Parra, M. Jiang and T. Menezes. 2021. Closing The Gap Between Classrooms and Industry With Open-Source Internships. In Proceedings of the 52nd ACM Technical Symposium on Computer Science Education (SIGCSE TS 2021). https://doi.org/10.1145/3408877.3439576",
    );
  });

  it("formats a talk with the Presentation, <venue> form", () => {
    expect(acmReference(TALK)).toBe(
      "T. Menezes. 2026. Conference Presentation for Charting Uncertain Waters. Presentation, 34th ACM International Conference on the Foundations of Software Engineering. https://doi.org/10.60507/20640.1608",
    );
  });

  it("omits an empty venue segment rather than printing a lone period", () => {
    const ref = acmReference(DATASET_NO_VENUE);
    expect(ref).not.toContain(" . ");
    expect(ref).toBe(
      'U. Saha and T. Menezes. 2025. Supplemental Files for "The Open Source Resume". https://doi.org/10.60507/dkr1ysunc72wyzsdgtlrykdn',
    );
  });
});

describe("bibtex", () => {
  it("uses @article for journal papers", () => {
    expect(bibtex(JOURNAL_PAPER)).toMatch(/^@article\{menezes2026charting,/);
    expect(bibtex(JOURNAL_PAPER)).toContain(
      "journal = {ACM Transactions on Software Engineering and Methodology}",
    );
  });

  it("uses @inproceedings for conference papers/posters", () => {
    expect(bibtex(POSTER)).toMatch(/^@inproceedings\{parra2021closing,/);
    expect(bibtex(POSTER)).toContain(
      "booktitle = {Proceedings of the 52nd ACM Technical Symposium on Computer Science Education}",
    );
  });

  it("uses @misc for everything else, and drops empty fields", () => {
    const entry = bibtex(TALK);
    expect(entry).toMatch(/^@misc\{menezes2026conference,/);
    expect(entry).toContain("howpublished");
    expect(entry).not.toContain("journal =");
    expect(entry).not.toContain("booktitle =");
  });
});
