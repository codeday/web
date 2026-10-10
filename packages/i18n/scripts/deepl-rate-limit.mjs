/**
 * Preloaded into `inlang machine translate` by translate.mjs. The CLI's DeepL
 * provider sends every message at once with no retries, which DeepL answers
 * with 429 Too Many Requests. This caps concurrent DeepL requests and retries
 * 429/5xx responses, honouring `Retry-After`.
 */
const MAX_CONCURRENT = 2;
const MAX_RETRIES = 8;
const BASE_DELAY_MS = 1000;

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

function isDeepL(input) {
  const url = input instanceof Request ? input.url : String(input);
  return new URL(url).hostname.endsWith("deepl.com");
}

globalThis.fetch = async (input, init) => {
  if (!isDeepL(input)) return realFetch(input, init);
  await acquire();
  try {
    for (let attempt = 0; ; attempt += 1) {
      const response = await realFetch(input, init);
      const retryable = response.status === 429 || response.status >= 500;
      if (!retryable || attempt >= MAX_RETRIES) return response;
      const retryAfter = Number(response.headers.get("retry-after"));
      await sleep(retryAfter > 0 ? retryAfter * 1000 : BASE_DELAY_MS * 2 ** attempt);
    }
  } finally {
    release();
  }
};
