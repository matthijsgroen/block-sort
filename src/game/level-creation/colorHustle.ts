import { produce } from "immer";

import { shuffle } from "@/support/random";

import { BlockColor, LevelState } from "../types";

export const colorHustle = (
  state: LevelState,
  random = Math.random
): LevelState => {
  const colors: BlockColor[] = state.colors.slice();

  shuffle(colors, random);
  const colorMap = state.colors.reduce<Record<BlockColor, BlockColor>>(
    (map, color, index) => {
      map[color] = colors[index];
      return map;
    },
    {} as Record<BlockColor, BlockColor>
  );

  return produce(state, (draft) => {
    draft.columns.forEach((column) => {
      column.blocks.forEach((block) => {
        block.color = colorMap[block.color];
      });
      if (column.limitColor) {
        column.limitColor = colorMap[column.limitColor];
      }
    });
  });
};
