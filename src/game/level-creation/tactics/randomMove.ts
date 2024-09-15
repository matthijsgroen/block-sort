import { canPlaceBlock } from "./support";
import { Tactic } from "./types";

export const randomMove: Tactic = (level, random = Math.random) => {
  const sourceOptions = level.columns.reduce<
    { source: number; destinations: number[] }[]
  >((r, c, source) => {
    if (c.locked) {
      return r;
    }
    const block = c.blocks[0];
    if (!block) {
      return r;
    }

    const destinations = level.columns.reduce<number[]>((r, c, destination) => {
      if (destination === source) return r;

      if (canPlaceBlock(c, block)) {
        return r.concat(destination);
      }

      return r;
    }, []);
    if (destinations.length === 0) {
      return r;
    }

    return r.concat({ source, destinations });
  }, []);
  if (sourceOptions.length === 0) {
    return [];
  }
  const pickSource = Math.round(random() * (sourceOptions.length - 1));
  const source = sourceOptions[pickSource];
  const pickDestination = Math.round(
    random() * (source.destinations.length - 1)
  );

  return [
    {
      name: "randomMove",
      move: { from: source.source, to: source.destinations[pickDestination] },
      weight: 1,
    },
  ];
};
