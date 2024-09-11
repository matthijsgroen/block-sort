import { shuffle } from "../support/random";
import { timesMap } from "../support/timeMap";
import { BLOCK_COLORS } from "./blocks";
import { BlockColor, Column, LevelState } from "./types";
import { produce } from "immer";

export const generateLevel = (
  random: () => number,
  { amountColors = 2, stackSize = 4, extraPlacementStacks = 2 }
): LevelState => {
  // Generate level, this should be extracted
  const availableColors = BLOCK_COLORS.slice();
  shuffle(availableColors, random);

  const blockColors = availableColors.slice(0, amountColors);

  const amountBars = Math.min(amountColors, 7);
  const blocks: BlockColor[] = [];
  for (const color of blockColors) {
    blocks.push(...new Array(stackSize).fill(color));
  }
  shuffle(blocks, random);

  return {
    colors: blockColors,
    columns: timesMap<Column>(amountBars, () => ({
      type: "placement",
      columnSize: stackSize,
      blocks: new Array(stackSize).fill(0).map(() => blocks.shift()!),
    })).concat(
      timesMap(extraPlacementStacks, () => ({
        type: "placement",
        columnSize: stackSize,
        blocks: [],
      }))
    ),
  };
};

export const selectFromColumn = (
  level: LevelState,
  columnIndex: number
): BlockColor[] => {
  const result: BlockColor[] = [];
  let color: BlockColor | null = null;
  let index = 0;

  let topBlock = level.columns[columnIndex].blocks[index];
  while ((topBlock === color || color === null) && topBlock !== undefined) {
    result.push(topBlock);
    color = topBlock;
    index++;
    topBlock = level.columns[columnIndex].blocks[index];
  }
  return result;
};

export const canPlaceAmount = (
  level: LevelState,
  blocks: BlockColor[]
): number => {
  return 0;
};

export const moveBlocks = (
  level: LevelState,
  startColumn: number,
  endColumn: number
): LevelState =>
  produce<LevelState>((draft) => {
    const blocks = selectFromColumn(draft, startColumn);
  })(level);
