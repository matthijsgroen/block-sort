import { levelSeeds } from "@/data/levelSeeds";
import { moveBlocks } from "@/game/actions";
import { optimizeMoves } from "@/game/level-creation/optimizeMoves";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { hasWon } from "@/game/state";
import type { LevelSettings, LevelState } from "@/game/types";
import { mulberry32 } from "@/support/random";

import { clearLine, doubleProgressBar } from "./cliElements";
import type { Seeder } from "./producers";
import { getFilteredProducers, levelProducers } from "./producers";
import { updateSeeds } from "./updateSeeds";

export const verifySeed = async (
  settings: LevelSettings,
  seed: number
): Promise<[boolean, LevelState]> => {
  const random = mulberry32(seed);
  const level = await generatePlayableLevel(settings, {
    random,
    seed: seed
  }).then(optimizeMoves);
  const playedLevel = level.moves.reduce(
    (state, move) => moveBlocks(state, move),
    level
  );
  return [hasWon(playedLevel), level];
};

export const testSeeds = async (
  types: { name: string; levels: number[] }[] | undefined = undefined
) => {
  let totalRemovedSeeds = 0;
  const updatedSeeds = levelSeeds;

  const keysToTest: Seeder[] = getFilteredProducers(types);

  const totalSeeds = keysToTest.reduce(
    (acc, key) => acc + (updatedSeeds[key.hash]?.length ?? 0),
    0
  );
  let seedsChecked = 0;
  let removedSeeds = 0;
  let replacedSeeds = 0;
  let replacedMoves = 0;

  let lastWrite = Date.now();

  const allKeys = levelProducers.map((p) => p.hash);
  const unknownKeys = Object.keys(updatedSeeds).filter(
    (key) => !allKeys.includes(key)
  );
  if (unknownKeys.length > 0) {
    const amountUnknown = unknownKeys.reduce(
      (acc, key) => acc + updatedSeeds[key].length,
      0
    );
    console.log(
      `Found ${unknownKeys.length} unknown level templates in the seed data. (Removing ${amountUnknown} level seeds)`
    );
    for (const key of unknownKeys) {
      delete updatedSeeds[key];
    }
    await updateSeeds(updatedSeeds);
  }

  for (const key of keysToTest) {
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
      const settings = key.producer(key.difficulty + 1);
      try {
        const [verified, level] = await verifySeed(settings, seed[0]);
        if (!verified) {
          updatedSeeds[key.hash] = updatedSeeds[key.hash].filter(
            (s) => s[0] !== seed[0]
          );
          removedSeeds++;
          totalRemovedSeeds++;
          continue;
        }
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
