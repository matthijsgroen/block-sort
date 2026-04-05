import { parentPort } from "worker_threads";

import { moveBlocks } from "@/game/actions";
import { optimizeMoves } from "@/game/level-creation/optimizeMoves";
import { generatePlayableLevel } from "@/game/level-creation/tactics";
import { hasWon } from "@/game/state";
import type { LevelSettings } from "@/game/types";
import { mulberry32 } from "@/support/random";

import type {
  VerifyIdleMessage,
  VerifyResultMessage,
  VerifyShutdownMessage,
  VerifyTaskMessage
} from "./verifySeedWorkerTypes";

const verifySeed = async (settings: LevelSettings, seed: number) => {
  const random = mulberry32(seed);
  const level = await generatePlayableLevel(settings, {
    random,
    seed
  }).then(optimizeMoves);
  const playedLevel = level.moves.reduce(
    (state, move) => moveBlocks(state, move),
    level
  );
  return { valid: hasWon(playedLevel), level };
};

if (parentPort) {
  // Signal ready immediately — orchestrator will dispatch first task on this
  parentPort.postMessage({
    type: "idle",
    taskId: null
  } satisfies VerifyIdleMessage);

  parentPort.on(
    "message",
    async (msg: VerifyTaskMessage | VerifyShutdownMessage) => {
      if (msg.type === "shutdown") {
        process.exit(0);
      }

      try {
        const { valid, level } = await verifySeed(msg.settings, msg.seed);
        const actualSeed = level.generationInformation?.seed ?? null;
        const driftDetected = actualSeed !== msg.seed;

        parentPort!.postMessage({
          type: "result",
          taskId: msg.taskId,
          hash: msg.hash,
          seed: msg.seed,
          actualSeed,
          valid,
          driftDetected,
          actualMoveCount: level.moves.length,
          expectedMoveCount: msg.expectedMoves,
          error: null
        } satisfies VerifyResultMessage);
      } catch (e) {
        parentPort!.postMessage({
          type: "result",
          taskId: msg.taskId,
          hash: msg.hash,
          seed: msg.seed,
          actualSeed: null,
          valid: false,
          driftDetected: false,
          actualMoveCount: 0,
          expectedMoveCount: msg.expectedMoves,
          error: e instanceof Error ? e.message : String(e)
        } satisfies VerifyResultMessage);
      }

      parentPort!.postMessage({
        type: "idle",
        taskId: msg.taskId
      } satisfies VerifyIdleMessage);
    }
  );
}
