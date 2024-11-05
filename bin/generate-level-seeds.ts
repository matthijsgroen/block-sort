#!/usr/bin/env yarn node --import tsx

import c from "ansi-colors";
import { Command } from "commander";
import { writeFile } from "fs/promises";
import * as prettier from "prettier";

import { levelSeeds } from "../src/data/levelSeeds";
import { generatePlayableLevel } from "../src/game/level-creation/tactics";
import { LEVEL_SCALE } from "../src/game/level-settings/levelSettings";
import { SettingsProducer } from "../src/game/types";
import { hash } from "../src/support/hash";
import { mulberry32 } from "../src/support/random";

import { producers } from "./producers";

const program = new Command();

const SEED = 123456789012345;

const MINIMAL_LEVELS = 100;
const GENERATE_BATCH_SIZE = 50;

const scale: number[] = [0, ...LEVEL_SCALE];

type Seeder = {
  hash: string;
  producer: SettingsProducer;
  difficulty: number;
  name: string;
};

const progressBar = (
  current: number,
  total: number,
  barLength: number = 40
) => {
  const percentage = (current / total) * 100;
  const filledLength = Math.round((barLength * current) / total);
  const bar = "█".repeat(filledLength) + "-".repeat(barLength - filledLength);
  process.stdout.write(
    `[${bar}] ${current}/${total} (${percentage.toFixed(2)}%)        \r`
  );
};

const generateLevel = async (settings, seed) => {
  const random = mulberry32(seed);
  try {
    return await generatePlayableLevel(settings, random);
  } catch (ignoreError) {
    return await generateLevel(settings, seed + 1000);
  }
};

const produceExtraSeeds = async (
  firstMissing: Seeder,
  copy: Record<string, number[]>,
  amount: number,
  onSeedAdded: (seed: number) => Promise<void> = async () => {}
) => {
  const producer = firstMissing.producer;
  const settings = producer(firstMissing.difficulty + 1);
  const existing = copy[firstMissing.hash]?.length ?? 0;

  progressBar(0, amount);
  for (let i = 0; i < amount; i++) {
    const seed = SEED + i + existing;
    const level = await generateLevel(settings, seed);
    if (!copy[firstMissing.hash]) {
      copy[firstMissing.hash] = [];
    }
    if (level.generationInformation?.seed) {
      copy[firstMissing.hash].push(level.generationInformation.seed);
      await onSeedAdded(level.generationInformation.seed);
    }
    progressBar(i + 1, amount);
  }
};

const main = async (all: boolean, levelSeeds: Record<string, number[]>) => {
  const keys = Object.keys(levelSeeds);

  const levelSeedsCopy = { ...levelSeeds };

  const currentHashes = producers.flatMap((producer) =>
    scale.reduce<Seeder[]>((acc, _lvl, index) => {
      const settings = producer.producer(index + 1);
      const settingsHash = hash(JSON.stringify(settings)).toString();
      return acc.concat({
        hash: settingsHash,
        name: producer.name,
        producer: producer.producer,
        difficulty: index
      });
    }, [])
  );
  // Obsolete keys
  const obsoleteKeys = keys.filter(
    (k) => !currentHashes.some((h) => h.hash === k)
  );

  obsoleteKeys.forEach((k) => {
    delete levelSeedsCopy[k];
  });

  const existingKeys = currentHashes.filter((h) => keys.includes(h.hash));
  const missingKeys = currentHashes.filter((h) => !keys.includes(h.hash));

  const incompleteSeed = existingKeys.find(
    (k) => levelSeeds[k.hash].length < MINIMAL_LEVELS
  );

  if (incompleteSeed) {
    const additionalNeeded = Math.min(
      GENERATE_BATCH_SIZE,
      MINIMAL_LEVELS - levelSeedsCopy[incompleteSeed.hash].length
    );
    console.log(
      c.green(
        `Generating additional ${additionalNeeded} level seeds for "${incompleteSeed.name}", difficulty ${incompleteSeed.difficulty + 1}...    `
      )
    );
    let time = Date.now();
    let count = 0;
    await produceExtraSeeds(
      incompleteSeed,
      levelSeedsCopy,
      GENERATE_BATCH_SIZE,
      async () => {
        time = Date.now() - time;
        if (time > 60_000) {
          // longer than a minute
          count = 0;
          await updateSeeds(levelSeedsCopy);
        }
        if (time > 10_000 && count > 5) {
          // longer than a minute
          count = 0;
          await updateSeeds(levelSeedsCopy);
        }
        time = Date.now();
      }
    );
  }

  const firstMissing = missingKeys[0];
  if (firstMissing && !incompleteSeed) {
    console.log(
      c.green(
        `Generating ${GENERATE_BATCH_SIZE} level seeds for "${firstMissing.name}", difficulty ${firstMissing.difficulty + 1}...      `
      )
    );
    let time = Date.now();
    let count = 0;
    await produceExtraSeeds(
      firstMissing,
      levelSeedsCopy,
      GENERATE_BATCH_SIZE,
      async () => {
        time = Date.now() - time;
        if (time > 60_000) {
          // longer than a minute
          count = 0;
          await updateSeeds(levelSeedsCopy);
        }
        if (time > 10_000 && count > 5) {
          // longer than a minute
          count = 0;
          await updateSeeds(levelSeedsCopy);
        }
        time = Date.now();
      }
    );
  }
  if (!incompleteSeed && !firstMissing && obsoleteKeys.length === 0) {
    console.log("All seeds are complete");
    process.exit(0);
  }

  await updateSeeds(levelSeedsCopy);
  if (all) {
    await main(true, levelSeedsCopy);
  }
};

const removeSeedsForKey = (
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

const updateSeeds = async (updatedLevelSeeds: Record<string, number[]>) => {
  const sortedSeeds = Object.fromEntries(
    Object.entries(updatedLevelSeeds).sort(
      ([a], [b]) => parseInt(a) - parseInt(b)
    )
  );
  // Update TS file
  const newCode = `/**
    * This file is generated. Do not modify. Run "yarn generate-level-seeds" to update.
  */
  export const levelSeeds: Record<string, number[]> = ${JSON.stringify(sortedSeeds)};`;
  const formattedCode = await prettier.format(newCode, {
    parser: "typescript",
    trailingComma: "none"
  });
  await writeFile("src/data/levelSeeds.ts", formattedCode);
};

program
  .name("generate-level-seeds")
  .description("Generate or update level seeds")
  .version("0.1.0");

program
  .command("run")
  .option("-a, --all", "updates all items that are broken", false)
  .action(async (options: { all?: boolean }) => {
    console.log(c.bold("Updating level seeds..."));
    await main(!!options.all, levelSeeds);
  });
program
  .command("verify")
  .option("-a, --all", "remove all items that are broken", false)
  .action(async (options: { all?: boolean }) => {
    const all = options.all;
    let foundIssues = false;

    const keys = Object.keys(levelSeeds);

    const currentHashes = producers.flatMap((producer) =>
      scale.reduce<Seeder[]>((acc, _lvl, index) => {
        const settings = producer.producer(index + 1);
        const settingsHash = hash(JSON.stringify(settings)).toString();
        return acc.concat({
          hash: settingsHash,
          name: producer.name,
          producer: producer.producer,
          difficulty: index
        });
      }, [])
    );
    const existingKeys = currentHashes.filter((h) => keys.includes(h.hash));
    const missingKeys = currentHashes.filter((h) => !keys.includes(h.hash));
    if (missingKeys.length > 0) {
      missingKeys
        .filter((v, i, l) => l.indexOf(v) === i)
        .forEach((key) => {
          console.log(
            c.red(
              `Seeds missing for "${key.name} difficulty ${key.difficulty + 1}`
            )
          );
        });
      console.log("Please run 'run' first.\n");
      if (!all) {
        process.exit(1);
      } else {
        foundIssues = true;
      }
    }

    let updatedSeeds = levelSeeds;

    for (const key of existingKeys) {
      const seeds = updatedSeeds[`${key.hash}`];
      if (!seeds) {
        continue;
      }
      if (seeds.length < MINIMAL_LEVELS) {
        console.log("");
        console.log(
          c.red(
            `Seed for "${key.name}", difficulty ${key.difficulty + 1} is incomplete. Only ${seeds.length} seeds of the ${MINIMAL_LEVELS} available.`
          )
        );
        if (!all) {
          process.exit(1);
        } else {
          foundIssues = true;
        }
      }
      process.stdout.write(
        `Verifying "${key.name}" difficulty ${key.difficulty + 1}...      \r`
      );
      const seedsToTest = [
        seeds[0],
        seeds[Math.floor(seeds.length / 2)],
        seeds.at(-1)
      ];
      for (const seed of seedsToTest) {
        if (!seed) {
          console.log("");
          console.log(c.red("Seed is missing"), "\n");
          if (!all) {
            process.exit(1);
          } else {
            foundIssues = true;
            continue;
          }
        }
        const random = mulberry32(seed);
        const settings = key.producer(key.difficulty + 1);
        try {
          const level = await generatePlayableLevel(settings, random, seed);
          if (level.generationInformation?.seed !== seed) {
            console.log("");
            console.log(c.red("Seed has not stayed the same"));

            updatedSeeds = removeSeedsForKey(key.hash, updatedSeeds);
            await updateSeeds(updatedSeeds);

            console.log(
              `Seeds for "${key.name}" difficulty ${key.difficulty + 1} removed. Please run 'run' to generate new ones.`
            );
            if (!all) {
              process.exit(1);
            } else {
              foundIssues = true;
              break;
            }
          }
        } catch (ignoreError) {
          console.log("");
          console.log(c.red("Unable to generate level"));
          updatedSeeds = removeSeedsForKey(key.hash, updatedSeeds);

          await updateSeeds(updatedSeeds);

          console.log(
            `Seeds for "${key.name}" difficulty ${key.difficulty + 1} removed. Please run 'run' to generate new ones.`
          );

          if (!all) {
            process.exit(1);
          } else {
            foundIssues = true;
            break;
          }
        }
      }
    }
    console.log("");
    if (foundIssues) {
      console.log("Done.");
      process.exit(1);
    } else {
      console.log("All ok!");
    }
  });

program
  .command("erase")
  .argument("levelType", "The level type to erase")
  .argument("difficulty", "The difficulty to erase")
  .action(async (levelType, difficulty) => {
    const producer = producers.find(
      (p) => p.name.toLowerCase() === levelType.toLowerCase()
    );
    if (!producer) {
      console.log(c.red(`Producer for ${levelType} not found`));
      console.log(
        `Available producers: ${producers.map((p) => p.name).join(", ")}`
      );
      process.exit(1);
    }
    if (
      isNaN(parseInt(difficulty)) ||
      parseInt(difficulty) < 1 ||
      parseInt(difficulty) > 11
    ) {
      console.log(c.red("Difficulty must be a number between 1 and 11"));
      process.exit(1);
    }
    console.log(
      c.bold(`Erasing seeds for ${levelType} difficulty ${difficulty}`)
    );
    const settings = producer.producer(difficulty);
    const settingsHash = hash(JSON.stringify(settings)).toString();

    const updatedSeeds = removeSeedsForKey(settingsHash, levelSeeds);

    await updateSeeds(updatedSeeds);
  });
program.parse(process.argv);
