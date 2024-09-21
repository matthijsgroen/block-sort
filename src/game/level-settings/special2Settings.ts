import { LevelSettings } from "../level-creation/generateRandomLevel";

export const getSettings = (difficulty: number): LevelSettings => ({
  amountColors: 10,
  stackSize: difficulty > 4 ? 4 : 3,
  extraPlacementStacks:
    4 - Math.min(Math.max(Math.round(difficulty / 3), 0), 4),
  extraPlacementLimits:
    4 - Math.min(Math.max(Math.round(difficulty / 3), 0), 4),
  buffers: Math.min(Math.max(Math.round(difficulty / 3), 0), 4),
  bufferPlacementLimits: Math.min(Math.max(Math.round(difficulty / 3), 0), 4),
  bufferSizes: 3,
});
