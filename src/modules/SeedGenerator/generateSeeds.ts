import c from "ansi-colors";

import { SeedMap } from "@/data/levelSeeds";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { LevelSettings, LevelState } from "@/game/types";
import { mulberry32 } from "@/support/random";

import { clearLine, doubleProgressBar, progressBar } from "./cliElements";
import { GENERATE_BATCH_SIZE, MINIMAL_LEVELS, SEED } from "./constants";
import { levelProducers, Seeder } from "./producers";
import { updateSeeds } from "./updateSeeds";

const generateLevel = async (
  settings: LevelSettings,
  seed: number,
  depth = 0
): Promise<LevelState> => {
  if (depth > 50) {
    throw new Error("Too many retries (${depth * MAX_GENERATE_ATTEMPTS})");
  }
  const random = mulberry32(seed);
  try {
    return await generatePlayableLevel(settings, random);
  } catch (ignoreError) {
    return await generateLevel(settings, seed + 1000, depth + 1);
  }
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
    const seed = SEED + i + existing;
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
};

export const updateLevelSeeds = async (
  all: boolean,
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

  const existingKeys = levelProducers.filter((h) => keys.includes(h.hash));
  const missingKeys = levelProducers.filter((h) => !keys.includes(h.hash));
  const missingNow =
    missingKeys.length * MINIMAL_LEVELS +
    existingKeys.reduce(
      (acc, k) => acc + MINIMAL_LEVELS - levelSeeds[k.hash].length,
      0
    );

  const totalSeeds = seedsMissing ?? missingNow;

  const incompleteSeed = existingKeys.find(
    (k) => levelSeeds[k.hash].length < MINIMAL_LEVELS
  );

  if (incompleteSeed) {
    const additionalNeeded = Math.min(
      GENERATE_BATCH_SIZE,
      MINIMAL_LEVELS - levelSeedsCopy[incompleteSeed.hash].length
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

  const firstMissing = missingKeys[0];
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
    await updateLevelSeeds(true, levelSeedsCopy, totalSeeds);
  }
};
