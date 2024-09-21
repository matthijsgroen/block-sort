import { LevelSettings } from "../level-creation/generateRandomLevel";

export const getSettings = (difficulty: number): LevelSettings => ({
  amountColors: Math.min(1 + difficulty, 10),
  stackSize: Math.max(difficulty - 3, 4),
  extraPlacementStacks: difficulty < 2 ? 1 : 2,
  extraPlacementLimits: difficulty > 9 ? 1 : undefined,
  hideBlockTypes: false,
  buffers: difficulty === 10 ? 6 : difficulty === 11 ? 2 : undefined,
  bufferSizes: difficulty > 9 ? 1 : undefined,
});
