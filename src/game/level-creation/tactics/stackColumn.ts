import { selectFromColumn } from "@/game/actions";
import { BlockColor } from "@/game/blocks";

import { Tactic, WeightedMove } from "./types";

type ColumnData = {
  index: number;
  color: BlockColor;
  seriesLength: number;
  spaceAvailable: number;
};

export const stackColumn: Tactic = (level, _random = Math.random) => {
  // collect color, seriesLength and space above
  const data = level.columns.map<ColumnData | undefined>((c, i) => {
    const topBlock = c.blocks[0];
    if (!topBlock) return undefined;
    const seriesLength = selectFromColumn(level, i).length;

    return {
      index: i,
      color: topBlock.color,
      seriesLength,
      spaceAvailable: c.columnSize - c.blocks.length,
    };
  });

  const potentialTargets = data
    .filter((d): d is ColumnData => d !== undefined && d.spaceAvailable > 0)
    .map((d) => {
      return {
        ...d,
        sources: data.filter(
          (s): s is ColumnData =>
            s !== undefined &&
            s.color === d.color &&
            d.index !== s.index &&
            s.seriesLength <= d.spaceAvailable
        ),
      };
    });

  return potentialTargets.reduce<WeightedMove[]>((r, t) => {
    return r.concat(
      t.sources.map((source) => {
        const revealedColor =
          level.columns[source.index].blocks[source.seriesLength]?.color;
        const hasServiceColor = level.columns.some(
          (column, index) =>
            column.blocks[0]?.color === revealedColor && index !== source.index
        );

        let bonusPoints = 0;
        if (revealedColor === undefined) {
          // stack became empty!
          bonusPoints += 10;
        }
        if (hasServiceColor) {
          bonusPoints += 10;
        }
        return {
          name: "stackColumn",
          move: { from: source.index, to: t.index },
          weight: 10 + bonusPoints,
        };
      })
    );
  }, []);
};
