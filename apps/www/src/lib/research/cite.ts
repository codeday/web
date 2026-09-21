import type { Publication } from "./types";

function initialsName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const surname = parts.pop() as string;
  const initials = parts.map((p) => `${p[0]}.`).join(" ");
  return initials ? `${initials} ${surname}` : surname;
}

export function formatAuthorsACM(authorNames: string[]): string {
  const formatted = authorNames.map(initialsName);
  if (formatted.length === 0) return "";
  if (formatted.length === 1) return formatted[0];
  if (formatted.length === 2) return `${formatted[0]} and ${formatted[1]}`;
  return `${formatted.slice(0, -1).join(", ")} and ${formatted[formatted.length - 1]}`;
}

function surnameOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  return parts[parts.length - 1] || fullName;
}

export function acmReference(pub: Publication): string {
  const authors = formatAuthorsACM(pub.authors.map((a) => a.name));
  const doiUrl = pub.doi ? `https://doi.org/${pub.doi}` : undefined;

  const parts: string[] = [`${authors}.`, `${pub.year}.`, `${pub.title}.`];

  if (pub.type === "paper") {
    parts.push(
      `In ${pub.venueLong}${pub.venue && pub.venue !== pub.venueLong ? ` (${pub.venue})` : ""}${pub.where ? `, ${pub.where}` : ""}.`,
    );
  } else if (pub.type === "talk" && pub.venueLong) {
    parts.push(`${pub.kind === "panel" ? "Panel" : "Presentation"}, ${pub.venueLong}.`);
  } else if (pub.venueLong) {
    parts.push(`${pub.venueLong}.`);
  }

  if (doiUrl) parts.push(doiUrl);

  return parts.filter(Boolean).join(" ");
}

function bibtexAuthors(authorNames: string[]): string {
  return authorNames
    .map((name) => {
      const parts = name.trim().split(/\s+/);
      const surname = parts.pop() as string;
      return parts.length ? `${surname}, ${parts.join(" ")}` : surname;
    })
    .join(" and ");
}

function bibtexKey(pub: Publication): string {
  const surname = pub.authors[0]
    ? surnameOf(pub.authors[0].name)
        .toLowerCase()
        .replace(/[^a-z]/g, "")
    : "codeday";
  const titleWord =
    pub.title
      .split(/\s+/)
      .map((w) => w.toLowerCase().replace(/[^a-z]/g, ""))
      .find((w) => w.length >= 4) ?? "";
  return `${surname}${pub.year}${titleWord}`;
}

function bibtexEscape(value: string): string {
  return value.replace(/[{}]/g, "");
}

export function bibtex(pub: Publication): string {
  const entryType =
    pub.type === "paper" && pub.kind === "journal"
      ? "article"
      : pub.type === "paper"
        ? "inproceedings"
        : "misc";
  const key = bibtexKey(pub);
  const fields: [string, string | undefined][] = [
    ["title", bibtexEscape(pub.title)],
    ["author", bibtexAuthors(pub.authors.map((a) => a.name))],
    ["year", String(pub.year)],
    [
      entryType === "article"
        ? "journal"
        : entryType === "inproceedings"
          ? "booktitle"
          : "howpublished",
      pub.venueLong || pub.venue,
    ],
    ["doi", pub.doi],
    [
      "url",
      pub.doi ? `https://doi.org/${pub.doi}` : pub.links.find((l) => l.label === "arXiv")?.url,
    ],
  ];

  const body = fields
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([name, value]) => `  ${name} = {${bibtexEscape(value)}}`)
    .join(",\n");

  return `@${entryType}{${key},\n${body}\n}`;
}
