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
  random: () => number,
  levelNr: number
): LevelSettings => {
  const amountColors = levelNr === 0 ? 2 : getSetting(levelNr, 3, 9, 1, 1);
  const stackSize = 4;

  return {
    amountColors,
    stackSize,
    extraPlacementStacks: amountColors < 3 ? 1 : 2,
    hideBlockTypes: levelNr > 10 ? random() > 0.5 : false,
  };
};

export const getHardSettings = (levelNr: number): LevelSettings => {
  const amountColors = levelNr === 0 ? 2 : getSetting(levelNr, 3, 7, 4, 4);
  const stackSize = getSetting(levelNr, 4, 8, 8, 10);
  const extraPlacementLimits = levelNr > 100 && levelNr % 10 === 3 ? 1 : 0;

  return {
    amountColors,
    stackSize,
    extraPlacementStacks: amountColors < 3 ? 1 : 2 + extraPlacementLimits,
    extraPlacementLimits,
    hideBlockTypes: true,
  };
};

export const getSpecialSettings = (levelNr: number): LevelSettings => {
  const amountColors = levelNr === 0 ? 2 : getSetting(levelNr, 3, 7, 4, 4);

  const specialIndex = Math.floor(levelNr / 10) % 4;

  const templates: LevelSettings[] = [
    {
      amountColors,
      stackSize: 6,
      extraPlacementStacks: 2,
      extraPlacementLimits: 1,
    },
    {
      amountColors,
      stackSize: 16,
      buffers: 4,
      bufferSizes: 4,
    },
    {
      amountColors,
      stackSize: 16,
      buffers: 8,
      bufferSizes: 1,
    },
    {
      amountColors,
      stackSize: 8,
      extraPlacementStacks: 2,
      extraPlacementLimits: 2,
      buffers: 4,
      bufferSizes: 2,
    },
  ];

  return templates[specialIndex];
};
