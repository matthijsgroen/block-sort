import type { BlockType, LimitColor } from "@/game/blocks";

import type { Tactic, WeightedMove } from "./types";

type ColumnData = {
  index: number;
  blockType?: BlockType;
  limit?: LimitColor;
};

export const limitedColumn: Tactic = (level, _random = Math.random) => {
  // collect columns with limit
  const data = level.columns.map<ColumnData | undefined>((c, i) => {
    const topBlock = c.blocks[0];

    return {
      index: i,
      limit: c.limitColor,
      blockType: topBlock?.blockType
    };
  });

  const potentialTargets = data
    .filter((d): d is ColumnData => d !== undefined && d.limit !== undefined)
    .map((d) => ({
      ...d,
      sources: data.filter(
        (s): s is ColumnData => s !== undefined && s.blockType === d.limit
      )
    }));

  return potentialTargets.reduce<WeightedMove[]>(
    (r, t) =>
      r.concat(
        t.sources.map((source) => ({
          name: "limitColumn",
          move: { from: source.index, to: t.index },
          weight: 15
        }))
      ),
    []
  );
};
