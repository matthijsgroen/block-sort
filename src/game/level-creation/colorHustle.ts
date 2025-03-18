import { produce } from "immer";

import { shuffle } from "@/support/random";

import type { BlockColor } from "../blocks";
import { isColorType } from "../state";
import type { LevelState } from "../types";

export const colorHustle = (
  state: LevelState,
  random = Math.random
): LevelState => {
  const blockColors: BlockColor[] = state.colors.filter((b) =>
    isColorType(b)
  );
  const shuffledColors = blockColors.slice();

  shuffle(shuffledColors, random);
  const colorMap = blockColors.reduce<Record<BlockColor, BlockColor>>(
    (map, color, index) => {
      map[color] = shuffledColors[index];
      return map;
    },
    {} as Record<BlockColor, BlockColor>
  );

  return produce(state, (draft) => {
    draft.columns.forEach((column) => {
      column.blocks.forEach((block) => {
        if (isColorType(block.color)) {
          block.color = colorMap[block.color];
        }
      });
      if (column.limitColor && column.limitColor !== "rainbow") {
        column.limitColor = colorMap[column.limitColor];
      }
    });
  });
};
