/**
 * Machine-translates, with DeepL, every localized Contentful entry field that
 * has a value in the default locale but none in some other locale. Existing
 * translations are never touched, even if the source has changed since.
 *
 * Locales, content types and fields are all read from Contentful at runtime.
 * Each Contentful locale is mapped to the closest DeepL target language (e.g.
 * `es-MX` → `ES-419`). Fields restricted to fixed values (`in`/`regexp`
 * validations) and values that are URLs or emails are skipped. Entries that
 * were published with no pending changes are republished after updating;
 * entries with unpublished drafts are only updated, so drafts don't go live.
 *
 * Local-only tool — run from packages/i18n with:
 *   pnpm translate:contentful [--dry-run] [--content-type <id>]
 *
 * Requires CONTENTFUL_SPACE_ID, CONTENTFUL_MANAGEMENT_TOKEN and
 * INLANG_DEEPL_API_KEY (CONTENTFUL_ENVIRONMENT defaults to master), e.g. in
 * packages/i18n/.env.
 */
import { parseArgs } from "node:util";

import { createClient } from "contentful-management";

import "./deepl-fetch.mjs";
import {
  deepLApiKey,
  deepLRequest,
  deepLTargets,
  escapeXml,
  toDeepLTarget,
  unescapeXml,
} from "./deepl.mjs";

const { values: args } = parseArgs({
  options: {
    "dry-run": { type: "boolean", default: false },
    "content-type": { type: "string" },
  },
});

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT, CONTENTFUL_MANAGEMENT_TOKEN } = process.env;
if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_MANAGEMENT_TOKEN) {
  console.error("CONTENTFUL_SPACE_ID and CONTENTFUL_MANAGEMENT_TOKEN must be set.");
  process.exit(1);
}
deepLApiKey();

const client = createClient(
  { accessToken: CONTENTFUL_MANAGEMENT_TOKEN },
  {
    type: "plain",
    defaults: { spaceId: CONTENTFUL_SPACE_ID, environmentId: CONTENTFUL_ENVIRONMENT || "master" },
  },
);

const DEEPL_BATCH_TEXTS = 50;
const DEEPL_BATCH_CHARS = 100_000;
const SYMBOL_MAX_LENGTH = 256;
const ENTRIES_PAGE_SIZE = 100;

const LITERAL = /^(\s*(https?:\/\/|mailto:|tel:|www\.)\S*|\S+@\S+\.\S+)\s*$/i;
const PROTECTED = /`[^`\n]*`|<[^<>\n]+>|\]\([^()\n]*\)|https?:\/\/[^\s<>()]+|\{[^{}\s]*\}/g;
const MARKDOWN_PREFIX = /^(\s*(?:(?:[-*+]|\d+[.)]|#{1,6}|>)\s+)*)/;

const isEmpty = (value) =>
  value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length);
const hasWords = (text) => /\p{L}/u.test(text);

// Plain strings go to DeepL as XML, with anything that must survive verbatim
// (code, HTML, link targets, URLs, {placeholders}) swapped for <x i="n"/>.
function encodeText(text) {
  const slots = [];
  let xml = "";
  let last = 0;
  for (const match of text.matchAll(PROTECTED)) {
    xml += `${escapeXml(text.slice(last, match.index))}<x i="${slots.length}"/>`;
    slots.push(match[0]);
    last = match.index + match[0].length;
  }
  return { xml: xml + escapeXml(text.slice(last)), slots };
}

const decodeText = (xml, slots) =>
  unescapeXml(xml.replace(/<x i="(\d+)"\s*\/>|<x i="(\d+)"><\/x>/g, (_, a, b) => slots[a ?? b]));

function planString(text) {
  if (!hasWords(text) || LITERAL.test(text)) return null;
  const { xml, slots } = encodeText(text);
  return { segments: [xml], build: ([translated]) => decodeText(translated, slots) };
}

// Markdown is translated line by line, keeping list/heading/quote markers out
// of DeepL, so block structure can't be rearranged or lost.
function planMarkdown(text) {
  const lines = text.split("\n").map((line) => {
    const [prefix] = line.match(MARKDOWN_PREFIX);
    const body = line.slice(prefix.length);
    return { prefix, body, plan: planString(body) };
  });
  const translatable = lines.filter((line) => line.plan);
  if (!translatable.length) return null;
  return {
    segments: translatable.map((line) => line.plan.segments[0]),
    build: (translations) => {
      const built = new Map(
        translatable.map((line, i) => [line, line.plan.build([translations[i]])]),
      );
      return lines.map((line) => line.prefix + (built.get(line) ?? line.body)).join("\n");
    },
  };
}

function planArray(items) {
  const plans = items.map((item) => (typeof item === "string" ? planString(item) : null));
  if (!plans.some(Boolean)) return null;
  return {
    segments: plans.filter(Boolean).map((plan) => plan.segments[0]),
    build: (translations) => {
      let next = 0;
      return items.map((item, i) => (plans[i] ? plans[i].build([translations[next++]]) : item));
    },
  };
}

// Rich text: each block holding text is one DeepL segment. Text nodes become
// <t i="n">, inline nodes with content (links) <n i="n">, and empty inline
// nodes (embedded entries) <x i="n"/>, so marks and links survive reordering.
function textBlocks(node, blocks = []) {
  if (!node.content) return blocks;
  if (node.content.some((child) => child.nodeType === "text")) blocks.push(node);
  else node.content.forEach((child) => textBlocks(child, blocks));
  return blocks;
}

function encodeInline(nodes, slots) {
  return nodes
    .map((node) => {
      const i = slots.push(node) - 1;
      if (node.nodeType === "text") return `<t i="${i}">${escapeXml(node.value)}</t>`;
      if (node.content?.length) return `<n i="${i}">${encodeInline(node.content, slots)}</n>`;
      return `<x i="${i}"/>`;
    })
    .join("");
}

function decodeInline(xml, slots) {
  const root = { content: [] };
  const stack = [root];
  const top = () => stack[stack.length - 1];
  const addText = (value) => {
    if (!value) return;
    const parent = top();
    const template = parent.textSlot ?? { nodeType: "text", marks: [], data: {} };
    parent.content.push({ ...template, value: unescapeXml(value) });
  };
  let last = 0;
  for (const match of xml.matchAll(/<(\/?)([tnx])(?: i="(\d+)")?\s*(\/?)>/g)) {
    addText(xml.slice(last, match.index));
    last = match.index + match[0].length;
    const [, closing, tag, index, selfClosing] = match;
    if (closing) {
      if (stack.length > 1) stack.pop();
    } else if (tag === "x" || selfClosing) {
      top().content.push(structuredClone(slots[index]));
    } else if (tag === "t") {
      stack.push({ content: top().content, textSlot: slots[index] });
    } else {
      const node = { ...structuredClone(slots[index]), content: [] };
      top().content.push(node);
      stack.push(node);
    }
  }
  addText(xml.slice(last));
  return root.content;
}

const emptyText = () => ({ nodeType: "text", value: "", marks: [], data: {} });
const plainText = (node) => node.value ?? (node.content ?? []).map(plainText).join("");
const translatableBlocks = (document) =>
  textBlocks(document).filter((block) => hasWords(plainText(block)));

// Contentful expects text nodes at both ends of a block and of a link.
function withTextEdges(nodes) {
  const edged = nodes.map((node) =>
    node.content?.length ? { ...node, content: withTextEdges(node.content) } : node,
  );
  if (edged[0]?.nodeType !== "text") edged.unshift(emptyText());
  if (edged.at(-1).nodeType !== "text") edged.push(emptyText());
  return edged;
}

function planRichText(document) {
  const encoded = translatableBlocks(document).map((block) => {
    const slots = [];
    return { xml: encodeInline(block.content, slots), slots };
  });
  if (!encoded.length) return null;
  return {
    segments: encoded.map(({ xml }) => xml),
    build: (translations) => {
      const copy = structuredClone(document);
      translatableBlocks(copy).forEach((block, i) => {
        block.content = withTextEdges(decodeInline(translations[i], encoded[i].slots));
      });
      return copy;
    },
  };
}

const restrictsValues = (validations = []) =>
  validations.some((validation) => validation.in || validation.regexp);

function translatableFields(contentType) {
  return contentType.fields.filter((field) => {
    if (!field.localized || field.disabled || field.omitted) return false;
    if (field.type === "Symbol" || field.type === "Text")
      return !restrictsValues(field.validations);
    if (field.type === "RichText") return true;
    if (field.type === "Array" && field.items?.type === "Symbol") {
      return !restrictsValues(field.items.validations);
    }
    return false;
  });
}

function planField(field, value) {
  if (field.type === "Symbol") return typeof value === "string" ? planString(value) : null;
  if (field.type === "Text") return typeof value === "string" ? planMarkdown(value) : null;
  if (field.type === "Array") return Array.isArray(value) ? planArray(value) : null;
  if (field.type === "RichText") return value?.nodeType === "document" ? planRichText(value) : null;
  return null;
}

function sizeProblem(field, value) {
  if (typeof value !== "string") return null;
  const { max } = field.validations?.find((validation) => validation.size)?.size ?? {};
  const limit = Math.min(max ?? Infinity, field.type === "Symbol" ? SYMBOL_MAX_LENGTH : Infinity);
  return value.length > limit ? `${value.length} characters exceeds the ${limit} limit` : null;
}

async function translateSegments(segments, sourceLang, targetLang) {
  const translations = [];
  let batch = [];
  let batchChars = 0;
  const flush = async () => {
    if (!batch.length) return;
    const { translations: result } = await deepLRequest("translate", {
      text: batch,
      source_lang: sourceLang,
      target_lang: targetLang,
      tag_handling: "xml",
      ignore_tags: ["x"],
      preserve_formatting: true,
    });
    translations.push(...result.map(({ text }) => text));
    batch = [];
    batchChars = 0;
  };
  for (const segment of segments) {
    if (batch.length >= DEEPL_BATCH_TEXTS || batchChars + segment.length > DEEPL_BATCH_CHARS) {
      await flush();
    }
    batch.push(segment);
    batchChars += segment.length;
  }
  await flush();
  return translations;
}

async function* allEntries(contentTypeId) {
  for (let skip = 0; ; skip += ENTRIES_PAGE_SIZE) {
    const { items, total } = await client.entry.getMany({
      query: {
        content_type: contentTypeId,
        order: "sys.id",
        "sys.archivedAt[exists]": false,
        limit: ENTRIES_PAGE_SIZE,
        skip,
      },
    });
    yield* items;
    if (skip + ENTRIES_PAGE_SIZE >= total) return;
  }
}

const { items: locales } = await client.locale.getMany({ query: { limit: 1000 } });
const sourceLocale = locales.find((locale) => locale.default);
const sourceLang = sourceLocale.code.split("-")[0].toUpperCase();
const supported = await deepLTargets();
const targets = locales
  .filter((locale) => !locale.default && locale.contentManagementApi)
  .map((locale) => ({ code: locale.code, deepL: toDeepLTarget(locale.code, supported) }));

const unmapped = targets.filter((target) => !target.deepL);
if (unmapped.length) {
  console.error(
    `No DeepL target language for: ${unmapped.map((target) => target.code).join(", ")}. ` +
      "Add an alias in scripts/deepl.mjs.",
  );
  process.exit(1);
}
for (const target of targets) console.log(`${target.code} → DeepL ${target.deepL}`);

const { items: contentTypes } = await client.contentType.getMany({ query: { limit: 1000 } });
const plannedTypes = contentTypes
  .filter((contentType) => !args["content-type"] || contentType.sys.id === args["content-type"])
  .map((contentType) => ({ contentType, fields: translatableFields(contentType) }))
  .filter(({ fields }) => fields.length);

const stats = { entries: 0, fields: 0, characters: 0, skipped: 0, failed: 0 };

for (const { contentType, fields } of plannedTypes) {
  for await (const entry of allEntries(contentType.sys.id)) {
    const updates = [];
    for (const field of fields) {
      const values = entry.fields[field.id] ?? {};
      const missing = targets.filter((target) => isEmpty(values[target.code]));
      const plan = missing.length && planField(field, values[sourceLocale.code]);
      if (plan) updates.push({ field, missing, plan });
    }
    if (!updates.length) continue;

    const label = `${contentType.sys.id}/${entry.sys.id}`;
    const characters = updates.reduce(
      (sum, { plan, missing }) => sum + plan.segments.join("").length * missing.length,
      0,
    );
    stats.characters += characters;
    if (args["dry-run"]) {
      for (const { field, missing } of updates) {
        console.log(`${label} ${field.id}: ${missing.map((target) => target.code).join(", ")}`);
      }
      stats.entries += 1;
      stats.fields += updates.reduce((sum, { missing }) => sum + missing.length, 0);
      continue;
    }

    try {
      const wasPublished =
        entry.sys.publishedVersion && entry.sys.version === entry.sys.publishedVersion + 1;
      let changed = 0;
      for (const target of targets) {
        const pending = updates.filter(({ missing }) => missing.includes(target));
        if (!pending.length) continue;
        const translations = await translateSegments(
          pending.flatMap(({ plan }) => plan.segments),
          sourceLang,
          target.deepL,
        );
        for (const { field, plan } of pending) {
          const value = plan.build(translations.splice(0, plan.segments.length));
          const problem = sizeProblem(field, value);
          if (problem) {
            console.warn(`${label} ${field.id} ${target.code}: skipped, ${problem}`);
            stats.skipped += 1;
            continue;
          }
          entry.fields[field.id] = { ...entry.fields[field.id], [target.code]: value };
          changed += 1;
        }
      }
      if (!changed) continue;
      const updated = await client.entry.update({ entryId: entry.sys.id }, entry);
      if (wasPublished) await client.entry.publish({ entryId: entry.sys.id }, updated);
      console.log(`${label}: ${changed} translation(s)${wasPublished ? ", published" : ""}`);
      stats.entries += 1;
      stats.fields += changed;
    } catch (error) {
      console.error(`${label}: failed, ${error.message}`);
      stats.failed += 1;
    }
  }
}

console.log(
  `${args["dry-run"] ? "Would translate" : "Translated"} ${stats.fields} field value(s) in ` +
    `${stats.entries} entr${stats.entries === 1 ? "y" : "ies"} ` +
    `(~${stats.characters.toLocaleString()} DeepL characters)` +
    (stats.skipped ? `, ${stats.skipped} skipped` : "") +
    (stats.failed ? `, ${stats.failed} entr${stats.failed === 1 ? "y" : "ies"} failed` : ""),
);
process.exit(stats.failed ? 1 : 0);
