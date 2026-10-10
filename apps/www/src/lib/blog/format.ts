import { DateTime } from "luxon";

export function formatPublishDate(iso: string, locale: string): string {
  return DateTime.fromISO(iso, { zone: "utc" }).setLocale(locale).toLocaleString(DateTime.DATE_MED);
}

export function imageUrl(url: string, width: number, format: "webp" | "jpg" = "webp"): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}w=${width}&fm=${format}&q=80`;
}
