import { BlockColor } from "@/game/blocks";

import { Tactic, WeightedMove } from "./types";

type ColumnData = {
  index: number;
  color?: BlockColor;
  limit?: BlockColor | "rainbow";
};

export const limitedColumn: Tactic = (level, _random = Math.random) => {
  // collect columns with limit
  const data = level.columns.map<ColumnData | undefined>((c, i) => {
    const topBlock = c.blocks[0];

    return {
      index: i,
      limit: c.limitColor,
      color: topBlock?.color
    };
  });

  const potentialTargets = data
    .filter((d): d is ColumnData => d !== undefined && d.limit !== undefined)
    .map((d) => ({
      ...d,
      sources: data.filter(
        (s): s is ColumnData => s !== undefined && s.color === d.limit
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
