export function dedupeFirstByKey<T extends Record<string, any>>(obj: T[], key: string): T[] {
  const uniq: Record<string, T> = {};
  obj.forEach((el) => {
    if (!(el[key] in uniq)) {
      uniq[el[key]] = el;
    }
  });
  return Object.values(uniq);
}
