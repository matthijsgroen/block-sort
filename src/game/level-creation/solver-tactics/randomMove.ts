import { pick } from "@/support/random";
import { timesMap } from "@/support/timeMap";

import { canPlaceBlock, isColumnCorrectlySorted } from "./support";
import type { Tactic } from "./types";

export const randomMove: Tactic = (level, random = Math.random) => {
  const sourceOptions = level.columns.reduce<
    { source: number; destinations: number[] }[]
  >((r, c, source) => {
    if (c.locked) {
      return r;
    }
    const block = c.blocks[0];
    if (block === undefined) {
      return r;
    }
    if (isColumnCorrectlySorted(c)) {
      return r;
    }

    const destinations = level.columns.reduce<number[]>(
      (res, d, destination) => {
        if (destination === source) return res;
        if (canPlaceBlock(d, block)) {
          return res.concat(destination);
        }
        return res;
      },
      []
    );

    if (destinations.length === 0) {
      return r;
    }

    return r.concat({ source, destinations });
  }, []);
  if (sourceOptions.length === 0) {
    return [];
  }

  return timesMap(2, () => {
    const source = pick(sourceOptions, random);
    const pickDestination = pick(source.destinations, random);

    return {
      name: "randomMove",
      move: { from: source.source, to: pickDestination },
      weight: 1
    };
  });
};
