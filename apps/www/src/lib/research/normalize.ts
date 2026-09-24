import { DateTime } from "luxon";

import type { Publication, PublicationKind, PublicationType } from "./types";

export interface RawExternalPublication {
  title: string;
  authors: string[];
  type: string | null;
  venue: string | null;
  venueLong: string | null;
  venueDetails: string | null;
  doi: string | null;
  preprint: string | null;
  publicationDate: string;
  abstract: string | null;
  topic: (string | null)[] | null;
}

export interface RawSelfPublication {
  title: string;
  type: string | null;
  venue: string | null;
  doiSuffix: string;
  publicationDate: string;
  description: string | null;
  contributors: { name: string }[];
  topic: (string | null)[] | null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function humanDate(iso: string): string {
  return DateTime.fromISO(iso).toFormat("MMMM d, yyyy");
}

function normalizeTopics(topic: (string | null)[] | null): string[] {
  return (topic || []).filter((t): t is string => Boolean(t));
}

const EXTERNAL_KIND: Record<string, { type: PublicationType; kind?: PublicationKind }> = {
  "conference-paper": { type: "paper", kind: "conference" },
  "journal-paper": { type: "paper", kind: "journal" },
  preprint: { type: "preprint" },
};

export function normalizeExternalPublication(raw: RawExternalPublication): Publication {
  const mapped = EXTERNAL_KIND[raw.type ?? ""] ?? {
    type: "paper" as const,
    kind: "conference" as const,
  };
  const isPoster = raw.venueDetails?.trim().toLowerCase() === "poster";
  const type = mapped.type;
  const kind = isPoster ? "poster" : mapped.kind;
  const year = DateTime.fromISO(raw.publicationDate).year;

  const links = [
    ...(raw.doi ? [{ label: "DOI", url: `https://doi.org/${raw.doi}` }] : []),
    ...(raw.preprint ? [{ label: "arXiv", url: raw.preprint }] : []),
  ];

  return {
    id: slugify(raw.doi || raw.title),
    type,
    kind,
    year,
    date: type === "preprint" ? humanDate(raw.publicationDate) : undefined,
    title: raw.title,
    authors: raw.authors.map((name) => ({ name })),
    venue: raw.venue || raw.venueLong || "",
    venueLong: raw.venueLong || raw.venue || "",
    where: isPoster ? undefined : raw.venueDetails || undefined,
    doi: raw.doi || undefined,
    summary: raw.abstract || undefined,
    topics: normalizeTopics(raw.topic),
    links,
  };
}

const SELF_KIND: Record<string, { type: PublicationType; kind?: PublicationKind }> = {
  presentation: { type: "talk", kind: "talk" },
  dataset: { type: "dataset" },
  proposal: { type: "report", kind: "report" },
  report: { type: "report", kind: "report" },
  preprint: { type: "preprint" },
};

export function normalizeSelfPublication(raw: RawSelfPublication, doiPrefix: string): Publication {
  const mapped = SELF_KIND[raw.type ?? ""] ?? { type: "report" as const, kind: "report" as const };
  const type = mapped.type;
  const year = DateTime.fromISO(raw.publicationDate).year;
  const doi = `${doiPrefix}/${raw.doiSuffix}`;

  return {
    id: slugify(raw.doiSuffix),
    type,
    kind: mapped.kind,
    year,
    date: type === "talk" || type === "preprint" ? humanDate(raw.publicationDate) : undefined,
    title: raw.title,
    authors: raw.contributors.map((c) => ({ name: c.name })),
    venue: raw.venue || "",
    venueLong: raw.venue || "",
    doi,
    summary: raw.description || undefined,
    topics: normalizeTopics(raw.topic),
    links: [{ label: "DOI", url: `https://doi.org/${doi}` }],
  };
}

export function sortPublications(publications: Publication[]): Publication[] {
  return [...publications].sort((a, b) => b.year - a.year);
}
