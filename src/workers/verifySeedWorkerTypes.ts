import type { LevelSettings } from "@/game/types";

export type VerifyTaskMessage = {
  type: "task";
  taskId: number;
  hash: string;
  seed: number;
  expectedMoves: number;
  settings: LevelSettings;
};

export type VerifyShutdownMessage = { type: "shutdown" };

export type VerifyResultMessage = {
  type: "result";
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

export type VerifyIdleMessage = { type: "idle"; taskId: number | null };
