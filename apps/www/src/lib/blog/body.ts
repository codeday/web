import type { PullQuoteAttribution, RichTextNode } from "./types";

const WORDS_PER_MINUTE = 230;

function textNodes(node: RichTextNode): RichTextNode[] {
  if (node.nodeType === "text") return [node];
  return (node.content ?? []).flatMap(textNodes);
}

function nonEmptyText(node: RichTextNode): RichTextNode[] {
  return textNodes(node).filter((t) => (t.value ?? "").trim() !== "");
}

function hasMark(node: RichTextNode, mark: string): boolean {
  return (node.marks ?? []).some((m) => m.type === mark);
}

function everyTextHasMark(node: RichTextNode, mark: string): boolean {
  const texts = nonEmptyText(node);
  return texts.length > 0 && texts.every((t) => hasMark(t, mark));
}

export function plainText(node: RichTextNode): string {
  return textNodes(node)
    .map((t) => t.value ?? "")
    .join("");
}

export function readingMinutes(document: RichTextNode | null | undefined): number {
  if (!document) return 1;
  const words = textNodes(document)
    .map((t) => t.value ?? "")
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function isCodeParagraph(node: RichTextNode): boolean {
  return node.nodeType === "paragraph" && everyTextHasMark(node, "code");
}

export function isCaptionParagraph(node: RichTextNode | undefined): boolean {
  return !!node && node.nodeType === "paragraph" && everyTextHasMark(node, "italic");
}

const LEADING_DASH = /^\s*[\p{Pd}−]+\s*/u;

export function isAttributionParagraph(node: RichTextNode): boolean {
  return node.nodeType === "paragraph" && LEADING_DASH.test(plainText(node));
}

export function parseAttribution(text: string): PullQuoteAttribution {
  const cleaned = text.replace(LEADING_DASH, "").trim();
  const [beforeOrg, ...orgParts] = cleaned.split("·");
  const organization = orgParts.join("·").trim() || null;
  const commaIndex = beforeOrg.indexOf(",");
  if (commaIndex === -1) {
    return { name: beforeOrg.trim(), role: null, organization };
  }
  return {
    name: beforeOrg.slice(0, commaIndex).trim(),
    role: beforeOrg.slice(commaIndex + 1).trim() || null,
    organization,
  };
}

export type Highlighter = (code: string) => string;

export function prepareBody(
  document: RichTextNode | null | undefined,
  highlight: Highlighter,
): RichTextNode | null {
  if (!document) return null;
  const input = document.content ?? [];
  const output: RichTextNode[] = [];

  for (let i = 0; i < input.length; i += 1) {
    const node = input[i];

    if (isCodeParagraph(node)) {
      const lines = [plainText(node)];
      while (i + 1 < input.length && isCodeParagraph(input[i + 1])) {
        i += 1;
        lines.push(plainText(input[i]));
      }
      const code = lines.join("\n");
      output.push({ nodeType: "code-block", data: { code, html: highlight(code) } });
      continue;
    }

    if (node.nodeType === "embedded-asset-block") {
      const next = input[i + 1];
      if (isCaptionParagraph(next)) {
        i += 1;
        output.push({ ...node, data: { ...node.data, caption: plainText(next).trim() } });
      } else {
        output.push(node);
      }
      continue;
    }

    if (node.nodeType === "blockquote") {
      const paragraphs = (node.content ?? []).filter((c) => c.nodeType === "paragraph");
      const attribution = paragraphs[paragraphs.length - 1];
      if (paragraphs.length >= 2 && isAttributionParagraph(attribution)) {
        output.push({
          ...node,
          content: paragraphs.slice(0, -1),
          data: { ...node.data, attribution: parseAttribution(plainText(attribution)) },
        });
      } else {
        output.push(node);
      }
      continue;
    }

    output.push(node);
  }

  return { ...document, content: output };
}
