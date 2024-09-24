import { moveBlocks } from "../actions";
import { allShuffled, hasWon, isStuck } from "../state";
import { LevelState, Move } from "../types";

import { randomMove } from "./tactics/randomMove";
import { stackColumn } from "./tactics/stackColumn";
import { startColumn } from "./tactics/startColumn";
import { Tactic, WeightedMove } from "./tactics/types";
import { generateRandomLevel, LevelSettings } from "./generateRandomLevel";
import { scoreState } from "./scoreState";

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

const generatePossibleMoves = (
  state: LevelState,
  random = Math.random
): Move[] => {
  return tactics
    .reduce<WeightedMove[]>(
      (r, tactic) =>
        r.concat(
          tactic(state, random)
            .sort((a, b) => a.weight - b.weight)
            .slice(0, 3) // take the 3 best moves
        ),
      []
    )
    .map((move) => move.move);
};

const lookahead = (
  state: LevelState,
  depth: number,
  random = Math.random
): number => {
  if (depth === 0) {
    return scoreState(state); // Base case: return the score of the current state
  }

  const moves = generatePossibleMoves(state, random);
  if (moves.length === 0) {
    return scoreState(state); // No more moves available, return score
  }

  let bestScore = -Infinity;
  for (const move of moves) {
    const newState = moveBlocks(state, move.from, move.to);
    const score = lookahead(newState, depth - 1, random); // Recursive lookahead
    bestScore = Math.max(bestScore, score); // Track the best score
  }

  return bestScore;
};

const evaluateBestMove = (
  initialState: LevelState,
  random = Math.random
): Move | null => {
  const possibleMoves = generatePossibleMoves(initialState, random);

  let bestMove: Move | null = null;
  let bestScore = -Infinity;

  for (const move of possibleMoves) {
    const nextState = moveBlocks(initialState, move.from, move.to);
    const moveScore = lookahead(nextState, 2, random); // Look 1 move ahead (so total of 2 moves including this one)

    if (moveScore > bestScore) {
      bestScore = moveScore;
      bestMove = move;
    }
  }

  return bestMove;
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
      const nextMove = evaluateBestMove(playLevel, random);

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
        return [true, moves, moves.length + MAX_LEVEL_MOVES * attempt];
      }
    }
    attempt++;
  }

  return [false, [], 0];
};
