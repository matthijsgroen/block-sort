import { shuffle } from "@/support/random";
import { timesMap } from "@/support/timeMap";

import { BLOCK_COLORS, BlockColor } from "../blocks";
import {
  createBlock,
  createBufferColumn,
  createLevelState,
  createPlacementColumn,
} from "../factories";
import { Column, LevelState } from "../types";

export type LevelSettings = {
  amountColors?: number;
  hideBlockTypes?: boolean;
  stackSize?: number;
  stacksPerColor?: number;
  extraPlacementStacks?: number;
  extraPlacementLimits?: number;
  buffers?: number;
  bufferSizes?: number;
  bufferPlacementLimits?: number;
  extraBuffers?: { size: number; amount: number; limit: number }[];
  playMoves?: [minCount: number, maxPercent: number];
};

export const generateRandomLevel = (
  {
    amountColors = 2,
    stackSize = 4,
    extraPlacementStacks = 2,
    extraPlacementLimits = 0,
    buffers = 0,
    bufferSizes = 1,
    bufferPlacementLimits = 0,
    extraBuffers = [],
    hideBlockTypes = false,
    stacksPerColor = 1,
  }: LevelSettings,
  random: () => number
): LevelState => {
  // Generate level, this should be extracted
  const availableColors = BLOCK_COLORS.slice();
  shuffle(availableColors, random);

  const bufferList = [
    { amount: buffers, size: bufferSizes, limit: bufferPlacementLimits },
  ].concat(extraBuffers);

  const blockColors = availableColors.slice(0, amountColors);
  let stackLimit = blockColors.length - extraPlacementLimits;

  const amountBars = amountColors * stacksPerColor;
  const blocks: BlockColor[] = [];
  for (const color of blockColors) {
    blocks.push(...new Array(stackSize * stacksPerColor).fill(color));
  }
  shuffle(blocks, random);
  const columns = timesMap<Column>(amountBars, () =>
    createPlacementColumn(
      stackSize,
      new Array(stackSize)
        .fill(0)
        .map((_, i) => createBlock(blocks.shift()!, hideBlockTypes && i !== 0))
    )
  )
    .concat(
      timesMap(extraPlacementStacks, (i) =>
        createPlacementColumn(
          stackSize,
          [],
          i < extraPlacementLimits ? blockColors[stackLimit + i] : undefined
        )
      )
    )
    .concat(
      bufferList.flatMap(({ amount, size, limit }) => {
        stackLimit -= limit;

        return timesMap(amount, (i) =>
          createBufferColumn(
            size,
            i < limit ? blockColors[stackLimit + i] : undefined
          )
        );
      })
    );

  return createLevelState(columns);
};
