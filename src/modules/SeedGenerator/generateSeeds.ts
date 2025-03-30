import c from "ansi-colors";
import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";

import type { SeedMap } from "@/data/levelSeeds";

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
import { verifySeed } from "./testSeeds";
import { updateSeeds } from "./updateSeeds";

const produceExtraSeeds = async (
  firstMissing: Seeder,
  copy: SeedMap,
  amount: number,
  concurrency: number,
  onSeedAdded: () => Promise<void> = async () => {},
  prefix = "",
  totalSeedsMissing = amount,
  seedsProduced = 0
) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

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

  process.stdout.write(c.bold(c.whiteBright(` 0 workers`)));
  process.stdout.write(c.dim(` ${spinnerFrames[0]} (${0})`));

  const MAX_WORKERS = concurrency;
  if (!copy[firstMissing.hash]) {
    copy[firstMissing.hash] = [];
  }
  await new Promise<void>((resolve, reject) => {
    let activeWorkers = 0;
    let currentTries = 0;
    let generated = 0;

    const workers = Array.from({ length: MAX_WORKERS }).map((_v, i) => {
      const startSeed =
        SEED + (i + existing) * 15_000 + Math.floor(Math.random() * 10_000);
      const workerPath = path.resolve(__dirname, "../../workers/worker.js");
      const worker = new Worker(workerPath, {
        workerData: {
          startSeed,
          settings,
          amount
        }
      });
      activeWorkers++;
      return worker;
    });

    workers.forEach((worker) => {
      worker.on("message", async (message) => {
        if (message.seed) {
          currentTries++;
          // test seed
          const [verified] = await verifySeed(settings, message.seed);

          if (!verified) {
            // invalid seed
            return;
          }
          copy[firstMissing.hash].push([message.seed, message.moves]);
          await onSeedAdded();
          if (generated < amount) {
            generated++;
          }
          currentTries = 0;
          clearLine();
          process.stdout.write(prefix);
          if (totalSeedsMissing > amount) {
            doubleProgressBar(
              seedsProduced + generated,
              totalSeedsMissing,
              generated,
              amount
            );
          } else {
            progressBar(generated, amount);
          }
          process.stdout.write(
            c.bold(c.whiteBright(` ${activeWorkers} workers`))
          );
          process.stdout.write(
            c.dim(
              ` ${spinnerFrames[currentTries % spinnerFrames.length]} (${currentTries})`
            )
          );
          if (generated >= amount) {
            resolve();
            workers.forEach((w) => w.terminate());
          }
        } else {
          currentTries++;
          process.stdout.moveCursor(
            -(4 + ` ${activeWorkers} workers ${currentTries}`.length),
            0
          );
          process.stdout.write(
            c.bold(c.whiteBright(` ${activeWorkers} workers`))
          );
          process.stdout.write(
            c.dim(
              ` ${spinnerFrames[currentTries % spinnerFrames.length]} (${currentTries})`
            )
          );
        }
      });
      worker.on("error", (err) => console.error("Worker error:", err));
      worker.on("exit", (code) => {
        if (code !== 0 && code !== 1)
          console.error(`Worker gestopt met code ${code}`);
        activeWorkers--;
        if (activeWorkers === 0) {
          reject(new Error("All workers stopped"));
        }
      });
    });
  });

  clearLine();
};

const produceSeeds = async (
  amount: number,
  seeder: Seeder,
  levelSeedsCopy: SeedMap,
  concurrency: number,
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
      concurrency,
      async () => {
        time = Date.now() - time;
        count++;
        if (time > 45_000) {
          // longer than 45 seconds
          count = 0;
          await updateSeeds(levelSeedsCopy);
        }
        if (time * count > 45_000) {
          // longer than 45 seconds
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
  options: {
    all?: boolean;
    types?: { name: string; levels: number[] }[];
    threads?: number;
  },
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
        Math.min(
          levelSeedsCopy[k.hash].length,
          MAX_LEVELS_PER_DIFFICULTY[k.difficulty]
        ),
      0
    );

  const totalSeeds = seedsMissing ?? missingNow;

  const incompleteSeed = getFilteredProducers(options.types, existingKeys).find(
    (k) =>
      levelSeedsCopy[k.hash].length < MAX_LEVELS_PER_DIFFICULTY[k.difficulty]
  );

  if (incompleteSeed) {
    const additionalNeeded = Math.min(
      options.all ? Infinity : GENERATE_BATCH_SIZE,
      MAX_LEVELS_PER_DIFFICULTY[incompleteSeed.difficulty] -
        levelSeedsCopy[incompleteSeed.hash].length
    );
    await produceSeeds(
      additionalNeeded,
      incompleteSeed,
      levelSeedsCopy,
      options.threads ?? 1,
      c.green(
        `Seeding ${additionalNeeded} more for "${incompleteSeed.name}" - ${incompleteSeed.difficulty + 1}... `
      ),
      totalSeeds,
      totalSeeds - missingNow
    );
  }

  const firstMissing = getFilteredProducers(options.types, missingKeys)[0];

  if (firstMissing && !incompleteSeed) {
    await produceSeeds(
      GENERATE_BATCH_SIZE,
      firstMissing,
      levelSeedsCopy,
      options.threads ?? 1,
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
  if (options.all) {
    await updateLevelSeeds(options, levelSeedsCopy, totalSeeds);
  } else {
    console.log("Batch complete");
  }
};
