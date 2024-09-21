import { LevelSettings } from "../level-creation/generateRandomLevel";

export const getSettings = (difficulty: number): LevelSettings => ({
  amountColors: 5 + Math.max(Math.round(difficulty / 8), 0),
  stacksPerColor: 2,
  stackSize: 3,
  extraPlacementStacks: 2,
  extraPlacementLimits: 2,
  buffers: 1,
  bufferSizes: 1,
});
