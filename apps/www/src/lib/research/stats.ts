import type { Publication } from "./types";

export interface ResearchStats {
  count: number;
  venues: number;
  coauthors: number;
  talks: number;
}

// Strips a trailing four-digit year so "SIGCSE TS 2024" and "SIGCSE TS 2026"
// count as one venue.
function venueKey(venue: string): string {
  return venue.replace(/\s*\d{4}\s*$/, "").trim();
}

export function computeResearchStats(publications: Publication[]): ResearchStats {
  const venues = new Set(publications.map((p) => venueKey(p.venue)).filter(Boolean));

  const coauthors = new Set(publications.flatMap((p) => p.authors.map((a) => a.name)));

  return {
    count: publications.length,
    venues: venues.size,
    coauthors: coauthors.size,
    talks: publications.filter((p) => p.type === "talk").length,
  };
}
