import type { solvers } from "./level-creation/solvers";
import type { BlockColor, BlockType, LimitColor } from "./blocks";
import type { Block, Column, LevelState } from "./types";

export const createLevelState = (
  columns: Column[],
  solver: keyof typeof solvers = "default"
): LevelState => {
  const blockTypes = columns.reduce<BlockType[]>(
    (r, c) =>
      c.blocks.reduce<BlockType[]>(
        (r, b) => (r.includes(b.blockType) ? r : r.concat(b.blockType)),
        r
      ),
    []
  );
  blockTypes.sort();

  const state: LevelState = {
    blockTypes,
    columns,
    moves: []
  };
  if (solver !== "default") {
    state.solver = solver;
  }
  return state;
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
  blocks: Block[] = [],
  type: Exclude<Column["type"], "placement"> = "buffer"
): Column => ({
  type,
  locked: false,
  columnSize: size,
  blocks,
  limitColor
});

/**
 * Creates a single oversized placement column: empty, with a fixed limitColor
 * and the oversized flag set. Its columnSize is `multiplier × stackSize`,
 * which is typically larger than the level's regular stackSize.
 */
export const createOversizedColumn = (
  size: number,
  limitColor: BlockColor
): Column => ({
  type: "placement",
  locked: false,
  columnSize: size,
  blocks: [],
  limitColor,
  oversized: true
});

export const createBlock = (blockType: BlockType, hidden?: boolean): Block => ({
  blockType,
  revealed: hidden !== true
});

export const createBlocks = (...color: BlockType[]) =>
  color.map((c) => createBlock(c));

export const createBlockSeries = (amount: number, blockType: BlockType) =>
  Array.from({ length: amount }, () => createBlock(blockType));

export const createHiddenBlocks = (...blockTypes: BlockType[]) =>
  blockTypes.map((c, i) => createBlock(c, i > 0));
