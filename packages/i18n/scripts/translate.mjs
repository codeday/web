/**
 * Machine-translates every message that is missing from a non-base locale, or
 * whose base-locale source text changed since it was translated.
 *
 * `messages/.fingerprints.json` records, per locale and key, a hash of the
 * source text each translation was made from. A translation whose recorded
 * hash no longer matches the source is deleted so `inlang machine translate`
 * (which only fills gaps) translates it again. Translations with no recorded
 * hash, e.g. hand-written ones, are adopted as-is.
 *
 * Fingerprints are written only here, after translating — never update them
 * by hand alongside a source edit, or the change goes undetected.
 *
 * The CLI sends a locale's name to the provider unchanged, so with DeepL each
 * locale is translated in a temporary copy of the project whose locale is
 * renamed to the closest code DeepL supports (e.g. `es-mx` → `ES-419`).
 */
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.join(import.meta.dirname, "..");
const PROJECT = path.join(ROOT, "project.inlang");
const FINGERPRINTS = path.join(ROOT, "messages/.fingerprints.json");
const RATE_LIMIT = pathToFileURL(path.join(import.meta.dirname, "deepl-rate-limit.mjs")).href;

const settings = JSON.parse(await readFile(path.join(PROJECT, "settings.json"), "utf8"));
const { baseLocale, locales } = settings;
const targetLocales = locales.filter((locale) => locale !== baseLocale);
const pathPattern = settings["plugin.inlang.messageFormat"].pathPattern;
const messagesPath = (locale, root = ROOT) =>
  path.join(root, pathPattern.replace("{locale}", locale));

const DEEPL_ALIASES = {
  "zh-tw": "zh-hant",
  "zh-hk": "zh-hant",
  "zh-mo": "zh-hant",
  "zh-cn": "zh-hans",
  "zh-sg": "zh-hans",
};

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

const writeJson = (file, data) => writeFile(file, `${JSON.stringify(data, null, 2)}\n`);

const fingerprint = (text) =>
  createHash("sha256").update(JSON.stringify(text)).digest("hex").slice(0, 16);

if (targetLocales.length === 0) {
  console.log("No target locales configured; nothing to translate.");
  process.exit(0);
}

const source = await readJson(messagesPath(baseLocale));
const sourceFingerprints = Object.fromEntries(
  Object.entries(source).map(([key, text]) => [key, fingerprint(text)]),
);
const fingerprints = await readJson(FINGERPRINTS);

for (const locale of targetLocales) {
  const messages = await readJson(messagesPath(locale));
  const recorded = fingerprints[locale] ?? {};
  const stale = Object.keys(messages).filter(
    (key) => !(key in source) || (key in recorded && recorded[key] !== sourceFingerprints[key]),
  );
  for (const key of stale) delete messages[key];
  if (stale.length > 0) {
    console.log(`${locale}: retranslating ${stale.length} changed or removed message(s)`);
    await writeJson(messagesPath(locale), messages);
  }
}

async function deepLTargets() {
  const apiKey = process.env.INLANG_DEEPL_API_KEY;
  if (!apiKey) throw new Error("INLANG_DEEPL_API_KEY must be set to translate with DeepL");
  const host = apiKey.endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com";
  const response = await fetch(`https://${host}/v2/languages?type=target`, {
    headers: { Authorization: `DeepL-Auth-Key ${apiKey}` },
  });
  if (!response.ok)
    throw new Error(`DeepL /v2/languages: ${response.status} ${response.statusText}`);
  const languages = await response.json();
  return new Map(languages.map(({ language }) => [language.toLowerCase(), language]));
}

function toDeepLTarget(locale, supported) {
  const lower = locale.toLowerCase();
  const [language, region] = lower.split("-");
  const latinAmericanSpanish =
    language === "es" && region && region !== "es" ? "es-419" : undefined;
  return [lower, DEEPL_ALIASES[lower], latinAmericanSpanish, language]
    .filter(Boolean)
    .map((candidate) => supported.get(candidate))
    .find(Boolean);
}

function machineTranslate(project, targets) {
  const { status } = spawnSync(
    "inlang",
    [
      "machine",
      "translate",
      "--project",
      project,
      "--locale",
      baseLocale,
      "--targetLocales",
      targets.join(","),
      "--quiet",
      "--nobar",
    ],
    {
      stdio: "inherit",
      cwd: ROOT,
      env: {
        ...process.env,
        NODE_OPTIONS: [process.env.NODE_OPTIONS, `--import ${RATE_LIMIT}`]
          .filter(Boolean)
          .join(" "),
      },
    },
  );
  return status === 0;
}

async function machineTranslateAs(locale, providerLocale) {
  const root = await mkdtemp(path.join(tmpdir(), "inlang-translate-"));
  try {
    const project = path.join(root, "project.inlang");
    await mkdir(project);
    await mkdir(path.dirname(messagesPath(providerLocale, root)), { recursive: true });
    await writeJson(path.join(project, "settings.json"), {
      ...settings,
      locales: [baseLocale, providerLocale],
    });
    await writeJson(messagesPath(baseLocale, root), source);
    await writeJson(messagesPath(providerLocale, root), await readJson(messagesPath(locale)));
    const ok = machineTranslate(project, [providerLocale]);
    await writeJson(messagesPath(locale), await readJson(messagesPath(providerLocale, root)));
    return ok;
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

let translateOk = true;
if (process.env.INLANG_MACHINE_TRANSLATE_PROVIDER === "deepl") {
  const supported = await deepLTargets();
  for (const locale of targetLocales) {
    const target = toDeepLTarget(locale, supported);
    if (!target) {
      console.error(`${locale}: no DeepL target language matches; add it to DEEPL_ALIASES`);
      translateOk = false;
      continue;
    }
    if (target.toLowerCase() !== locale.toLowerCase())
      console.log(`${locale}: translating as DeepL ${target}`);
    translateOk = (await machineTranslateAs(locale, target)) && translateOk;
  }
} else {
  translateOk = machineTranslate(PROJECT, targetLocales);
}

const updatedFingerprints = {};
let untranslated = 0;
for (const locale of targetLocales) {
  const messages = await readJson(messagesPath(locale));
  const translatedKeys = Object.keys(source).filter((key) => key in messages);
  updatedFingerprints[locale] = Object.fromEntries(
    translatedKeys.sort().map((key) => [key, sourceFingerprints[key]]),
  );
  const missing = Object.keys(source).length - translatedKeys.length;
  if (missing > 0) console.error(`${locale}: ${missing} message(s) still untranslated`);
  untranslated += missing;
}
await writeJson(FINGERPRINTS, updatedFingerprints);

process.exit(translateOk && untranslated === 0 ? 0 : 1);
