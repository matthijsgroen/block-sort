import { LevelSettings } from "./generateLevel";

const getSetting = (
  level: number,
  min: number,
  max: number,
  offset: number,
  progression: number
) =>
  min +
  Math.min(Math.max(Math.floor((level - offset) / progression), 0), max - min);

export const getNormalSettings = (levelNr: number): LevelSettings => {
  const amountColors = levelNr === 0 ? 2 : getSetting(levelNr, 3, 7, 4, 4);
  const stackSize = getSetting(levelNr, 4, 8, 8, 10);
  const extraPlacementLimits = levelNr > 100 && levelNr % 10 === 3 ? 1 : 0;

  //   amountColors={2}
  //   stackSize={4}
  //   extraPlacementStacks={1}

  // amountColors={levelNr + 7}
  // stackSize={16}
  // buffers={3}
  // bufferSizes={4}
  // extraPlacementLimits={1}
  // extraPlacementStacks={1}
  // hideBlockTypes={true}

  return {
    amountColors,
    stackSize,
    extraPlacementStacks: amountColors < 3 ? 1 : 2,
    extraPlacementLimits,
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

  const specialIndex = Math.floor((levelNr - 6) / 10) % 4;

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
