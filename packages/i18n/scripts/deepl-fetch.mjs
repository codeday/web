/**
 * Preloaded into `inlang machine translate` by translate.mjs, and imported by
 * translate-contentful.mjs, so it sees every DeepL request either makes.
 *
 * The CLI's DeepL provider sends every message at once with no retries, which
 * DeepL answers with 429 Too Many Requests. This caps concurrent DeepL
 * requests and retries 429/5xx responses, honouring `Retry-After`.
 *
 * Every translate request gets the site-wide CONTEXT and FORMALITY unless it
 * sets its own. PROTECTED_TERMS (brand names) are kept untranslated: each
 * occurrence is wrapped in a tag DeepL ignores before sending, and unwrapped
 * in the response.
 *
 * The CLI's own requests (the only ones using HTML tag handling) are re-encoded
 * as XML before sending; see `encodeInlangMessage`.
 */
import { escapeXml, unescapeXml } from "./deepl.mjs";

const MAX_CONCURRENT = 2;
const MAX_RETRIES = 8;
const BASE_DELAY_MS = 1000;
const PROTECTED_TERMS = ["CodeDay"];
const KEEP_TAG = "keep";
const CONTEXT =
  "Website copy for CodeDay, a nonprofit founded in 2009 that connects students to real-world " +
  "technology work. Its programs include events where students build software projects, " +
  "micro-internships contributing to open-source software, and career mentoring with industry " +
  "engineers. Readers are students, parents, educators, volunteers, and employers. The text is " +
  'mostly short interface labels, headings, and promotional copy. "CodeDay" is the ' +
  "organization's name.";
// `prefer_more` falls back to the default for languages without a formal
// register (e.g. Chinese), where `more` would make DeepL reject the request.
const FORMALITY = "prefer_more";

const realFetch = globalThis.fetch;
const waiting = [];
let active = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function acquire() {
  if (active < MAX_CONCURRENT) {
    active += 1;
    return;
  }
  await new Promise((resolve) => waiting.push(resolve));
}

function release() {
  const next = waiting.shift();
  if (next) next();
  else active -= 1;
}

const requestUrl = (input) => new URL(input instanceof Request ? input.url : String(input));
const isDeepL = (input) => requestUrl(input).hostname.endsWith("deepl.com");
const isTranslate = (input) => requestUrl(input).pathname.endsWith("/translate");

const TERM_PATTERN = new RegExp(`\\b(${PROTECTED_TERMS.join("|")})`, "g");
const UNWRAP_TERMS = new RegExp(
  `<${KEEP_TAG}>\\s*(${PROTECTED_TERMS.join("|")})\\s*</${KEEP_TAG}>`,
  "g",
);

// The CLI sends a message as one HTML string with line breaks as
// `<inlang-LineFeed>`/`<inlang-CarriageReturn>` and each placeholder or markup
// element as a `<span class="notranslate">` holding its JSON, then parses the
// reply with exact string matching. DeepL lowercases the line-break tags and
// adds closing tags for them, and sometimes leaks a span's JSON into the text,
// so neither survives. Instead, each line becomes its own XML segment (DeepL
// can't move or drop the breaks between segments), placeholders become
// `<x i="n"/>`, and markup pairs become `<m i="n">…</m>` so they stay around
// the phrase they wrap. The reply is rebuilt in the CLI's format, and refused
// if any element was lost or duplicated, so a mangled translation is reported
// as a failure instead of being saved.
const INLANG_BREAKS = /((?:<inlang-(?:LineFeed|CarriageReturn)>)+)/;
const INLANG_ELEMENT = /<span class="notranslate">(.*?)<\/span>/g;
const ENCODED_ELEMENT = /<x i="(\d+)"\s*\/>|<x i="(\d+)"><\/x>|<m i="(\d+)">|<\/m>/g;
const NONCHARACTER = /[﷐-﷯]/;

function parseElements(line) {
  const elements = [];
  const pieces = [];
  let last = 0;
  for (const match of line.matchAll(INLANG_ELEMENT)) {
    pieces.push(line.slice(last, match.index));
    let parsed = {};
    try {
      parsed = JSON.parse(match[1]);
    } catch {}
    pieces.push(elements.push({ source: match[0], type: parsed.type, name: parsed.name }) - 1);
    last = match.index + match[0].length;
  }
  pieces.push(line.slice(last));

  const open = [];
  elements.forEach((element, i) => {
    if (element.type === "markup-start") open.push(i);
    else if (element.type === "markup-end" && elements[open.at(-1)]?.name === element.name) {
      elements[open.pop()].end = i;
      element.paired = true;
    }
  });
  return { elements, pieces };
}

function encodeLine(line) {
  const { elements, pieces } = parseElements(line);
  const xml = pieces
    .map((piece) => {
      if (typeof piece === "string") return escapeXml(piece);
      if (elements[piece].end !== undefined) return `<m i="${piece}">`;
      if (elements[piece].paired) return "</m>";
      return `<x i="${piece}"/>`;
    })
    .join("");
  return { xml, elements };
}

function decodeLine(xml, elements) {
  const seen = new Set();
  const open = [];
  let text = "";
  let last = 0;
  const addText = (value) => {
    if (/[<>]/.test(value) || NONCHARACTER.test(value)) throw new Error("unexpected markup");
    text += unescapeXml(value);
  };
  for (const match of xml.matchAll(ENCODED_ELEMENT)) {
    addText(xml.slice(last, match.index));
    last = match.index + match[0].length;
    if (match[0] === "</m>") {
      const start = open.pop();
      if (start === undefined) throw new Error("unbalanced markup");
      text += elements[elements[start].end].source;
      continue;
    }
    const i = Number(match[1] ?? match[2] ?? match[3]);
    const isMarkup = match[3] !== undefined;
    if (!elements[i] || seen.has(i) || isMarkup !== (elements[i].end !== undefined)) {
      throw new Error(`unexpected placeholder ${i}`);
    }
    seen.add(i);
    if (isMarkup) open.push(i);
    text += elements[i].source;
  }
  addText(xml.slice(last));
  const expected = elements.filter((element) => !element.paired).length;
  if (open.length > 0 || seen.size !== expected) throw new Error("missing placeholder");
  return text;
}

function encodeInlangMessage(message) {
  const parts = message.split(INLANG_BREAKS).map((part, index) => {
    if (index % 2 === 1) return { separator: part };
    const [, lead, body, trail] = part.match(/^(\s*)([\s\S]*?)(\s*)$/);
    return { lead, trail, body, ...(body && encodeLine(body)) };
  });
  return {
    segments: parts.filter((part) => part.xml).map((part) => part.xml),
    build: (translations) => {
      let next = 0;
      return parts
        .map((part) => {
          if (part.separator) return part.separator;
          if (!part.xml) return part.lead + part.trail;
          return part.lead + decodeLine(translations[next++].trim(), part.elements) + part.trail;
        })
        .join("");
    },
  };
}

function encodeInlangRequest(body) {
  const messages = body.text.map(encodeInlangMessage);
  body.text = messages.flatMap((message) => message.segments);
  body.tag_handling = "xml";
  body.ignore_tags = [...(body.ignore_tags ?? []), "x"];
  body.preserve_formatting ??= true;
  return (texts) => {
    let next = 0;
    return messages.map((message) =>
      message.build(texts.slice(next, (next += message.segments.length))),
    );
  };
}

function prepareTranslateRequest(init) {
  let body;
  try {
    body = JSON.parse(init?.body);
  } catch {
    return { init };
  }
  if (!Array.isArray(body.text)) return { init };
  body.context ??= CONTEXT;
  body.formality ??= FORMALITY;
  const rebuild = body.tag_handling === "html" ? encodeInlangRequest(body) : undefined;
  if (body.tag_handling === "xml") {
    body.text = body.text.map((text) =>
      text.replace(TERM_PATTERN, `<${KEEP_TAG}>$1</${KEEP_TAG}>`),
    );
    body.ignore_tags = [...(body.ignore_tags ?? []), KEEP_TAG];
  }
  return { init: { ...init, body: JSON.stringify(body) }, cleaned: true, rebuild };
}

async function cleanTranslations(response, rebuild) {
  if (!response.ok) return response;
  const json = await response.json();
  const translations = json.translations ?? [];
  for (const translation of translations) {
    translation.text = translation.text.replace(UNWRAP_TERMS, "$1");
  }
  if (rebuild) {
    try {
      const texts = rebuild(translations.map((translation) => translation.text));
      json.translations = texts.map((text) => ({ ...translations[0], text }));
    } catch (error) {
      return new Response(null, {
        status: 502,
        statusText: `DeepL mangled the message (${error.message})`,
      });
    }
  }
  return new Response(JSON.stringify(json), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

globalThis.fetch = async (input, init) => {
  if (!isDeepL(input)) return realFetch(input, init);
  const {
    init: preparedInit,
    cleaned,
    rebuild,
  } = isTranslate(input) ? prepareTranslateRequest(init) : { init };
  await acquire();
  try {
    for (let attempt = 0; ; attempt += 1) {
      const response = await realFetch(input, preparedInit);
      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable || attempt >= MAX_RETRIES) {
        return cleaned ? cleanTranslations(response, rebuild) : response;
      }
      const retryAfter = Number(response.headers.get("retry-after"));
      await sleep(retryAfter > 0 ? retryAfter * 1000 : BASE_DELAY_MS * 2 ** attempt);
    }
  } finally {
    release();
  }
};
