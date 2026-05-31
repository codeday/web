/**
 * Canonical list of supported locales for the monorepo.
 *
 * Sourced from the Paraglide runtime, which is generated from
 * `project.inlang/settings.json`. Consumers (Next.js i18n config,
 * middleware, etc.) should import from here instead of hardcoding
 * locale codes.
 */
export { locales, baseLocale, type Locale } from "./paraglide/runtime.js";
