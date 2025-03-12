import type { SeedMap } from "@/data/levelSeeds";

export const removeSeedsForKey = (key: string, seeds: SeedMap): SeedMap => {
  const keys = Object.keys(seeds);

  return keys.reduce<SeedMap>((acc, k) => {
    if (k !== key) {
      acc[k] = seeds[k];
    }
    return acc;
  }, {});
};
