export default function splitGroups<T>(arr: T[], count: number): T[][] {
  const groups: T[][] = new Array(count).fill(undefined).map((): T[] => []);
  arr.forEach((p, i) => {
    groups[i % groups.length].push(p);
  });
  return groups;
}
