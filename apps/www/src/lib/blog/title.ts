export function splitHighlight(
  title: string,
  highlight: string | null | undefined,
): [string, string, string] | null {
  const phrase = highlight?.trim();
  if (!phrase) return null;
  const index = title.indexOf(phrase);
  if (index === -1) return null;
  return [title.slice(0, index), phrase, title.slice(index + phrase.length)];
}
