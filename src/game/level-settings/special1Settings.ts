import { LevelSettings } from "../level-creation/generateRandomLevel";

export const getSettings = (difficulty: number): LevelSettings => ({
  amountColors: 4,
  stackSize: 12 + Math.max(Math.round(difficulty / 6), 0),
  extraPlacementStacks: 0,
  buffers: 6,
  bufferSizes: 5,
  bufferPlacementLimits: 0 + Math.max(Math.round(difficulty / 3), 0),
});
