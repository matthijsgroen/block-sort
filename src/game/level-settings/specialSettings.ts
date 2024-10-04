import { LevelSettings } from "../level-creation/generateRandomLevel";

export const getSpecial1Settings = (difficulty: number): LevelSettings => ({
  amountColors: 4,
  stackSize: 12 + Math.max(Math.round(difficulty / 8), 0),
  extraPlacementStacks: 0,
  buffers: 6,
  bufferSizes: 4,
  bufferPlacementLimits: 0 + Math.max(Math.round(difficulty / 4), 0),
  blockColorPick: "end",
});

export const getSpecial2Settings = (difficulty: number): LevelSettings => ({
  amountColors: 10 + Math.min(Math.max(Math.round(difficulty / 2), 0), 6),
  stackSize: 3,
  extraPlacementStacks:
    4 - Math.min(Math.max(Math.round(difficulty / 2), 0), 2),
  extraPlacementLimits: Math.max(
    4 - Math.min(Math.max(Math.round(difficulty / 2), 0), 3) - 1,
    0
  ),
  blockColorPick: "end",
});

export const getSpecial3Settings = (difficulty: number): LevelSettings => ({
  amountColors: 5,
  stackSize: difficulty > 4 ? 5 : 4,
  extraPlacementStacks: 2,
  extraPlacementLimits:
    0 + Math.max(Math.min(Math.round(difficulty / 5), 2), 0),
  blockColorPick: "end",
});

export const getSpecial4Settings = (difficulty: number): LevelSettings => ({
  amountColors: 5 + Math.max(Math.round(difficulty / 8), 0),
  stacksPerColor: 2,
  stackSize: 3,
  extraPlacementStacks: 2,
  extraPlacementLimits: 2,
  buffers: 1,
  bufferSizes: 1,
  blockColorPick: "end",
});
