import { Block, BlockColor, Column } from "./types";

export const createPlacementColumn = (
  size: number,
  blocks: Block[] = [],
  limitColor?: BlockColor,
  locked = false
): Column => ({
  type: "placement",
  locked,
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
