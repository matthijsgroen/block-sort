import { pickWeighted } from "@/support/random";

import { moveBlocks } from "../actions";
import { allShuffled, hasWon, isStuck } from "../state";
import { LevelState, Move } from "../types";

import { randomMove } from "./tactics/randomMove";
import { stackColumn } from "./tactics/stackColumn";
import { startColumn } from "./tactics/startColumn";
import { Tactic, WeightedMove } from "./tactics/types";
import { generateRandomLevel, LevelSettings } from "./generateRandomLevel";

const MAX_PLAY_ATTEMPTS = 5;
const MAX_GENERATE_ATTEMPTS = 50;
const MAX_LEVEL_MOVES = 800;

const MAX_GENERATE_COST = MAX_LEVEL_MOVES * MAX_PLAY_ATTEMPTS;

const tactics: Tactic[] = [randomMove, startColumn, stackColumn];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generatePlayableLevel = async (
  settings: LevelSettings,
  random = Math.random
): Promise<LevelState> => {
  let attempt = 0;
  while (attempt < MAX_GENERATE_ATTEMPTS) {
    attempt++;
    delay(4);
    const level = generateRandomLevel(settings, random);
    if (isStuck(level) || !allShuffled(level)) {
      continue;
    }
    const [beatable, moves, cost] = isBeatable(level, random);
    if (beatable) {
      if (
        settings.minimalAmountOfMoves !== undefined &&
        moves.length < settings.minimalAmountOfMoves
      ) {
        continue;
      }
      if (
        settings.maximalAmountOfMoves !== undefined &&
        moves.length > settings.maximalAmountOfMoves
      ) {
        continue;
      }
      return { ...level, moves, cost: cost + attempt * MAX_GENERATE_COST };
    }
  }
  throw new Error("Can't generate playable level");
};

const isBeatable = (
  level: LevelState,
  random = Math.random
): [beatable: boolean, moves: Move[], cost: number] => {
  let attempt = 0;

  while (attempt < MAX_PLAY_ATTEMPTS) {
    let playLevel = level;
    const moves: Move[] = [];

    while (!isStuck(playLevel)) {
      const potentialMoves = tactics.reduce<WeightedMove[]>(
        (r, tactic) => r.concat(tactic(playLevel, random)),
        []
      );

      const nextMove = pickWeighted(potentialMoves, random);

      if (!nextMove) {
        break;
      } else {
        if (moves.length > MAX_LEVEL_MOVES) {
          break;
        }

        moves.push(nextMove.move);

        playLevel = moveBlocks(playLevel, nextMove.move.from, nextMove.move.to);
      }
      if (hasWon(playLevel)) {
        return [true, moves, moves.length + MAX_LEVEL_MOVES * attempt];
      }
    }
    attempt++;
  }

  return [false, [], 0];
};
