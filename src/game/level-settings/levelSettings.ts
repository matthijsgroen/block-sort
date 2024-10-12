import { fib } from "@/support/fib";

export const LEVEL_SCALE = fib(3, 11);
// 0: 3, 1: 6, 2: 9, 3: 15, 4: 24, 5: 39, 6: 63, 7: 102, 8: 165, 9: 267

export const getDifficultyLevel = (levelNr: number): number =>
  LEVEL_SCALE.filter((l) => l <= levelNr).length + 1;

export const nextLevelAt = (levelNr: number): number | undefined =>
  LEVEL_SCALE.find((l) => l > levelNr);
