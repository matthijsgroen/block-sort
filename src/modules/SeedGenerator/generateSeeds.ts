import c from "ansi-colors";

import type { SeedMap } from "@/data/levelSeeds";
import { optimizeMoves } from "@/game/level-creation/optimizeMoves";
import { solvers } from "@/game/level-creation/solvers";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import type { LevelSettings, LevelState } from "@/game/types";
import { mulberry32 } from "@/support/random";

import {
  clearLine,
  doubleProgressBar,
  progressBar,
  spinnerFrames
} from "./cliElements";
import {
  GENERATE_BATCH_SIZE,
  MAX_LEVELS_PER_DIFFICULTY,
  SEED
} from "./constants";
import type { Seeder } from "./producers";
import { getFilteredProducers, levelProducers } from "./producers";
import { updateSeeds } from "./updateSeeds";

const MAX_GENERATE_ATTEMPTS = 200;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateLevel = async (
  settings: LevelSettings,
  seed: number
): Promise<LevelState> => {
  let currentTries = 0;
  let depth = 0;
  let currentSeed = seed;
  while (depth < 50) {
    const random = mulberry32(currentSeed);
    try {
      process.stdout.write(
        c.dim(
          ` ${spinnerFrames[currentTries % spinnerFrames.length]} (${currentTries})`
        )
      );
      const solver = solvers[settings.solver ?? "default"];

      return await generatePlayableLevel(
        settings,
        {
          random,
          attempts: MAX_GENERATE_ATTEMPTS,
          afterAttempt: async () => {
            process.stdout.moveCursor(-(5 + `${currentTries}`.length), 0);
            currentTries++;
            process.stdout.write(
              c.dim(
                ` ${spinnerFrames[currentTries % spinnerFrames.length]} (${currentTries})`
              )
            );
            await delay(2);
          }
        },
        solver
      ).then(optimizeMoves);
    } catch (ignoreError) {
      process.stdout.moveCursor(-(5 + `${currentTries}`.length), 0);
      currentSeed += 1000;
      depth++;
    }
  }
  throw new Error(`Too many retries (${currentTries})`);
};

const produceExtraSeeds = async (
  firstMissing: Seeder,
  copy: SeedMap,
  amount: number,
  onSeedAdded: (seed: number) => Promise<void> = async () => {},
  prefix = "",
  totalSeedsMissing = amount,
  seedsProduced = 0
) => {
  const producer = firstMissing.producer;
  const settings = producer(firstMissing.difficulty + 1);
  const existing = copy[firstMissing.hash]?.length ?? 0;

  clearLine();
  process.stdout.write(prefix);
  if (totalSeedsMissing > amount) {
    doubleProgressBar(seedsProduced, totalSeedsMissing, 0, amount);
  } else {
    progressBar(0, amount);
  }
  for (let i = 0; i < amount; i++) {
    const seed = SEED + i + existing + Math.floor(Math.random() * 10_000); // introduce some randomness
    const level = await generateLevel(settings, seed);
    if (!copy[firstMissing.hash]) {
      copy[firstMissing.hash] = [];
    }
    if (level.generationInformation?.seed) {
      copy[firstMissing.hash].push([
        level.generationInformation.seed,
        level.moves.length
      ]);
      await onSeedAdded(level.generationInformation.seed);
    }
    clearLine();
    process.stdout.write(prefix);
    if (totalSeedsMissing > amount) {
      doubleProgressBar(
        seedsProduced + i + 1,
        totalSeedsMissing,
        i + 1,
        amount
      );
    } else {
      progressBar(i + 1, amount);
    }
  }
  clearLine();
};

const produceSeeds = async (
  amount: number,
  seeder: Seeder,
  levelSeedsCopy: SeedMap,
  infoLine: string,
  totalSeedsMissing: number,
  seedsProduced: number
) => {
  try {
    let time = Date.now();
    let count = 0;
    await produceExtraSeeds(
      seeder,
      levelSeedsCopy,
      amount,
      async () => {
        time = Date.now() - time;
        count++;
        if (time > 45_000) {
          // longer than a minute
          count = 0;
          await updateSeeds(levelSeedsCopy);
        }
        if (time * count > 45_000) {
          // longer than a minute
          count = 0;
          await updateSeeds(levelSeedsCopy);
        }
        time = Date.now();
      },
      infoLine,
      totalSeedsMissing,
      seedsProduced
    );
  } catch (e) {
    process.stdout.write("Error:\n");
    if ("message" in (e as Error)) {
      process.stdout.write(`${(e as Error).message}\n`);
    }
    process.exit(1);
  }
};

export const updateLevelSeeds = async (
  all: boolean,
  types: { name: string; levels: number[] }[] | undefined = undefined,
  levelSeeds: SeedMap,
  seedsMissing: number | null = null
) => {
  const keys = Object.keys(levelSeeds);
  const levelSeedsCopy = { ...levelSeeds };

  // Obsolete keys
  const obsoleteKeys = keys.filter(
    (k) => !levelProducers.some((h) => h.hash === k)
  );
  obsoleteKeys.forEach((k) => {
    delete levelSeedsCopy[k];
  });
  levelProducers.forEach((p) => {
    const seeds = levelSeedsCopy[p.hash];
    if (!seeds) {
      levelSeedsCopy[p.hash] = [];
    }
    // remove duplicate seeds
    levelSeedsCopy[p.hash] = levelSeedsCopy[p.hash].filter(
      (s, i, a) => a.findIndex((t) => t[0] === s[0]) === i
    );
  });

  const existingKeys = levelProducers.filter((h) => keys.includes(h.hash));
  const missingKeys = levelProducers.filter((h) => !keys.includes(h.hash));

  const missingNow =
    missingKeys.reduce(
      (acc, k) => acc + MAX_LEVELS_PER_DIFFICULTY[k.difficulty],
      0
    ) +
    existingKeys.reduce(
      (acc, k) =>
        acc +
        MAX_LEVELS_PER_DIFFICULTY[k.difficulty] -
        levelSeedsCopy[k.hash].length,
      0
    );

  const totalSeeds = seedsMissing ?? missingNow;

  const incompleteSeed = getFilteredProducers(types, existingKeys).find(
    (k) =>
      levelSeedsCopy[k.hash].length < MAX_LEVELS_PER_DIFFICULTY[k.difficulty]
  );

  if (incompleteSeed) {
    const additionalNeeded = Math.min(
      GENERATE_BATCH_SIZE,
      MAX_LEVELS_PER_DIFFICULTY[incompleteSeed.difficulty] -
        levelSeedsCopy[incompleteSeed.hash].length
    );
    await produceSeeds(
      additionalNeeded,
      incompleteSeed,
      levelSeedsCopy,
      c.green(
        `Seeding ${additionalNeeded} more for "${incompleteSeed.name}" - ${incompleteSeed.difficulty + 1}... `
      ),
      totalSeeds,
      totalSeeds - missingNow
    );
  }

  const firstMissing = getFilteredProducers(types, missingKeys)[0];

  if (firstMissing && !incompleteSeed) {
    await produceSeeds(
      GENERATE_BATCH_SIZE,
      firstMissing,
      levelSeedsCopy,
      c.green(
        `Seeding ${GENERATE_BATCH_SIZE} for "${firstMissing.name}" - ${firstMissing.difficulty + 1}...      `
      ),
      totalSeeds,
      totalSeeds - missingNow
    );
  }
  if (!incompleteSeed && !firstMissing && obsoleteKeys.length === 0) {
    console.log("All seeds are complete");
    process.exit(0);
  }

  await updateSeeds(levelSeedsCopy);
  if (all) {
    await updateLevelSeeds(true, types, levelSeedsCopy, totalSeeds);
  } else {
    console.log("Batch complete");
  }
};
