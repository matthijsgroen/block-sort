import type { HideFormat } from "@/ui/Block/Block";

import type { solvers } from "./level-creation/solvers";
import type { BlockType, LimitColor } from "./blocks";
import type { BlockTheme } from "./themes";

/**
 * The current state of a level.
 *
 * Changes to this structure should be checked in
 * the data transfer functions (in the 'gameData' file).
 */
export type LevelState = {
  /**
   * @default "default"
   */
  solver?: keyof typeof solvers;
  /**
   * Colors in play for this level
   */
  blockTypes: BlockType[];
  width?: number;
  /**
   * Column in this level
   */
  columns: Column[];
  /**
   * moves the solver took to solve this level
   */
  moves: Move[];
  generationInformation?: {
    cost?: number;
    attempts?: number;
    seed?: number;
  };
};

/**
 * Move of blocks, it moves all revealed blocks of the same kind
 * to the destination column. It will place the ones that fit, and
 * move back the ones that do not.
 */
export type Move = {
  tactic?: string;
  /**
   * Index of the source column
   */
  from: number;
  /**
   * Index of the destination column
   */
  to: number;
};

export type Block = {
  /**
   * Type of the block (color / lock / key)
   */
  blockType: BlockType;
  /**
   * Wether the block color is revealed to the player
   * @default true
   */
  revealed?: boolean;
};

export type BufferSettings = {
  /**
   * Amount of blocks it can contain
   */
  size: number;
  /**
   * Amount of colors of this configuration
   */
  amount: number;
  /**
   * Amount of columns that will be limited in block-type
   */
  limit: number;
  /**
   * Can blocks of different kinds be freely stacked
   */
  bufferType?: "normal" | "unlimited" | "inventory";
};

/**
 * Column in the level
 */
export type Column = {
  /**
   * Type of column. Placement columns can get locked
   * if filled with all blocks of the same color.
   *
   * Buffer columns never get locked, and are meant for temporary storage.
   */
  type: "placement" | "buffer" | "inventory";
  /**
   * Wether the column is locked
   */
  locked: boolean;
  /**
   * if set, the column only allows blocks of the specified color.
   */
  limitColor?: LimitColor;
  /**
   * Amount of blocks that fit in this column
   */
  columnSize: number;
  /**
   * The blocks currently in this column
   * the first index is always the top block.
   */
  blocks: Block[];
  paddingTop?: number;
};

/**
 * Structure of a level to generate.
 *
 * Changes to this structure should be checked in the hash function
 * and the data transfer functions (in the 'gameData' file).
 */
export type LevelSettings = {
  /**
   * Solver algorithm to use for this level
   */
  solver?: keyof typeof solvers;
  /**
   * Amount of colors in play
   */
  amountColors?: number;
  /**
   * Hide block types:
   *
   * - "none": no blocks are hidden
   * - "all": all blocks, except the top ones are hidden
   * - "checker": blocks are hidden in a checker pattern
   *
   */
  hideBlockTypes?: "none" | "all" | "checker";
  /**
   * Height of the columns in this level
   */
  stackSize?: number;
  /**
   * How many colors can be filled with the same color.
   *
   * @default 1
   */
  stacksPerColor?: number;
  /**
   * Extra columns to place blocks in
   */
  extraPlacementStacks?: number;
  /**
   * How many of the extra placement stacks should have a limit on block type
   */
  extraPlacementLimits?: number;
  /**
   * Amount of buffer columns in this levels
   *
   * @deprecated use extraBuffers instead for more precise configuration
   */
  buffers?: number;
  /**
   * Height of the buffer columns
   *
   * @deprecated use extraBuffers instead for more precise configuration
   */
  bufferSizes?: number;
  /**
   * How many of the buffer stacks should have a limit on block type
   *
   * @deprecated use extraBuffers instead for more precise configuration
   */
  bufferPlacementLimits?: number;
  /**
   * Should the column colors used in this level be picked from the front or the back of the color list
   *
   * @default "start"
   */
  blockColorPick?: "start" | "end";

  /**
   * Configuration of extra buffer columns.
   */
  extraBuffers?: BufferSettings[];
  playMoves?: [minCount: number, maxPercent: number];
  /**
   * Amount of variation in locks and keys
   *
   * @default 0
   */
  amountLockTypes?: number;
  /**
   * From what position should we start picking locks and key pairs from the list
   *
   * @default 0
   */
  lockOffset?: number;
  /**
   * Amount of lock / key pairs in the level
   *
   * @default 0
   */
  amountLocks?: number;
  layoutMap?: LayoutMap;
};

export type SettingsProducer = (difficulty: number) => LevelSettings;

export type LayoutMap = {
  width?: number;
  columns: {
    fromColumn: number;
    toColumn?: number;
    paddingTop?: number;
  }[];
};

export type LevelModifiers = {
  theme?: BlockTheme;
  ghostMode?: boolean;
  hideMode?: HideFormat;
  keepRevealed?: boolean;
  hideEvery?: number;
};

export type MultiStageLevelSettings = {
  stages: {
    settings: LevelSettings;
    levelModifiers?: LevelModifiers;
    backgroundClassname?: string;
    name?: string;
  }[];
};
