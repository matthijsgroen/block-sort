import { moveBlocks } from "../actions";
import { hasWon, isStuck } from "../state";
import { LevelState, Move } from "../types";

import { randomMove } from "./solver-tactics/randomMove";
import { stackColumn } from "./solver-tactics/stackColumn";
import { startColumn } from "./solver-tactics/startColumn";
import { Tactic, WeightedMove } from "./solver-tactics/types";
import { scoreState, scoreStateWithMove } from "./scoreState";
import { Solver } from "./types";

const tactics: Tactic[] = [randomMove, startColumn, stackColumn];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const MAX_LEVEL_MOVES = 2_000; // The dumb moves get filtered out, so this is a safe upper limit

export const defaultSolver: Solver = async (
  level,
  random = Math.random,
  displayState
) => {
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

      moves.push({
        from: nextMove.move.from,
        to: nextMove.move.to,
        tactic: nextMove.name
      });

      playLevel = moveBlocks(playLevel, nextMove.move);
      if (displayState) {
        const keepSolving = await displayState(
          playLevel,
          nextMove.move,
          nextMove.name ?? "unknown",
          moves.length
        );
        if (!keepSolving) {
          return [false, [], 0];
        }
      }
      if (moves.length % 30 === 0) {
        await delay(2);
      }
    }
    if (hasWon(playLevel)) {
      return [true, moves, moves.length + MAX_LEVEL_MOVES];
    }
  }

  return [false, [], 0];
};

const lookahead = (
  state: LevelState,
  move: Move,
  depth: number,
  random = Math.random
): number => {
  if (depth === 0) {
    return scoreStateWithMove(state, move); // Base case: return the score of the current state
  }
  const nextState = moveBlocks(state, move);

  const moves = generatePossibleMoves(state, random);
  if (moves.length === 0) {
    return scoreState(state); // No more moves available, return score
  }

  let bestScore = -Infinity;

  for (const move of moves) {
    const score = lookahead(nextState, move.move, depth - 1, random); // Recursive lookahead
    bestScore = Math.max(bestScore, score); // Track the best score
  }

  return bestScore;
};

const removeDoubleMoves = (
  move: WeightedMove,
  index: number,
  list: WeightedMove[]
) =>
  list.findIndex(
    (m2) => m2.move.from === move.move.from && m2.move.to === move.move.to
  ) === index;

const generatePossibleMoves = (
  state: LevelState,
  random = Math.random
): WeightedMove[] =>
  tactics
    .reduce<WeightedMove[]>(
      (r, tactic) =>
        r.concat(
          tactic(state, random)
            .sort((a, b) => a.weight - b.weight)
            .slice(0, 3)
        ),
      []
    )
    .filter(removeDoubleMoves);

const evaluateBestMove = (
  initialState: LevelState,
  random = Math.random
): WeightedMove | null => {
  const possibleMoves = generatePossibleMoves(initialState, random);

  let bestMove: WeightedMove | null = null;
  let bestScore = -Infinity;

  for (const move of possibleMoves) {
    const moveScore = lookahead(initialState, move.move, 2, random);

    if (moveScore > bestScore) {
      bestScore = moveScore;
      bestMove = move;
    }
  }

  return bestMove;
};
