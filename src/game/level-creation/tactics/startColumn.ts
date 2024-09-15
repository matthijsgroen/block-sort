import { pick } from "@/support/random";

import { stackColumn } from "./stackColumn";
import { Tactic, WeightedMove } from "./types";

export const startColumn: Tactic = (level, random = Math.random) => {
  const emptyColumns = level.columns.reduce<number[]>(
    (r, c, i) =>
      c.blocks.length === 0 && c.limitColor === undefined ? r.concat(i) : r,
    []
  );
  if (emptyColumns.length === 0) return [];
  if (stackColumn(level, random).length > 0) return [];

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

  return Object.entries(colorCount).reduce<WeightedMove[]>(
    (r, [, positions]) =>
      positions.length > 1
        ? positions.reduce(
            (r, pos) =>
              r.concat({
                name: "startColumn",
                move: {
                  from: pos,
                  to: pick(emptyColumns, random),
                },
                weight: 5,
              }),
            r
          )
        : r,
    []
  );
};
