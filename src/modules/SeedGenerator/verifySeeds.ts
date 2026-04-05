import c from "ansi-colors";

import { levelSeeds } from "@/data/levelSeeds";
import { optimizeMoves } from "@/game/level-creation/optimizeMoves";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { mulberry32 } from "@/support/random";
import { timesMap } from "@/support/timeMap";

import { clearLine, doubleProgressBar, progressBar } from "./cliElements";
import { MAX_LEVELS_PER_DIFFICULTY, VERIFICATION_STEPS } from "./constants";
import { parallelVerifySeeds, type VerifyTask } from "./parallelVerifySeeds";
import { levelProducers } from "./producers";
import { updateSeeds } from "./updateSeeds";

export const verifySeeds = async (
  all: boolean,
  sampleSize = VERIFICATION_STEPS,
  types: string[] | undefined = undefined,
  threads = 1
) => {
  let foundIssues = false;

  const keys = Object.keys(levelSeeds);

  const existingKeys = levelProducers.filter(
    (h) => keys.includes(h.hash) && (!types || types.includes(h.name))
  );
  const missingKeys = levelProducers.filter((h) => !keys.includes(h.hash));
  if (missingKeys.length > 0) {
    missingKeys
      .filter((v, i, l) => l.indexOf(v) === i)
      .forEach((key) => {
        console.log(
          c.red(
            `Seeds missing for "${key.name}" difficulty ${key.difficulty + 1}`
          )
        );
      });
    if (!all) {
      console.log("Please run 'generate' first.\n");
      process.exit(1);
    } else {
      foundIssues = true;
    }
  }

  const updatedSeeds = levelSeeds;

  if (threads > 1) {
    // --- Parallel path ---
    const allTasks: VerifyTask[] = [];
    let taskId = 0;

    for (const key of existingKeys) {
      const seeds = updatedSeeds[`${key.hash}`];
      if (!seeds) {
        continue;
      }
      if (seeds.length < MAX_LEVELS_PER_DIFFICULTY[key.difficulty]) {
        console.log(
          c.red(
            `Seed for "${key.name}", difficulty ${key.difficulty + 1} are incomplete. Only ${seeds.length}/${MAX_LEVELS_PER_DIFFICULTY[key.difficulty]} available.`
          )
        );
        if (!all) {
          console.log(
            "Please use the 'generate' command to regenerate the missing seeds.\n"
          );
          process.exit(1);
        } else {
          foundIssues = true;
        }
      }

      const seedsToTest = all
        ? seeds
        : (() => {
            const normalizedSampleSize = Math.min(sampleSize, seeds.length);
            const stepSize = Math.min(
              seeds.length / normalizedSampleSize,
              seeds.length - 1
            );
            return timesMap(
              normalizedSampleSize,
              (i) => seeds[Math.floor(i * stepSize)]
            );
          })();

      for (const seed of seedsToTest) {
        if (!seed) {
          console.log(c.red("Seed is missing"), "\n");
          if (!all) {
            process.exit(1);
          } else {
            foundIssues = true;
            continue;
          }
        }
        allTasks.push({
          taskId: taskId++,
          hash: key.hash,
          seed: seed[0],
          expectedMoves: seed[1],
          settings: key.producer(key.difficulty + 1)
        });
      }
    }

    const total = allTasks.length;
    process.stdout.write(
      `Verifying ${total} seeds with ${threads} threads...\n`
    );

    const results = await parallelVerifySeeds(
      allTasks,
      threads,
      (completed, _total) => {
        clearLine();
        process.stdout.write(`Verifying seeds... `);
        progressBar(completed, _total);
      }
    );

    clearLine();

    // Precompute a map for O(1) lookup during result processing
    const existingKeysByHash = new Map(existingKeys.map((k) => [k.hash, k]));

    // Group failures by key for reporting
    for (const result of results) {
      const key = existingKeysByHash.get(result.hash);
      const keyLabel = key
        ? `"${key.name}" difficulty ${key.difficulty + 1}`
        : `hash ${result.hash}`;

      if (result.error !== null) {
        console.log(`Unable to generate level using seed for ${keyLabel}.`);
        if (!all) {
          console.log(
            "Please use the 'test' command to remove the invalid seeds."
          );
          process.exit(1);
        } else {
          foundIssues = true;
        }
      } else if (result.driftDetected) {
        console.log(`Seeds for ${keyLabel} did not stay the same.`);
        if (!all) {
          console.log(
            "Please use the 'test' command to remove the invalid seeds."
          );
          process.exit(1);
        } else {
          foundIssues = true;
        }
      } else if (result.actualMoveCount !== result.expectedMoveCount) {
        // Update moves in seed file
        updatedSeeds[result.hash] = updatedSeeds[result.hash].map((s) => {
          if (s[0] === result.seed) {
            return [s[0], result.actualMoveCount];
          }
          return s;
        });
        await updateSeeds(updatedSeeds);
      }
    }
  } else {
    // --- Serial path (unchanged) ---
    for (const key of existingKeys) {
      const seeds = updatedSeeds[`${key.hash}`];
      if (!seeds) {
        continue;
      }
      if (seeds.length < MAX_LEVELS_PER_DIFFICULTY[key.difficulty]) {
        console.log(
          c.red(
            `Seed for "${key.name}", difficulty ${key.difficulty + 1} are incomplete. Only ${seeds.length}/${MAX_LEVELS_PER_DIFFICULTY[key.difficulty]} available.`
          )
        );
        if (!all) {
          console.log(
            "Please use the 'generate' command to regenerate the missing seeds.\n"
          );
          process.exit(1);
        } else {
          foundIssues = true;
        }
      }
      const normalizedSampleSize = Math.min(sampleSize, seeds.length);

      const stepSize = Math.min(
        seeds.length / normalizedSampleSize,
        seeds.length - 1
      );
      const seedsToTest = timesMap(
        normalizedSampleSize,
        (i) => seeds[Math.floor(i * stepSize)]
      );
      for (const seed of seedsToTest) {
        if (!seed) {
          console.log(c.red("Seed is missing"), "\n");
          if (!all) {
            process.exit(1);
          } else {
            foundIssues = true;
            continue;
          }
        }
        const random = mulberry32(seed[0]);
        const settings = key.producer(key.difficulty + 1);
        clearLine();
        process.stdout.write(
          `Verifying "${key.name}" difficulty ${key.difficulty + 1}... `
        );
        if (sampleSize > 1) {
          doubleProgressBar(
            existingKeys.indexOf(key),
            existingKeys.length,

            seedsToTest.indexOf(seed),
            seedsToTest.length
          );
        } else {
          progressBar(existingKeys.indexOf(key), existingKeys.length);
        }

        try {
          const level = await generatePlayableLevel(settings, {
            random,
            seed: seed[0]
          }).then(optimizeMoves);
          if (level.generationInformation?.seed !== seed[0]) {
            clearLine();
            console.log(
              `Seeds for "${key.name}" difficulty ${key.difficulty + 1} did not stay the same.`
            );

            if (!all) {
              console.log(
                "Please use the 'test' command to remove the invalid seeds."
              );
              process.exit(1);
            } else {
              foundIssues = true;
              break;
            }
          } else if (level.moves.length !== seed[1]) {
            // Update moves in seed file
            updatedSeeds[key.hash] = updatedSeeds[key.hash].map((s) => {
              if (s[0] === seed[0]) {
                return [s[0], level.moves.length];
              }
              return s;
            });
            await updateSeeds(updatedSeeds);
          }
          clearLine();
        } catch (ignoreError) {
          clearLine();
          console.log(
            `Unable to generate level using seed for "${key.name}" difficulty ${key.difficulty + 1}.`
          );
          if (!all) {
            console.log(
              "Please use the 'test' command to remove the invalid seeds."
            );
            process.exit(1);
          } else {
            foundIssues = true;
            break;
          }
        }
      }
    }
  }

  console.log("");

  if (foundIssues) {
    console.log("Please use the 'test' command to remove the invalid seeds.");
    console.log(
      "Please use the 'generate' command to generate the missing seeds."
    );
    process.exit(1);
  } else {
    console.log("All ok!");
  }
};
