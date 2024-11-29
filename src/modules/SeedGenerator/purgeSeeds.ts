import { levelSeeds } from "@/data/levelSeeds";
import { optimizeMoves } from "@/game/level-creation/optimizeMoves";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { mulberry32 } from "@/support/random";

import { clearLine, doubleProgressBar } from "./cliElements";
import { levelProducers, Seeder } from "./producers";
import { updateSeeds } from "./updateSeeds";

export const purgeSeeds = async (
  types: { name: string; levels: number[] }[] | undefined = undefined
) => {
  const updatedSeeds = levelSeeds;

  const keysToPurge: Seeder[] = levelProducers.filter((l) => {
    if (types === undefined) return true;
    return types.some(
      (t) =>
        t.name === l.name &&
        (t.levels.length === 0 || t.levels.includes(l.difficulty + 1))
    );
  });

  const totalSeeds = keysToPurge.reduce((acc, key) => {
    return acc + updatedSeeds[key.hash].length;
  }, 0);
  let seedsChecked = 0;
  let removedSeeds = 0;

  for (const key of keysToPurge) {
    let currentCheck = 0;
    const seeds = updatedSeeds[`${key.hash}`];
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
          removedSeeds++;
        }
      } catch (ignoreError) {
        updatedSeeds[key.hash] = updatedSeeds[key.hash].filter(
          (s) => s[0] !== seed[0]
        );
        removedSeeds++;
      }
      await updateSeeds(updatedSeeds);

      currentCheck++;
      seedsChecked++;
    }
  }

  console.log("");
  console.log("Please run 'run' to regenerate the removed seeds.\n");
  process.exit(0);
};
