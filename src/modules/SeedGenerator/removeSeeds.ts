export const removeSeedsForKey = (
  key: string,
  seeds: Record<string, number[]>
): Record<string, number[]> => {
  const keys = Object.keys(seeds);

  return keys.reduce<Record<string, number[]>>((acc, k) => {
    if (k !== key) {
      acc[k] = seeds[k];
    }
    return acc;
  }, {});
};
