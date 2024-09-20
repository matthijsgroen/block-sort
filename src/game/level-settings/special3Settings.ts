import { LevelSettings } from "../level-creation/generateRandomLevel";

export const getSettings = (difficulty: number): LevelSettings => ({
  amountColors: 5,
  stackSize: difficulty > 4 ? 5 : 4,
  extraPlacementStacks: 2,
  extraPlacementLimits:
    0 + Math.max(Math.min(Math.round(difficulty / 5), 2), 0),
});
