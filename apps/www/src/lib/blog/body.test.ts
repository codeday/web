import { describe, expect, it } from "vitest";

import { parseAttribution, prepareBody, readingMinutes } from "@/lib/blog/body";
import type { RichTextNode } from "@/lib/blog/types";

const text = (value: string, ...marks: string[]): RichTextNode => ({
  nodeType: "text",
  value,
  marks: marks.map((type) => ({ type })),
  data: {},
});
const paragraph = (...content: RichTextNode[]): RichTextNode => ({
  nodeType: "paragraph",
  content,
  data: {},
});
const doc = (...content: RichTextNode[]): RichTextNode => ({
  nodeType: "document",
  content,
  data: {},
});
const asset = (id: string): RichTextNode => ({
  nodeType: "embedded-asset-block",
  content: [],
  data: { target: { sys: { id, type: "Link", linkType: "Asset" } } },
});

const fakeHighlight = (code: string) => `<hl>${code}</hl>`;

describe("prepareBody", () => {
  it("merges consecutive code-only paragraphs into one highlighted block", () => {
    const result = prepareBody(
      doc(
        paragraph(text("const a = 1;", "code")),
        paragraph(text("", ""), text("const b = 2;", "code"), text("")),
        paragraph(text("prose")),
      ),
      fakeHighlight,
    )!;
    expect(result.content).toHaveLength(2);
    expect(result.content![0]).toEqual({
      nodeType: "code-block",
      data: { code: "const a = 1;\nconst b = 2;", html: "<hl>const a = 1;\nconst b = 2;</hl>" },
    });
    expect(result.content![1].nodeType).toBe("paragraph");
  });

  it("leaves paragraphs with inline code alone", () => {
    const result = prepareBody(
      doc(paragraph(text("Run "), text("pnpm dev", "code"), text(" first."))),
      fakeHighlight,
    )!;
    expect(result.content![0].nodeType).toBe("paragraph");
  });

  it("attaches an all-italic paragraph after an image as its caption", () => {
    const result = prepareBody(
      doc(
        asset("img1"),
        paragraph(text("Students at CodeDay ", "italic"), text("Seattle", "italic", "bold")),
      ),
      fakeHighlight,
    )!;
    expect(result.content).toHaveLength(1);
    expect(result.content![0].data).toMatchObject({
      target: { sys: { id: "img1" } },
      caption: "Students at CodeDay Seattle",
    });
  });

  it("keeps a partly italic paragraph after an image as body text", () => {
    const result = prepareBody(
      doc(asset("img1"), paragraph(text("Mostly "), text("italic", "italic"))),
      fakeHighlight,
    )!;
    expect(result.content).toHaveLength(2);
    expect(result.content![0].data?.caption).toBeUndefined();
  });

  it("splits a multi-paragraph blockquote into quote and attribution", () => {
    const result = prepareBody(
      doc({
        nodeType: "blockquote",
        data: {},
        content: [
          paragraph(text("First line.")),
          paragraph(text("Second line.")),
          paragraph(text("— Ada Lovelace, Engineer · Analytical Engines")),
        ],
      }),
      fakeHighlight,
    )!;
    const quote = result.content![0];
    expect(quote.content).toHaveLength(2);
    expect(quote.data?.attribution).toEqual({
      name: "Ada Lovelace",
      role: "Engineer",
      organization: "Analytical Engines",
    });
  });

  it.each([
    ["hyphen-minus", "-"],
    ["double hyphen-minus", "--"],
    ["hyphen", "\u2010"],
    ["non-breaking hyphen", "\u2011"],
    ["figure dash", "\u2012"],
    ["en dash", "\u2013"],
    ["em dash", "\u2014"],
    ["horizontal bar", "\u2015"],
    ["two-em dash", "\u2E3A"],
    ["small em dash", "\uFE58"],
    ["fullwidth hyphen-minus", "\uFF0D"],
    ["minus sign", "\u2212"],
  ])("treats a last paragraph starting with a %s as the attribution", (_name, dash) => {
    const result = prepareBody(
      doc({
        nodeType: "blockquote",
        data: {},
        content: [paragraph(text("A quote.")), paragraph(text(`${dash}Grace Hopper, Admiral`))],
      }),
      fakeHighlight,
    )!;
    expect(result.content![0].content).toHaveLength(1);
    expect(result.content![0].data?.attribution).toEqual({
      name: "Grace Hopper",
      role: "Admiral",
      organization: null,
    });
  });

  it("keeps every paragraph of a multi-paragraph blockquote without a dash as quote text", () => {
    const result = prepareBody(
      doc({
        nodeType: "blockquote",
        data: {},
        content: [
          paragraph(text("First paragraph.")),
          paragraph(text("Respect, encourage, and support others.")),
        ],
      }),
      fakeHighlight,
    )!;
    expect(result.content![0].data?.attribution).toBeUndefined();
    expect(result.content![0].content).toHaveLength(2);
  });

  it("gives a single-paragraph blockquote no attribution", () => {
    const result = prepareBody(
      doc({ nodeType: "blockquote", data: {}, content: [paragraph(text("— Just a quote."))] }),
      fakeHighlight,
    )!;
    expect(result.content![0].data?.attribution).toBeUndefined();
    expect(result.content![0].content).toHaveLength(1);
  });
});

describe("parseAttribution", () => {
  it("handles a bare name with a leading dash", () => {
    expect(parseAttribution("— Grace Hopper")).toEqual({
      name: "Grace Hopper",
      role: null,
      organization: null,
    });
  });

  it("handles a name and organization without a role", () => {
    expect(parseAttribution("Grace Hopper · US Navy")).toEqual({
      name: "Grace Hopper",
      role: null,
      organization: "US Navy",
    });
  });
});

describe("readingMinutes", () => {
  it("rounds up and never returns less than one minute", () => {
    expect(readingMinutes(doc(paragraph(text("short"))))).toBe(1);
    const long = Array.from({ length: 461 }, () => "word").join(" ");
    expect(readingMinutes(doc(paragraph(text(long))))).toBe(3);
    expect(readingMinutes(null)).toBe(1);
  });
});
