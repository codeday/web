export function fixLocaleCasing(locale: string): string {
  if (!locale.includes('-')) return locale;
  return locale.split('-')[0].toLowerCase() + '-' + locale.split('-')[1].toUpperCase();
}
