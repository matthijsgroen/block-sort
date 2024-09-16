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
  minimalAmountOfMoves?: number;
  maximalAmountOfMoves?: number;
};

export const generateRandomLevel = (
  {
    amountColors = 2,
    stackSize = 4,
    extraPlacementStacks = 2,
    extraPlacementLimits = 0,
    buffers = 0,
    bufferSizes = 1,
    hideBlockTypes = false,
    stacksPerColor = 1,
  }: LevelSettings,
  random: () => number
): LevelState => {
  // Generate level, this should be extracted
  const availableColors = BLOCK_COLORS.slice();
  shuffle(availableColors, random);

  const blockColors = availableColors.slice(0, amountColors);
  const placementLimits =
    extraPlacementLimits > 0 ? blockColors.slice(-extraPlacementLimits) : [];

  const amountBars = amountColors * stacksPerColor;
  const blocks: BlockColor[] = [];
  for (const color of blockColors) {
    blocks.push(...new Array(stackSize * stacksPerColor).fill(color));
  }
  shuffle(blocks, random);

  return createLevelState(
    timesMap<Column>(amountBars, () =>
      createPlacementColumn(
        stackSize,
        new Array(stackSize)
          .fill(0)
          .map((_, i) =>
            createBlock(blocks.shift()!, hideBlockTypes && i !== 0)
          )
      )
    )
      .concat(
        timesMap(extraPlacementStacks, (i) =>
          createPlacementColumn(stackSize, [], placementLimits[i])
        )
      )
      .concat(timesMap(buffers, () => createBufferColumn(bufferSizes)))
  );
};
