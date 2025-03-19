import { selectFromColumn } from "@/game/actions";
import type { BlockType } from "@/game/blocks";

import type { Tactic, WeightedMove } from "./types";

type ColumnData = {
  index: number;
  color: BlockType;
  seriesLength: number;
  spaceAvailable: number;
  bottomStacked: boolean;
  columnType: "placement" | "buffer" | "inventory";
};

export const stackColumn: Tactic = (level, _random = Math.random) => {
  // collect color, seriesLength and space above
  const data = level.columns.map<ColumnData | undefined>((c, i) => {
    const topBlock = c.blocks[0];
    if (!topBlock) return undefined;
    if (c.locked) return undefined;
    const seriesLength = selectFromColumn(level, i).length;

    return {
      index: i,
      color: topBlock.blockType,
      seriesLength,
      spaceAvailable: c.columnSize - c.blocks.length,
      bottomStacked: c.blocks.length === seriesLength,
      columnType: c.type
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
            (s.seriesLength <= d.spaceAvailable || d.bottomStacked)
        )
      };
    });

  return potentialTargets.reduce<WeightedMove[]>(
    (r, t) =>
      r.concat(
        t.sources.map((source) => {
          const revealedColor =
            level.columns[source.index].blocks[source.seriesLength]?.blockType;

          const hasServiceColor = level.columns.some(
            (column, index) =>
              column.blocks[0]?.blockType === revealedColor &&
              index !== source.index
          );

          let bonusPoints = 0;
          const targetData = data[t.index];

          if (targetData !== undefined && targetData.spaceAvailable < 2) {
            bonusPoints += 5; // prefer filling up columns
          }
          if (targetData !== undefined && targetData.bottomStacked) {
            bonusPoints += 10; // single color column should have top priority
          }
          if (
            targetData !== undefined &&
            targetData.bottomStacked &&
            level.columns[t.index].type === "placement"
          ) {
            bonusPoints += level.columns[t.index].blocks.length * 4; // single color column should have top priority
          }

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
            weight: 20 + bonusPoints
          };
        })
      ),
    []
  );
};
