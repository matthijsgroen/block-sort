import { fib } from "@/support/fib";
import { pick } from "@/support/random";

import { LevelSettings } from "./level-creation/generateRandomLevel";

export const LEVEL_SCALE = fib(3, 11);

export const getDifficultyLevel = (levelNr: number): number =>
  LEVEL_SCALE.filter((l) => l <= levelNr).length + 1;

export const nextLevelAt = (levelNr: number): number | undefined =>
  LEVEL_SCALE.find((l) => l > levelNr);

export const getNormalSettings = (levelNr: number): LevelSettings => {
  const difficulty = getDifficultyLevel(levelNr);

  return {
    amountColors: Math.min(1 + difficulty, 10),
    stackSize: Math.max(difficulty - 3, 4),
    extraPlacementStacks: difficulty < 2 ? 1 : 2,
    extraPlacementLimits: difficulty > 9 ? 1 : undefined,
    hideBlockTypes: false,
    buffers: difficulty === 10 ? 6 : difficulty === 11 ? 2 : undefined,
    bufferSizes: difficulty > 9 ? 1 : undefined,
  };
};

export const getHardSettings = (levelNr: number): LevelSettings => {
  const baseSettings = getNormalSettings(levelNr);

  return {
    ...baseSettings,
    hideBlockTypes: true,
  };
};

export const getSpecialSettings = (
  levelNr: number,
  random = Math.random
): LevelSettings => {
  const difficulty = getDifficultyLevel(levelNr);

  const templates: LevelSettings[] = [
    {
      amountColors: 4,
      stackSize: 12 + Math.max(Math.round(difficulty / 6), 0),
      extraPlacementStacks: 0,
      buffers: 5 + Math.max(Math.round(difficulty / 8), 0),
      bufferSizes: 3 + Math.min(Math.max(Math.round(difficulty / 3), 0), 2),
      bufferPlacementLimits: 0 + Math.max(Math.round(difficulty / 3), 0),
    },
    {
      amountColors: 10,
      stackSize: difficulty > 4 ? 4 : 3,
      extraPlacementStacks:
        4 - Math.min(Math.max(Math.round(difficulty / 3), 0), 4),
      extraPlacementLimits:
        4 - Math.min(Math.max(Math.round(difficulty / 3), 0), 4),
      buffers: Math.min(Math.max(Math.round(difficulty / 3), 0), 4),
      bufferPlacementLimits: Math.min(
        Math.max(Math.round(difficulty / 3), 0),
        4
      ),
      bufferSizes: 3,
    },
    {
      amountColors: 5,
      stackSize: difficulty > 4 ? 5 : 4,
      extraPlacementStacks: 2,
      extraPlacementLimits:
        0 + Math.max(Math.min(Math.round(difficulty / 5), 2), 0),
    },
    {
      amountColors: 5 + Math.max(Math.round(difficulty / 8), 0),
      stacksPerColor: 2,
      stackSize: 3,
      extraPlacementStacks: 2,
      extraPlacementLimits: 2,
      buffers: 1,
      bufferSizes: 1,
    },
  ];

  return pick(templates, random);
};

export const isSpecial = (levelNr: number) => (levelNr + 1) % 7 === 0;
export const isHard = (levelNr: number) =>
  !isSpecial(levelNr) && (levelNr + 1) % 9 === 0;
