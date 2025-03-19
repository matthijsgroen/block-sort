import type { BlockType, LimitColor } from "@/game/blocks";
import type { solvers } from "@/game/level-creation/solvers";
import type { LevelState, Move } from "@/game/types";

export type LevelStateV1 = {
  solver?: keyof typeof solvers;
  colors: BlockType[];
  width?: number;
  columns: ColumnV1[];
  moves: Move[];
  generationInformation?: {
    cost?: number;
    attempts?: number;
    seed?: number;
  };
};

type ColumnV1 = {
  type: "placement" | "buffer" | "inventory";
  locked: boolean;
  limitColor?: LimitColor;
  columnSize: number;
  blocks: BlockV1[];
  paddingTop?: number;
};

type BlockV1 = {
  color: BlockType;
  revealed?: boolean;
};

export const isVersion1 = (value: unknown): value is LevelStateV1 =>
  (value as LevelStateV1).colors !== undefined &&
  (value as LevelStateV1).columns.some((c) =>
    c.blocks.some((b) => (b as BlockV1).color !== undefined)
  );

export const migrateFromVersion1 = (value: LevelStateV1): LevelState => {
  const copy = { ...value } as unknown as LevelState;
  copy.blockTypes = value.colors;
  copy.columns = value.columns.map((c) => ({
    ...c,
    blocks: c.blocks.map((b) => ({
      blockType: b.color,
      revealed: b.revealed
    }))
  }));
  if ("colors" in copy) {
    delete copy.colors;
  }

  return copy;
};
