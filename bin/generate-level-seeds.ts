#!/usr/bin/env yarn node --import tsx

import c from "ansi-colors";
import { Command } from "commander";

import { levelSeeds } from "../src/data/levelSeeds";
import { debugLevel } from "../src/game/debugLevel";
import { slowSolve } from "../src/game/level-creation/tactics";
import { SEED } from "../src/modules/SeedGenerator/constants";
import { updateLevelSeeds } from "../src/modules/SeedGenerator/generateSeeds";
import { producers } from "../src/modules/SeedGenerator/producers";
import { removeSeedsForKey } from "../src/modules/SeedGenerator/removeSeeds";
import { showSeedStatistics } from "../src/modules/SeedGenerator/seedInformation";
import { updateSeeds } from "../src/modules/SeedGenerator/updateSeeds";
import { verifySeeds } from "../src/modules/SeedGenerator/verifySeeds";
import { settingsHash } from "../src/support/hash";
import { mulberry32 } from "../src/support/random";

const program = new Command();

program
  .name("generate-level-seeds")
  .description("Generate or update level seeds")
  .version("0.1.0");

program
  .command("run")
  .option("-a, --all", "updates all items that are broken", false)
  .action(async (options: { all?: boolean }) => {
    console.log(c.bold("Updating level seeds..."));
    await updateLevelSeeds(!!options.all, levelSeeds);
  });

program
  .command("verify")
  .option(
    "-a, --all",
    "verify all items if they are broken, instead of quitting on first mismatch",
    false
  )
  .option("-t, --type <levelType>", "levelType to test")
  .option("-p, --purge", "remove all seeds that are no longer valid", false)
  .option(
    "-s, --sample <amount>",
    "amount of seeds to test per setting (default is 5)",
    (v) => parseInt(v, 10)
  )
  .action(
    async (options: {
      all?: boolean;
      sample: number | undefined;
      purge?: boolean;
      type?: string;
    }) => {
      const all = options.all;
      const purge = options.purge;
      const sampleSize = options.sample;

      await verifySeeds(all ?? false, sampleSize, purge ?? false, options.type);
    }
  );

program.command("info").action(() => {
  console.log("Level template statistics:");
  showSeedStatistics();
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

    const updatedSeeds = removeSeedsForKey(settingsHash(settings), levelSeeds);

    await updateSeeds(updatedSeeds);
  });

program
  .command("solve")
  .argument("levelType", "The level type to solve")
  .argument("difficulty", "The difficulty to solve")
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
    const settings = producer.producer(difficulty);

    const clearScreen = () => {
      console.clear();
    };
    clearScreen();

    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const random = mulberry32(SEED);
    await slowSolve(
      settings,
      async (state, move, tactic, moveIndex) => {
        clearScreen();
        console.log(
          "Move: ",
          moveIndex,
          " from: ",
          move.from,
          " to: ",
          move.to,
          " tactic: ",
          tactic
        );
        debugLevel(state);
        await wait(1000);

        return true;
      },
      random
    );
    console.log("ended");
  });

program.parse(process.argv);
