import { flags } from "./generated/flags";

/** A square SVG data URI of the flag for `locale`'s region, if one is configured. */
export function flagForLocale(locale: string): string | undefined {
  const { region } = new Intl.Locale(locale).maximize();
  return region ? flags[region] : undefined;
}
