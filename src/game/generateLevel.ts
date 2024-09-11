import { shuffle } from "../support/random";
import { timesMap } from "../support/timeMap";
import { BLOCK_COLORS } from "./blocks";
import { Block, BlockColor, Column, LevelState } from "./types";
import { produce } from "immer";

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

export const createPlacementColumn = (
  size: number,
  blocks: Block[] = [],
  limitColor?: BlockColor
): Column => ({
  type: "placement",
  locked: false,
  columnSize: size,
  blocks,
  limitColor,
});

export const createBufferColumn = (
  size: number,
  limitColor?: BlockColor
): Column => ({
  type: "buffer",
  locked: false,
  columnSize: size,
  blocks: [],
  limitColor,
});

export const createBlock = (color: BlockColor, hidden?: boolean) => ({
  color,
  revealed: hidden !== true,
});

export const selectFromColumn = (
  level: LevelState,
  columnIndex: number
): Block[] => {
  const result: Block[] = [];
  let color: BlockColor | null = null;
  let index = 0;

  let topBlock = level.columns[columnIndex].blocks[index];
  while (
    (topBlock?.color === color || color === null) &&
    topBlock?.revealed !== false &&
    topBlock !== undefined
  ) {
    result.push(topBlock);
    color = topBlock.color;
    index++;
    topBlock = level.columns[columnIndex].blocks[index];
  }
  return result;
};

export const canPlaceAmount = (
  level: LevelState,
  columnIndex: number,
  blocks: Block[]
): number => {
  const column = level.columns[columnIndex];
  const spaceLeft = column.columnSize - column.blocks.length;

  const setColor = blocks[0].color;
  if (column.limitColor && column.limitColor !== setColor) {
    return 0;
  }
  if (column.blocks[0] && column.blocks[0].color !== setColor) {
    return 0;
  }
  return Math.min(spaceLeft, blocks.length);
};

export const moveBlocks = (
  level: LevelState,
  startColumn: number,
  endColumn: number
): LevelState =>
  produce<LevelState>((draft) => {
    const blocks = selectFromColumn(draft, startColumn);
    const amountToMove = canPlaceAmount(draft, endColumn, blocks);
    const moving = draft.columns[startColumn].blocks.splice(0, amountToMove);

    const topBlockOrigin = draft.columns[startColumn].blocks[0];
    if (topBlockOrigin?.revealed === false) {
      topBlockOrigin.revealed = true;

      let index = 1;
      let nextBlockOrigin = draft.columns[startColumn].blocks[index];
      while (nextBlockOrigin?.color === topBlockOrigin.color) {
        nextBlockOrigin.revealed = true;
        index++;
        nextBlockOrigin = draft.columns[startColumn].blocks[index];
      }
    }
    draft.columns[endColumn].blocks.unshift(...moving);
  })(level);
