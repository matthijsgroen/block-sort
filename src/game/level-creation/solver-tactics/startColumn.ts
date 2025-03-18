import type { LimitColor } from "@/game/blocks";

import { stackColumn } from "./stackColumn";
import type { Tactic, WeightedMove } from "./types";

export const startColumn: Tactic = (level, random = Math.random) => {
  const canStack = stackColumn(level, random);
  if (canStack.length > 0) return canStack;

  const emptyColumns = level.columns.reduce<
    {
      index: number;
      type: "buffer" | "placement";
      limitColor?: LimitColor;
    }[]
  >(
    (r, c, i) =>
      c.blocks.length === 0 && c.type !== "inventory"
        ? r.concat({
            index: i,
            type: c.type,
            limitColor: c.limitColor
          })
        : r,
    []
  );
  if (emptyColumns.length === 0) return [];

  // count colors
  const colorCount = level.columns.reduce<Record<string, number[]>>(
    (r, c, i) => {
      const block = c.blocks[0];
      if (c.locked) return r;
      if (block) {
        r[block.blockType] = (r[block.blockType] ?? []).concat(i);
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
                      name: "startColumn",
                      move: {
                        from: pos,
                        to: emptyCol.index
                      },
                      weight:
                        emptyCol.limitColor !== undefined &&
                        level.columns[pos].blocks[0]?.blockType !==
                          emptyCol.limitColor &&
                        emptyCol.limitColor !== "rainbow"
                          ? -2000
                          : positions.length * 4 +
                            // Prefer placement columns
                            (level.columns[pos].type === "buffer" ? 2 : 0) +
                            (emptyCol.type === "buffer" ? -3 : 1) +
                            // Prefer columns with the same color as the limit color
                            (emptyCol.limitColor ===
                            level.columns[pos].blocks[0]?.blockType
                              ? 4
                              : 0)
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
