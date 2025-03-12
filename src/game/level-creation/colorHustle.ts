import { produce } from "immer";

import { shuffle } from "@/support/random";

import type { BlockColor, LevelState } from "../types";

export const colorHustle = (
  state: LevelState,
  random = Math.random
): LevelState => {
  const colors: BlockColor[] = state.blockTypes.slice();

  shuffle(colors, random);
  const colorMap = state.blockTypes.reduce<Record<BlockColor, BlockColor>>(
    (map, color, index) => {
      map[color] = colors[index];
      return map;
    },
    {} as Record<BlockColor, BlockColor>
  );

  return produce(state, (draft) => {
    draft.columns.forEach((column) => {
      column.blocks.forEach((block) => {
        block.blockType = colorMap[block.blockType];
      });
      if (column.limitColor && column.limitColor !== "rainbow") {
        column.limitColor = colorMap[column.limitColor];
      }
    });
  });
};
