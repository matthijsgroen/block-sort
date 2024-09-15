import { pick } from "@/support/random";

import { LevelSettings } from "./level-creation/generateRandomLevel";

const getSetting = (
  level: number,
  min: number,
  max: number,
  offset: number,
  progression: number
) =>
  min +
  Math.min(Math.max(Math.floor((level - offset) / progression), 0), max - min);

export const getNormalSettings = (
  levelNr: number,
  random = Math.random
): LevelSettings => {
  const amountColors = levelNr === 0 ? 2 : getSetting(levelNr, 3, 9, 5, 10);
  const stackSize = 4;

  return {
    amountColors,
    stackSize,
    extraPlacementStacks: amountColors < 3 ? 1 : 2,
    hideBlockTypes: levelNr > 10 ? random() > 0.5 : false,
  };
};

export const getHardSettings = (
  levelNr: number,
  random = Math.random
): LevelSettings => {
  const amountColors = levelNr === 0 ? 2 : getSetting(levelNr, 3, 10, 5, 10);
  const stackSize = levelNr > 100 ? 5 : 4;
  const extraPlacementLimits = levelNr > 100 && random() > 0.5 ? 1 : 0;

  return {
    amountColors,
    stackSize,
    extraPlacementStacks: amountColors < 3 ? 1 : 2 + extraPlacementLimits,
    extraPlacementLimits,
    hideBlockTypes: levelNr > 10 ? random() > 0.5 : false,
  };
};

export const getSpecialSettings = (
  levelNr: number,
  random = Math.random
): LevelSettings => {
  const amountColors = levelNr === 0 ? 2 : getSetting(levelNr, 3, 7, 4, 4);

  const templates: LevelSettings[] = [
    {
      amountColors,
      stackSize: 6,
      extraPlacementStacks: 2,
      extraPlacementLimits: 1,
    },
    {
      amountColors: levelNr === 0 ? 2 : getSetting(levelNr, 3, 5, 4, 4),
      stackSize: 16,
      extraPlacementStacks: 1,
      buffers: 2,
      bufferSizes: 4,
    },
    {
      amountColors: levelNr === 0 ? 2 : getSetting(levelNr, 3, 5, 4, 4),
      stackSize: 16,
      extraPlacementStacks: 1,
      buffers: 8,
      bufferSizes: 1,
    },
    {
      amountColors,
      stackSize: 8,
      extraPlacementStacks: 2,
      extraPlacementLimits: 2,
      buffers: 3,
      bufferSizes: 2,
    },
  ];

  return pick(templates, random);
};

export const isSpecial = (levelNr: number) => (levelNr + 1) % 2 === 0;
export const isHard = (levelNr: number) => (levelNr + 1) % 7 === 0;
