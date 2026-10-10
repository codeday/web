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
 * occurrence is wrapped in a tag DeepL leaves alone before sending
 * (`translate="no"` for HTML tag handling, an ignored tag for XML), and
 * unwrapped in the response. HTML-mode responses also get their character
 * references decoded.
 */
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
const WRAPPERS = {
  html: { open: '<span translate="no">', close: "</span>" },
  xml: { open: `<${KEEP_TAG}>`, close: `</${KEEP_TAG}>` },
};
const UNWRAP = new RegExp(
  Object.values(WRAPPERS)
    .map(({ open, close }) => `${open}\\s*(${PROTECTED_TERMS.join("|")})\\s*${close}`)
    .join("|"),
  "g",
);

function prepareTranslateRequest(init) {
  let body;
  try {
    body = JSON.parse(init?.body);
  } catch {
    return { init, mode: undefined };
  }
  body.context ??= CONTEXT;
  body.formality ??= FORMALITY;
  const wrapper = WRAPPERS[body.tag_handling];
  if (wrapper && Array.isArray(body.text)) {
    body.text = body.text.map((text) =>
      text.replace(TERM_PATTERN, `${wrapper.open}$1${wrapper.close}`),
    );
    if (body.tag_handling === "xml") body.ignore_tags = [...(body.ignore_tags ?? []), KEEP_TAG];
  }
  return { init: { ...init, body: JSON.stringify(body) }, mode: body.tag_handling };
}

// The CLI sends HTML-mode text unescaped, so any character reference DeepL
// returns (it writes apostrophes as `&#x27;`) would be stored literally.
// `<`, `>` and `&` stay encoded so they can't be mistaken for markup.
const decodeCharacterReferences = (text) =>
  text.replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (reference, code) => {
    const char = String.fromCodePoint(
      code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : parseInt(code, 10),
    );
    return "<>&".includes(char) ? reference : char;
  });

async function cleanTranslations(response, mode) {
  if (!response.ok) return response;
  const json = await response.json();
  for (const translation of json.translations ?? []) {
    translation.text = translation.text.replace(UNWRAP, (_, ...terms) => terms.find(Boolean));
    if (mode === "html") translation.text = decodeCharacterReferences(translation.text);
  }
  return new Response(JSON.stringify(json), {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

globalThis.fetch = async (input, init) => {
  if (!isDeepL(input)) return realFetch(input, init);
  const { init: preparedInit, mode } = isTranslate(input)
    ? prepareTranslateRequest(init)
    : { init, mode: undefined };
  await acquire();
  try {
    for (let attempt = 0; ; attempt += 1) {
      const response = await realFetch(input, preparedInit);
      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable || attempt >= MAX_RETRIES) {
        return WRAPPERS[mode] ? cleanTranslations(response, mode) : response;
      }
      const retryAfter = Number(response.headers.get("retry-after"));
      await sleep(retryAfter > 0 ? retryAfter * 1000 : BASE_DELAY_MS * 2 ** attempt);
    }
  } finally {
    release();
  }
};
