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
