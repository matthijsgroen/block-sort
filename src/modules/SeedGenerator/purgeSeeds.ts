import { levelSeeds } from "@/data/levelSeeds";
import { optimizeMoves } from "@/game/level-creation/optimizeMoves";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { mulberry32 } from "@/support/random";

import { clearLine, doubleProgressBar } from "./cliElements";
import type { Seeder } from "./producers";
import { getFilteredProducers } from "./producers";
import { updateSeeds } from "./updateSeeds";

export const purgeSeeds = async (
  types: { name: string; levels: number[] }[] | undefined = undefined
) => {
  let totalRemovedSeeds = 0;
  const updatedSeeds = levelSeeds;

  const keysToPurge: Seeder[] = getFilteredProducers(types);

  const totalSeeds = keysToPurge.reduce(
    (acc, key) => acc + (updatedSeeds[key.hash]?.length ?? 0),
    0
  );
  let seedsChecked = 0;
  let removedSeeds = 0;
  let replacedSeeds = 0;
  let replacedMoves = 0;

  let lastWrite = Date.now();

  for (const key of keysToPurge) {
    let currentCheck = 0;
    const seeds = updatedSeeds[`${key.hash}`] ?? [];
    for (const seed of seeds) {
      clearLine();
      process.stdout.write(
        `Testing seeds (removed: ${removedSeeds}) for "${key.name}" difficulty ${key.difficulty + 1}... `
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
        } else {
          if (level.moves.length !== seed[1]) {
            seed[1] = level.moves.length;
            replacedMoves++;
          }
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
  const summary: string[] = [];

  if (totalRemovedSeeds === 0) {
    summary.push("No invalid seeds found.");
  } else {
    summary.push(
      `Please run 'run' to regenerate the ${totalRemovedSeeds} removed seeds.`
    );
  }
  summary.push(`${replacedSeeds} were already replaced.`);
  if (replacedMoves > 0) {
    summary.push(`Updated move counter for ${replacedMoves} seeds.`);
  }

  console.log(summary.join(" "));
  process.exit(0);
};
