import { parentPort, workerData } from "worker_threads";

import { optimizeMoves } from "@/game/level-creation/optimizeMoves";
import { solvers } from "@/game/level-creation/solvers";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import type { LevelSettings } from "@/game/types";
import { mulberry32 } from "@/support/random";

const MAX_GENERATE_ATTEMPTS = 5_000;

if (parentPort) {
  const startSeed: number = workerData.startSeed;
  const settings: LevelSettings = workerData.settings;
  const amount: number = workerData.amount;

  for (let i = 0; i < amount; i++) {
    const seed = startSeed + i;
    const random = mulberry32(seed);
    const solver = solvers[settings.solver ?? "default"];
    try {
      const level = await generatePlayableLevel(
        settings,
        {
          random,
          attempts: MAX_GENERATE_ATTEMPTS,
          afterAttempt: async () => {
            if (parentPort) {
              // notify of attempt
              parentPort.postMessage({
                seed: null,
                moves: null
              });
            }
          }
        },
        solver
      );
      const optimizedLevel = optimizeMoves(level);

      parentPort.postMessage({
        seed: optimizedLevel.generationInformation?.seed,
        moves: optimizedLevel.moves.length
      });
    } catch (e) {
      console.error(e);
      process.exit(2);
    }
  }
}
