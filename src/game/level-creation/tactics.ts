import { pickWeighted, Weighted } from "@/support/random";

import { moveBlocks } from "../actions";
import { debugLevel } from "../debugLevel";
import { hasWon, isStuck } from "../state";
import { LevelState, Move } from "../types";

import { randomMove } from "./tactics/randomMove";
import { Tactic } from "./tactics/types";
import { generateRandomLevel, LevelSettings } from "./generateRandomLevel";

const MAX_PLAY_ATTEMPTS = 20;
const MAX_GENERATE_ATTEMPTS = 50;
const MAX_LEVEL_MOVES = 1000;

const tactics: Tactic[] = [randomMove];

export const generatePlayableLevel = (
  settings: LevelSettings,
  random = Math.random
): LevelState => {
  let attempt = 0;
  while (attempt < MAX_GENERATE_ATTEMPTS) {
    attempt++;
    const level = generateRandomLevel(settings, random);
    if (isStuck(level)) {
      continue;
    }
    debugLevel(level);
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
      const potentialMoves = tactics.reduce<Weighted<{ move: Move }>[]>(
        (r, tactic) => r.concat(tactic(level, random)),
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
        return [true, moves];
      }
    }
    attempt++;
  }

  return [false, []];
};
