import { moveBlocks } from "../actions";
import { hasWon, isStuck } from "../state";
import { LevelSettings, LevelState, Move } from "../types";

import { generateRandomLevel } from "./generateRandomLevel";

const MAX_PLAY_ATTEMPTS = 10;
const MAX_GENERATE_ATTEMPTS = 10;
const MAX_LEVEL_MOVES = 1000;

export const generatePlayableLevel = async (
  settings: LevelSettings,
  random: () => number
): Promise<LevelState> => {
  let attempt = 0;
  while (attempt < MAX_GENERATE_ATTEMPTS) {
    attempt++;
    const level = generateRandomLevel(settings, random);
    if (isStuck(level)) {
      continue;
    }
    const [beatable, moves] = isBeatable(level, random);
    if (beatable) {
      return { ...level, moves };
    }
  }
  throw new Error("Can't generate playable level");
};

const isBeatable = (
  level: LevelState,
  random = Math.random
): [beatable: boolean, moves: Move[]] => {
  let attempt = 0;

  while (attempt < MAX_PLAY_ATTEMPTS) {
    let playLevel = level;
    const moves: Move[] = [];

    while (!isStuck(playLevel)) {
      const nextMove = getMove(random, playLevel);
      if (!nextMove) {
        break;
      } else {
        if (moves.length > MAX_LEVEL_MOVES) {
          break;
        }
        moves.push(nextMove);
        playLevel = moveBlocks(playLevel, nextMove.from, nextMove.to);
      }
      if (hasWon(playLevel)) {
        return [true, moves];
      }
    }
    attempt++;
  }

  return [false, []];
};

const getMove = (random: () => number, level: LevelState): Move | null => {
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

  return { from: source.source, to: source.destinations[pickDestination] };
};
