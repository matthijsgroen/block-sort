import c from "ansi-colors";

import { levelSeeds } from "@/data/levelSeeds";
import { optimizeMoves } from "@/game/level-creation/optimizeMoves";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { mulberry32 } from "@/support/random";
import { timesMap } from "@/support/timeMap";

import { clearLine, doubleProgressBar, progressBar } from "./cliElements";
import { MINIMAL_LEVELS, VERIFICATION_STEPS } from "./constants";
import { levelProducers, Seeder } from "./producers";
import { updateSeeds } from "./updateSeeds";

export const verifySeeds = async (
  all: boolean,
  sampleSize = VERIFICATION_STEPS,
  purge = false,
  type: string | undefined = undefined
) => {
  let foundIssues = false;

  const keys = Object.keys(levelSeeds);

  const existingKeys = levelProducers.filter(
    (h) => keys.includes(h.hash) && (!type || h.name === type)
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
      console.log("Please run 'run' first.\n");
      process.exit(1);
    } else {
      foundIssues = true;
    }
  }

  const updatedSeeds = levelSeeds;

  const keysToPurge: Seeder[] = [];

  for (const key of existingKeys) {
    const seeds = updatedSeeds[`${key.hash}`];
    if (!seeds) {
      continue;
    }
    if (seeds.length < MINIMAL_LEVELS) {
      console.log(
        c.red(
          `Seed for "${key.name}", difficulty ${key.difficulty + 1} is incomplete. Only ${seeds.length} seeds of the ${MINIMAL_LEVELS} available.`
        )
      );
      if (!all) {
        console.log("Please run 'run' to generate extra seeds.\n");
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
          if (!keysToPurge.includes(key)) {
            keysToPurge.push(key);
          }

          clearLine();
          console.log(
            `Seeds for "${key.name}" difficulty ${key.difficulty + 1} did not stay the same.`
          );

          if (!all) {
            console.log(
              "Please use the '--purge' option to remove the invalid seeds.\n"
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
        if (!keysToPurge.includes(key)) {
          keysToPurge.push(key);
        }

        clearLine();
        console.log(
          `Unable to generate level using seed for "${key.name}" difficulty ${key.difficulty + 1}.`
        );
        if (!all) {
          console.log(
            "Please use the '--purge' option to remove the invalid seeds.\n"
          );

          process.exit(1);
        } else {
          foundIssues = true;
          break;
        }
      }
    }
  }
  console.log("");

  if (purge) {
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
  }

  if (foundIssues) {
    console.log(
      "Please use the '--purge' option to remove the invalid seeds.\n"
    );
    console.log("Please run 'run' to regenerate the removed seeds.\n");
    process.exit(1);
  } else {
    console.log("All ok!");
  }
};
