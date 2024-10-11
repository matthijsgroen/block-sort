#!/usr/bin/env yarn node --import tsx

import c from "ansi-colors";
import { writeFile } from "fs/promises";
import * as prettier from "prettier";

import { levelSeeds } from "../src/data/levelSeeds";
import { generatePlayableLevel } from "../src/game/level-creation/tactics";
import { LEVEL_SCALE } from "../src/game/level-settings/levelSettings";
import { SettingsProducer } from "../src/game/types";
import { hash } from "../src/support/hash";
import { mulberry32 } from "../src/support/random";

import { producers } from "./producers";

const SEED = 123456789012345;

const MINIMAL_LEVELS = 100;
const GENERATE_BATCH_SIZE = 50;

type Seeder = {
  hash: string;
  producer: SettingsProducer;
  difficulty: number;
  name: string;
};

const produceExtraSeeds = async (
  firstMissing: Seeder,
  copy: Record<string, number[]>,
  amount: number
) => {
  const producer = firstMissing.producer;
  const settings = producer(firstMissing.difficulty + 1);
  const existing = copy[firstMissing.hash]?.length ?? 0;

  for (let i = 0; i < amount; i++) {
    const random = mulberry32(SEED + i + existing);
    const level = await generatePlayableLevel(settings, random);
    if (!copy[firstMissing.hash]) {
      copy[firstMissing.hash] = [];
    }
    if (level.generationInformation?.seed) {
      copy[firstMissing.hash].push(level.generationInformation.seed);
    }
  }
};

const main = async () => {
  console.log(c.bold("Updating level seeds..."));

  const keys = Object.keys(levelSeeds);

  const levelSeedsCopy = { ...levelSeeds };

  const scale: number[] = [0, ...LEVEL_SCALE];
  const currentHashes = producers.flatMap((producer) =>
    scale.reduce<Seeder[]>((acc, _lvl, index) => {
      const settings = producer.producer(index + 1);
      const settingsHash = hash(JSON.stringify(settings)).toString();
      return acc.concat({
        hash: settingsHash,
        name: producer.name,
        producer: producer.producer,
        difficulty: index,
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
    const additionalNeeded = Math.max(
      GENERATE_BATCH_SIZE,
      MINIMAL_LEVELS - levelSeedsCopy[incompleteSeed.hash].length
    );
    console.log(
      c.green(
        `Generating additional ${additionalNeeded} level seeds for "${incompleteSeed.name}", difficulty ${incompleteSeed.difficulty + 1}...`
      )
    );
    await produceExtraSeeds(
      incompleteSeed,
      levelSeedsCopy,
      GENERATE_BATCH_SIZE
    );
  }

  const firstMissing = missingKeys[0];
  if (firstMissing && !incompleteSeed) {
    console.log(
      c.green(
        `Generating ${GENERATE_BATCH_SIZE} level seeds for "${firstMissing.name}", difficulty ${firstMissing.difficulty + 1}...`
      )
    );
    await produceExtraSeeds(firstMissing, levelSeedsCopy, GENERATE_BATCH_SIZE);
  }
  if (!incompleteSeed && !firstMissing && obsoleteKeys.length === 0) {
    console.log("All seeds are complete");
  }

  // Update TS file
  const newCode = `/**
    * This file is generated. Do not modify. Run "yarn generate-level-seeds" to update.
  */
  export const levelSeeds: Record<string, number[]> = ${JSON.stringify(levelSeedsCopy)};`;
  const formattedCode = await prettier.format(newCode, {
    parser: "typescript",
  });
  writeFile("src/data/levelSeeds.ts", formattedCode);
};

main();
