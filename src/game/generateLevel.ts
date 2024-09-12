import { shuffle } from "../support/random";
import { timesMap } from "../support/timeMap";
import { moveBlocks } from "./actions";
import { BLOCK_COLORS } from "./blocks";
import {
  createBlock,
  createBufferColumn,
  createPlacementColumn,
} from "./factories";
import { hasWon, isStuck } from "./state";
import { BlockColor, Column, LevelState } from "./types";

export type LevelSettings = {
  amountColors?: number;
  hideBlockTypes?: boolean;
  stackSize?: number;
  extraPlacementStacks?: number;
  extraPlacementLimits?: number;
  buffers?: number;
  bufferSizes?: number;
};

const MAX_PLAY_ATTEMPTS = 20;
const MAX_GENERATE_ATTEMPTS = 50;
const MAX_LEVEL_MOVES = 1000;

const delay = async (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generatePlayableLevel = async (
  random: () => number,
  settings: LevelSettings
): Promise<LevelState> => {
  let attempt = 0;
  while (attempt < MAX_GENERATE_ATTEMPTS) {
    attempt++;
    const level = generateLevel(random, settings);
    if (isStuck(level)) {
      continue;
    }
    const [beatable, moves] = isBeatable(random, level);
    if (beatable) {
      return { ...level, movesNeeded: moves };
    }
  }
  throw new Error("Can't generate playable level");
};

const isBeatable = (
  random: () => number,
  level: LevelState
): [beatable: boolean, moves: number] => {
  let attempt = 0;

  while (attempt < MAX_PLAY_ATTEMPTS) {
    let playLevel = level;
    let moves = 0;

    while (!isStuck(playLevel)) {
      const nextMove = getMove(random, playLevel);
      if (!nextMove) {
        break;
      } else {
        moves++;
        if (moves > MAX_LEVEL_MOVES) {
          break;
        }
        playLevel = moveBlocks(playLevel, nextMove[0], nextMove[1]);
      }
      if (hasWon(playLevel)) {
        return [true, moves];
      }
    }
    attempt++;
  }

  return [false, 0];
};

const getMove = (
  random: () => number,
  level: LevelState
): [from: number, to: number] | null => {
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
      const destBlock = c.blocks[0];

      // TODO: Needs refactor for readability
      if (destBlock?.color === block.color && c.columnSize > c.blocks.length) {
        return r.concat(destination);
      }
      if (
        destBlock === undefined &&
        (c.limitColor === undefined || c.limitColor === block.color) &&
        c.columnSize > c.blocks.length
      ) {
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
    return null;
  }
  const pickSource = Math.round(random() * (sourceOptions.length - 1));
  const source = sourceOptions[pickSource];
  const pickDestination = Math.round(
    random() * (source.destinations.length - 1)
  );

  return [source.source, source.destinations[pickDestination]];
};

export const generateLevel = (
  random: () => number,
  {
    amountColors = 2,
    stackSize = 4,
    extraPlacementStacks = 2,
    extraPlacementLimits = 0,
    buffers = 0,
    bufferSizes = 1,
    hideBlockTypes = false,
  }: LevelSettings
): LevelState => {
  // Generate level, this should be extracted
  const availableColors = BLOCK_COLORS.slice();
  shuffle(availableColors, random);

  const blockColors = availableColors.slice(0, amountColors);
  const placementLimits =
    extraPlacementLimits > 0 ? blockColors.slice(-extraPlacementLimits) : [];

  const amountBars = Math.min(amountColors, 7);
  const blocks: BlockColor[] = [];
  for (const color of blockColors) {
    blocks.push(...new Array(stackSize).fill(color));
  }
  shuffle(blocks, random);

  return {
    colors: blockColors,
    columns: timesMap<Column>(amountBars, () =>
      createPlacementColumn(
        stackSize,
        new Array(stackSize)
          .fill(0)
          .map((_, i) =>
            createBlock(blocks.shift()!, hideBlockTypes && i !== 0)
          )
      )
    )
      .concat(
        timesMap(extraPlacementStacks, (i) =>
          createPlacementColumn(stackSize, [], placementLimits[i])
        )
      )
      .concat(timesMap(buffers, () => createBufferColumn(bufferSizes))),
  };
};
