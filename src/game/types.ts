import { BLOCK_COLORS } from "./blocks";

export type BlockColor = (typeof BLOCK_COLORS)[number];

export type LevelState = {
  colors: BlockColor[];
  columns: Column[];
};

export type Column = {
  type: "placement" | "buffer";
  limitColor?: BlockColor;
  columnSize: number;
  blocks: BlockColor[];
};
