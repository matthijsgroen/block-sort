import { shuffle } from "@/support/random";
import { timesMap } from "@/support/timeMap";

import { BLOCK_COLORS, BlockColor } from "../blocks";
import {
  createBlock,
  createBufferColumn,
  createLevelState,
  createPlacementColumn,
} from "../factories";
import { Column, LevelSettings, LevelState } from "../types";

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
    blockColorPick = "start",
    hideBlockTypes = "none",
    stacksPerColor = 1,
  }: LevelSettings,
  random: () => number
): LevelState => {
  // This results in gradually reveal new colors as you progress
  const colorPool = Math.ceil(amountColors / 4) * 4;
  // Generate level, this should be extracted
  const availableColors =
    blockColorPick === "end"
      ? BLOCK_COLORS.slice(-colorPool)
      : BLOCK_COLORS.slice(0, colorPool);
  shuffle(availableColors, random);

  // This simulates having 12 colors for the first few levels,
  // resulting in a better level design
  timesMap(Math.max(12 - colorPool, 0), () => random());

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
  const columns = timesMap<Column>(amountBars, (ci) =>
    createPlacementColumn(
      stackSize,
      new Array(stackSize)
        .fill(0)
        .map((_, i) =>
          createBlock(
            blocks.shift()!,
            (hideBlockTypes === "all" ||
              (hideBlockTypes === "checker" && (i + (ci % 2)) % 2 === 0)) &&
              i !== 0
          )
        )
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
