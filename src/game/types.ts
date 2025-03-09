import { solvers } from "./level-creation/solvers";
import { BlockColor, LimitColor } from "./blocks";
export { type BlockColor } from "./blocks";

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
  colors: BlockColor[];
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
   * Color of the block
   */
  color: BlockColor;
  /**
   * Wether the block color is revealed to the player
   * @default true
   */
  revealed?: boolean;
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
  solver?: keyof typeof solvers;
  amountColors?: number;
  hideBlockTypes?: "none" | "all" | "checker";
  stackSize?: number;
  stacksPerColor?: number;
  extraPlacementStacks?: number;
  extraPlacementLimits?: number;
  buffers?: number;
  bufferSizes?: number;
  blockColorPick?: "start" | "end";
  bufferPlacementLimits?: number;
  extraBuffers?: {
    size: number;
    amount: number;
    limit: number;
    unlimited?: boolean;
  }[];
  playMoves?: [minCount: number, maxPercent: number];
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
