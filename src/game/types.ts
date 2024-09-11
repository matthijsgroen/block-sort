import { BlockColor } from "./blocks";
export { type BlockColor } from "./blocks";

export type LevelState = {
  colors: BlockColor[];
  columns: Column[];
};

export type Block = {
  color: BlockColor;
  revealed?: boolean;
};

export type Column = {
  type: "placement" | "buffer";
  locked: boolean;
  limitColor?: BlockColor;
  columnSize: number;
  blocks: Block[];
};
