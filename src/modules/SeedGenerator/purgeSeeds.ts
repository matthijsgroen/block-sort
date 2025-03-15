import { levelSeeds } from "@/data/levelSeeds";
import { optimizeMoves } from "@/game/level-creation/optimizeMoves";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { mulberry32 } from "@/support/random";

import { clearLine, doubleProgressBar } from "./cliElements";
import type { Seeder } from "./producers";
import { levelProducers } from "./producers";
import { updateSeeds } from "./updateSeeds";

export const purgeSeeds = async (
  types: { name: string; levels: number[] }[] | undefined = undefined
) => {
  let totalRemovedSeeds = 0;
  const updatedSeeds = levelSeeds;

  const keysToPurge: Seeder[] = levelProducers.filter((l) => {
    if (types === undefined) return true;
    return types.some(
      (t) =>
        t.name === l.name &&
        (t.levels.length === 0 || t.levels.includes(l.difficulty + 1))
    );
  });

  const totalSeeds = keysToPurge.reduce(
    (acc, key) => acc + (updatedSeeds[key.hash]?.length ?? 0),
    0
  );
  let seedsChecked = 0;
  let removedSeeds = 0;
  let replacedSeeds = 0;

  let lastWrite = Date.now();

  for (const key of keysToPurge) {
    let currentCheck = 0;
    const seeds = updatedSeeds[`${key.hash}`] ?? [];
    for (const seed of seeds) {
      clearLine();
      process.stdout.write(
        `Removing invalid seeds (${removedSeeds}) for "${key.name}" difficulty ${key.difficulty + 1}... `
      );
      doubleProgressBar(
        seedsChecked,
        totalSeeds,
        currentCheck,
        seeds.length,
        20
      );
      const random = mulberry32(seed[0]);
      const settings = key.producer(key.difficulty + 1);
      try {
        const level = await generatePlayableLevel(settings, {
          random,
          seed: seed[0]
        }).then(optimizeMoves);
        if (level.generationInformation?.seed !== seed[0]) {
          updatedSeeds[key.hash] = updatedSeeds[key.hash].filter(
            (s) => s[0] !== seed[0]
          );
          if (level.generationInformation?.seed) {
            updatedSeeds[key.hash].push([
              level.generationInformation?.seed,
              level.moves.length
            ]);
          }
          replacedSeeds++;
        }
      } catch (ignoreError) {
        updatedSeeds[key.hash] = updatedSeeds[key.hash].filter(
          (s) => s[0] !== seed[0]
        );
        removedSeeds++;
        totalRemovedSeeds++;
      }
      if (Date.now() - lastWrite > 60_000) {
        await updateSeeds(updatedSeeds);
        lastWrite = Date.now();
      }

      currentCheck++;
      seedsChecked++;
    }
  }
  await updateSeeds(updatedSeeds);

  clearLine();
  console.log(
    `Please run 'run' to regenerate the ${totalRemovedSeeds} removed seeds. ${replacedSeeds} were already replaced.`
  );
  process.exit(0);
};
