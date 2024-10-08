import { BlockColor } from "@/game/blocks";

import { stackColumn } from "./stackColumn";
import { Tactic, WeightedMove } from "./types";

export const startColumn: Tactic = (level, random = Math.random) => {
  if (stackColumn(level, random).length > 0) return [];

  const emptyColumns = level.columns.reduce<
    { index: number; type: "buffer" | "placement"; limitColor?: BlockColor }[]
  >(
    (r, c, i) =>
      c.blocks.length === 0
        ? r.concat({
            index: i,
            type: c.type,
            limitColor: c.limitColor,
          })
        : r,
    []
  );
  if (emptyColumns.length === 0) return [];

  // count colors
  const colorCount = level.columns.reduce<Record<string, number[]>>(
    (r, c, i) => {
      const block = c.blocks[0];
      if (block) {
        r[block.color] = (r[block.color] ?? []).concat(i);
      }
      return r;
    },
    {}
  );

  return Object.entries(colorCount)
    .reduce<WeightedMove[]>(
      (r, [, positions]) =>
        positions.length > 1
          ? positions.reduce(
              (r, pos) =>
                emptyColumns.reduce(
                  (r, emptyCol) =>
                    r.concat({
                      // name: "startColumn",
                      move: {
                        from: pos,
                        to: emptyCol.index,
                      },
                      weight:
                        emptyCol.limitColor !== undefined &&
                        level.columns[pos].blocks[0]?.color !==
                          emptyCol.limitColor
                          ? -2000
                          : positions.length * 4 +
                            // Prefer placement columns
                            (emptyCol.type === "placement" ? 2 : 0) +
                            // Prefer columns with the same color as the limit color
                            (emptyCol.limitColor ===
                            level.columns[pos].blocks[0]?.color
                              ? 4
                              : 0),
                    }),
                  r
                ),
              r
            )
          : r,
      []
    )
    .filter((m) => m.weight > 0);
};
