import { shuffle } from "../support/random";
import { timesMap } from "../support/timeMap";
import { BLOCK_COLORS } from "./blocks";
import {
  createBlock,
  createBufferColumn,
  createPlacementColumn,
} from "./factories";
import { BlockColor, Column, LevelState } from "./types";

export const generateLevel = (
  random: () => number,
  {
    amountColors = 2,
    stackSize = 4,
    extraPlacementStacks = 2,
    extraPlacementLimits = 0,
    buffers = 0,
    bufferSizes = 1,
  }
): LevelState => {
  // Generate level, this should be extracted
  const availableColors = BLOCK_COLORS.slice();
  shuffle(availableColors, random);

  const blockColors = availableColors.slice(0, amountColors);
  const placementLimits =
    extraPlacementLimits > 0 ? blockColors.slice(-extraPlacementLimits) : [];

  const amountBars = Math.min(amountColors, 7);
  const blocks: BlockColor[] = [];
  for (const color of blockColors) {
    blocks.push(...new Array(stackSize).fill(color));
  }
  shuffle(blocks, random);

  return {
    colors: blockColors,
    columns: timesMap<Column>(amountBars, () =>
      createPlacementColumn(
        stackSize,
        new Array(stackSize).fill(0).map(() => createBlock(blocks.shift()!))
      )
    )
      .concat(
        timesMap(extraPlacementStacks, (i) =>
          createPlacementColumn(stackSize, [], placementLimits[i])
        )
      )
      .concat(timesMap(buffers, () => createBufferColumn(bufferSizes))),
  };
};
