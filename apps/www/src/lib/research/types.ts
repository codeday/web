export type PublicationType = "paper" | "preprint" | "report" | "talk" | "dataset";

export type PublicationKind =
  | "conference"
  | "journal"
  | "poster"
  | "talk"
  | "panel"
  | "report"
  | "independent";

export interface PublicationLink {
  label: string;
  url: string;
}

export interface PublicationAuthor {
  name: string;
  /** Known to be CodeDay staff/alumni — renders in ink, bold; everyone else renders muted. */
  codeDayAffiliated: boolean;
}

export interface Publication {
  id: string;
  type: PublicationType;
  kind?: PublicationKind;
  year: number;
  date?: string;
  title: string;
  authors: PublicationAuthor[];
  venue: string;
  venueLong: string;
  where?: string;
  doi?: string;
  /** One factual sentence, straight from the source record's own abstract/description — never invented. */
  summary?: string;
  topics: string[];
  links: PublicationLink[];
}

// Authors confirmed to be CodeDay staff/alumni — deliberately small and only
// added when we can verify affiliation, since misattributing a co-author's
// employer on a public page is worse than leaving a name unhighlighted.
export const CODEDAY_AUTHORS = new Set<string>(["Tyler Menezes"]);

export function isCodeDayAuthor(name: string): boolean {
  return CODEDAY_AUTHORS.has(name);
}
