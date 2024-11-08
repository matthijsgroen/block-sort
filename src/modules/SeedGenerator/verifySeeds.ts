import c from "ansi-colors";

import { levelSeeds } from "@/data/levelSeeds";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { mulberry32 } from "@/support/random";
import { timesMap } from "@/support/timeMap";

import { clearLine, doubleProgressBar, progressBar } from "./cliElements";
import { MINIMAL_LEVELS, VERIFICATION_STEPS } from "./constants";
import { levelProducers } from "./producers";
import { removeSeedsForKey } from "./removeSeeds";
import { updateSeeds } from "./updateSeeds";

export const verifySeeds = async (
  all: boolean,
  sampleSize = VERIFICATION_STEPS
) => {
  let foundIssues = false;

  const keys = Object.keys(levelSeeds);

  const existingKeys = levelProducers.filter((h) => keys.includes(h.hash));
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

  let updatedSeeds = levelSeeds;

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

    const stepSize = seeds.length / sampleSize;
    const seedsToTest = timesMap(
      sampleSize,
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
      const random = mulberry32(seed);
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
        const level = await generatePlayableLevel(settings, random, seed);
        clearLine();
        if (level.generationInformation?.seed !== seed) {
          updatedSeeds = removeSeedsForKey(key.hash, updatedSeeds);
          await updateSeeds(updatedSeeds);

          console.log(
            `Seeds for "${key.name}" difficulty ${key.difficulty + 1} did not stay the same, and was removed.`
          );
          if (!all) {
            console.log("Please run 'run' to regenerate the seeds.\n");
            process.exit(1);
          } else {
            foundIssues = true;
            break;
          }
        }
      } catch (ignoreError) {
        updatedSeeds = removeSeedsForKey(key.hash, updatedSeeds);

        await updateSeeds(updatedSeeds);

        console.log(
          `Unable to generate level using seed for "${key.name}" difficulty ${key.difficulty + 1}. Removed seeds.`
        );

        if (!all) {
          console.log("Please run 'run' to regenerate the seeds.\n");
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
    console.log("Please run 'run' to regenerate the seeds.\n");
    process.exit(1);
  } else {
    console.log("All ok!");
  }
};
