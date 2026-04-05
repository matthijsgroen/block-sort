import c from "ansi-colors";

import type { SeedMap } from "@/data/levelSeeds";
import { levelSeeds } from "@/data/levelSeeds";

import { MAX_LEVELS_PER_DIFFICULTY } from "./constants";
import { getFilteredProducers, levelProducers } from "./producers";
import { updateSeeds } from "./updateSeeds";

export const trimSeeds = async (
  types?: { name: string; levels: number[] }[]
) => {
  const levelSeedsCopy: SeedMap = { ...levelSeeds };
  const producers = getFilteredProducers(types);

  let totalRemoved = 0;

  for (const producer of producers) {
    const cap = MAX_LEVELS_PER_DIFFICULTY[producer.difficulty];
    const existing = levelSeedsCopy[producer.hash];
    if (!existing || existing.length <= cap) {
      continue;
    }
    const removed = existing.length - cap;
    levelSeedsCopy[producer.hash] = existing.slice(0, cap);
    totalRemoved += removed;
    console.log(
      c.yellow(
        `Trimmed "${producer.name}" difficulty ${producer.difficulty + 1}: ${c.bold(String(removed))} seeds removed (${existing.length} → ${cap})`
      )
    );
  }

  // Remove keys no longer in levelProducers
  const validHashes = new Set(levelProducers.map((p) => p.hash));
  for (const key of Object.keys(levelSeedsCopy)) {
    if (!validHashes.has(key)) {
      delete levelSeedsCopy[key];
    }
  }

  if (totalRemoved === 0) {
    console.log(c.green("No excess seeds found — nothing to trim."));
    return;
  }

  console.log(
    c.bold(c.green(`\nTotal seeds removed: ${c.white(String(totalRemoved))}`))
  );
  await updateSeeds(levelSeedsCopy);
  console.log(c.bold("Seed cache updated."));
};
