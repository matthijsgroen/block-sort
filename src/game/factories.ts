import { LimitColor } from "./blocks";
import { Block, BlockColor, Column, LevelState } from "./types";

export const createLevelState = (columns: Column[]): LevelState => {
  const colors = columns.reduce<BlockColor[]>(
    (r, c) =>
      c.blocks.reduce<BlockColor[]>(
        (r, b) => (r.includes(b.color) ? r : r.concat(b.color)),
        r
      ),
    []
  );
  colors.sort();

  return {
    colors,
    columns,
    moves: []
  };
};

export const createPlacementColumn = (
  size: number,
  blocks: Block[] = [],
  limitColor?: LimitColor,
  locked = false
): Column => ({
  type: "placement",
  locked,
  columnSize: size,
  blocks,
  limitColor
});

export const createBufferColumn = (
  size: number,
  limitColor?: LimitColor,
  blocks: Block[] = []
): Column => ({
  type: "buffer",
  locked: false,
  columnSize: size,
  blocks,
  limitColor
});

export const createBlock = (color: BlockColor, hidden?: boolean) => ({
  color,
  revealed: hidden !== true
});

export const createBlocks = (...color: BlockColor[]) =>
  color.map((c) => createBlock(c));

export const createBlockSeries = (amount: number, color: BlockColor) =>
  Array.from({ length: amount }, () => createBlock(color));

export const createHiddenBlocks = (...color: BlockColor[]) =>
  color.map((c, i) => createBlock(c, i > 0));
