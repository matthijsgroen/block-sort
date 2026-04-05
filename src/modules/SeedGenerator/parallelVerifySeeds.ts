import path from "path";
import { fileURLToPath } from "url";
import { Worker } from "worker_threads";

import type { LevelSettings } from "@/game/types";
import type {
  VerifyIdleMessage,
  VerifyResultMessage
} from "@/workers/verifySeedWorkerTypes";

export type VerifyTask = {
  taskId: number;
  hash: string;
  seed: number;
  expectedMoves: number;
  settings: LevelSettings;
};

export type VerifyResult = {
  taskId: number;
  hash: string;
  seed: number;
  actualSeed: number | null;
  valid: boolean;
  driftDetected: boolean;
  actualMoveCount: number;
  expectedMoveCount: number;
  error: string | null;
};

type InboundMessage = VerifyResultMessage | VerifyIdleMessage;

export const parallelVerifySeeds = (
  tasks: VerifyTask[],
  concurrency: number,
  onProgress: (completed: number, total: number) => void
): Promise<VerifyResult[]> => {
  if (tasks.length === 0) {
    return Promise.resolve([]);
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const workerPath = path.resolve(__dirname, "../../workers/verify-worker.js");

  const actualConcurrency = Math.min(concurrency, tasks.length);
  const queue = [...tasks];
  const results: VerifyResult[] = [];
  let completed = 0;

  return new Promise<VerifyResult[]>((resolve, reject) => {
    let activeWorkers = actualConcurrency;

    const dispatchNext = (worker: Worker) => {
      const task = queue.shift();
      if (!task) {
        // No more work — tell this worker to shut down
        worker.postMessage({ type: "shutdown" });
        return;
      }
      worker.postMessage({
        type: "task",
        taskId: task.taskId,
        hash: task.hash,
        seed: task.seed,
        expectedMoves: task.expectedMoves,
        settings: task.settings
      });
    };

    for (let i = 0; i < actualConcurrency; i++) {
      const worker = new Worker(workerPath);

      worker.on("message", (msg: InboundMessage) => {
        if (msg.type === "result") {
          completed++;
          onProgress(completed, tasks.length);
          results.push({
            taskId: msg.taskId,
            hash: msg.hash,
            seed: msg.seed,
            actualSeed: msg.actualSeed,
            valid: msg.valid,
            driftDetected: msg.driftDetected,
            actualMoveCount: msg.actualMoveCount,
            expectedMoveCount: msg.expectedMoveCount,
            error: msg.error
          });
        } else if (msg.type === "idle") {
          // Both the initial ready-signal (taskId: null) and post-result signals
          // go through the same dispatch path — just grab the next task
          dispatchNext(worker);
        }
      });

      worker.on("error", (err) => reject(err));

      worker.on("exit", (code) => {
        activeWorkers--;
        if (code !== 0) {
          reject(new Error(`Verify worker exited with code ${code}`));
          return;
        }
        if (activeWorkers === 0) {
          if (results.length !== tasks.length) {
            reject(
              new Error(
                `Verify workers completed but only ${results.length}/${tasks.length} tasks were processed`
              )
            );
          } else {
            resolve(results);
          }
        }
      });
    }
  });
};
