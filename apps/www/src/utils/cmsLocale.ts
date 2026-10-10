import { baseLocale, isLocale } from "@codeday/i18n/runtime";
import { fixLocaleCasing } from "@codeday/utils";

/** The Contentful locale code (e.g. `fr-FR`) for a Next.js page locale (e.g. `fr-fr`). */
export function cmsLocale(locale: string | undefined): string {
  return fixLocaleCasing(locale && isLocale(locale) ? locale : baseLocale);
}
