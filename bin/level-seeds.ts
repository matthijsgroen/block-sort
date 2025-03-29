#!/usr/bin/env yarn node --import tsx

import c from "ansi-colors";
import { Command } from "commander";
import child_process from "node:child_process";
import util from "node:util";
import os from "os";

import { levelSeeds } from "../src/data/levelSeeds";
import { debugLevel } from "../src/game/debugLevel";
import { solvers } from "../src/game/level-creation/solvers";
import { slowSolve } from "../src/game/level-creation/tactics";
import type { LevelSettings } from "../src/game/types";
import { SEED } from "../src/modules/SeedGenerator/constants";
import { updateLevelSeeds } from "../src/modules/SeedGenerator/generateSeeds";
import { producers } from "../src/modules/SeedGenerator/producers";
import { removeSeedsForKey } from "../src/modules/SeedGenerator/removeSeeds";
import {
  exportSeedInformation,
  showSeedStatistics
} from "../src/modules/SeedGenerator/seedInformation";
import { testSeeds } from "../src/modules/SeedGenerator/testSeeds";
import { updateSeeds } from "../src/modules/SeedGenerator/updateSeeds";
import { verifySeeds } from "../src/modules/SeedGenerator/verifySeeds";
import { settingsHash } from "../src/support/hash";
import { mulberry32 } from "../src/support/random";

const exec = util.promisify(child_process.exec);

const program = new Command();

program
  .name("generate-level-seeds")
  .description("Generate or update level seeds")
  .version("1.1.0");

program
  .command("verify")
  .description("Verify level seeds if they are still valid")
  .option(
    "-a, --all",
    "verify all items if they are broken, instead of quitting on first mismatch",
    false
  )
  .option(
    "-t, --type <levelTypes>",
    "comma separated list of level types",
    (value) => value.split(",")
  )
  .option(
    "-s, --sample <amount>",
    "amount of seeds to test per setting (default is 5)",
    (v) => parseInt(v, 10)
  )
  .action(
    async (options: {
      all?: boolean;
      sample: number | undefined;
      type?: string[];
    }) => {
      const all = options.all;
      const sampleSize = options.sample;

      await verifySeeds(all ?? false, sampleSize, options.type);
    }
  );

program
  .command("generate")
  .description("Generate new level seeds")
  .option(
    "-a, --all",
    "updates all items that are broken, instead of batch of 50",
    false
  )
  .option("-p, --parallel <threads>", "amount of maximum parallel threads")
  .option(
    "-t, --type <levelTypes>",
    "comma separated list of level types",
    (value) =>
      value.split(",").map((v) => {
        const [name, ...levels] = v.trim().split(":");
        return {
          name,
          levels: levels.map((l) => parseInt(l, 10))
        };
      })
  )
  .action(
    async (options: {
      all?: boolean;
      parallel?: number;
      type?: { name: string; levels: number[] }[];
    }) => {
      console.log(c.bold("Updating level seeds..."));
      const cpuCount = os.cpus().length;
      const threads = Math.min(
        Math.max(1, cpuCount - 2),
        options.parallel ?? Infinity
      );
      console.log(
        `Amount of CPUs: ${c.green(String(cpuCount))} Threads: ${c.bold(String(threads))}`
      );
      process.stdout.write("Compiling worker...");
      await exec("rollup -c rollup.worker.config.js");
      process.stdout.write(c.bold(" done\n"));
      await updateLevelSeeds(
        {
          all: !!options.all,
          types: options.type,
          threads
        },
        levelSeeds
      );
    }
  );

program
  .command("test")
  .description("Test seeds and purge invalid level seeds")
  .option(
    "-t, --type <levelTypes>",
    "comma separated list of level types",
    (value) =>
      value.split(",").map((v) => {
        const [name, ...levels] = v.trim().split(":");
        return {
          name,
          levels: levels.map((l) => parseInt(l, 10))
        };
      })
  )
  .action(async (options: { type?: { name: string; levels: number[] }[] }) => {
    if (options.type) {
      const valid = options.type.every((t) => {
        const producer = producers.find(
          (p) => p.name.toLowerCase() === t.name.toLowerCase()
        );
        if (!producer) {
          console.log(c.red(`Producer for ${t.name} not found`));
          return false;
        }
        return t.levels.every((l) => {
          if (isNaN(l) || l < 1 || l > 11) {
            console.log(c.red(`Invalid difficulty: ${l} for ${t.name}`));
            return false;
          }
          return true;
        });
      });
      if (!valid) {
        console.log(
          `Available producers: ${producers.map((p) => p.name).join(", ")}`
        );
        process.exit(1);
      }
    }

    await testSeeds(options.type);
  });

program
  .command("info")
  .option("-e, --export <file>", "export the seed information to a file")
  .description("Show level seed statistics")
  .action((options: { export?: string }) => {
    if (options.export) {
      console.log(c.bold(`Exporting seed information to ${options.export}`));
      exportSeedInformation(options.export);
      return;
    }
    console.log("Level template statistics:");
    showSeedStatistics();
  });

program
  .command("remove")
  .description("Remove level seeds for a specific level type and difficulty")
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
      c.bold(`Removing seeds for ${levelType} difficulty ${difficulty}`)
    );
    const settings = producer.producer(difficulty);

    const updatedSeeds = removeSeedsForKey(settingsHash(settings), levelSeeds);

    await updateSeeds(updatedSeeds);
  });

program
  .command("solve")
  .description("Solve a level, and display the process")
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
    const settings: LevelSettings = producer.producer(Number(difficulty));

    const clearScreen = () => {
      console.clear();
    };
    clearScreen();

    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const solver = solvers[settings.solver ?? "default"];
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
      random,
      null,
      solver
    );
    console.log("ended");
  });

program
  .showHelpAfterError("(add --help for additional information)")
  .parse(process.argv);
