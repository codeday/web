const DEEPL_ALIASES = {
  "zh-tw": "zh-hant",
  "zh-hk": "zh-hant",
  "zh-mo": "zh-hant",
  "zh-cn": "zh-hans",
  "zh-sg": "zh-hans",
};

export function deepLApiKey() {
  const apiKey = process.env.INLANG_DEEPL_API_KEY;
  if (!apiKey) throw new Error("INLANG_DEEPL_API_KEY must be set to translate with DeepL");
  return apiKey;
}

export function deepLUrl(endpoint) {
  const host = deepLApiKey().endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com";
  return `https://${host}/v2/${endpoint}`;
}

export async function deepLRequest(endpoint, body) {
  const response = await fetch(deepLUrl(endpoint), {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `DeepL-Auth-Key ${deepLApiKey()}`,
      ...(body && { "Content-Type": "application/json" }),
    },
    body: body && JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`DeepL /v2/${endpoint}: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

export async function deepLTargets() {
  const languages = await deepLRequest("languages?type=target");
  return new Map(languages.map(({ language }) => [language.toLowerCase(), language]));
}

/** The closest DeepL target language for `locale` (e.g. `es-MX` → `ES-419`), if any. */
export function toDeepLTarget(locale, supported) {
  const lower = locale.toLowerCase();
  const [language, region] = lower.split("-");
  const latinAmericanSpanish =
    language === "es" && region && region !== "es" ? "es-419" : undefined;
  return [lower, DEEPL_ALIASES[lower], latinAmericanSpanish, language]
    .filter(Boolean)
    .map((candidate) => supported.get(candidate))
    .find(Boolean);
}
