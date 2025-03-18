import { moveBlocks } from "../actions";
import { hasWon, isStuck } from "../state";
import type { LevelState, Move } from "../types";

import type { Tactic, WeightedMove } from "./solver-tactics/types";
import type { Solver } from "./types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const MAX_LEVEL_MOVES = 2_000; // The dumb moves get filtered out, so this is a safe upper limit

export const FAIL_STATE: [beaten: boolean, moves: Move[], cost: number] = [
  false,
  [],
  0
];

export const configureSolver =
  (
    tactics: Tactic[],
    scoreState: (level: LevelState) => number,
    scoreStateWithMove: (state: LevelState, move: Move) => number,
    lookAheadCount: number
  ): Solver =>
  async (level, random = Math.random, displayState) => {
    let playLevel = level;
    const moves: Move[] = [];

    while (!isStuck(playLevel)) {
      const nextMove = evaluateBestMove(
        playLevel,
        tactics,
        scoreStateWithMove,
        scoreState,
        lookAheadCount,
        random
      );

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
            return FAIL_STATE;
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

    return FAIL_STATE;
  };

const lookahead = (
  state: LevelState,
  move: Move,
  depth: number,
  tactics: Tactic[],
  scoreStateWithMove: (state: LevelState, move: Move) => number,
  scoreState: (state: LevelState) => number,
  random = Math.random
): number => {
  if (depth === 0) {
    return scoreStateWithMove(state, move); // Base case: return the score of the current state
  }
  const nextState = moveBlocks(state, move);

  const moves = generatePossibleMoves(state, tactics, random);
  if (moves.length === 0) {
    return scoreState(state); // No more moves available, return score
  }

  let bestScore = -Infinity;

  for (const move of moves) {
    const score = lookahead(
      nextState,
      move.move,
      depth - 1,
      tactics,
      scoreStateWithMove,
      scoreState,
      random
    ); // Recursive lookahead
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
  tactics: Tactic[],
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
  tactics: Tactic[],
  scoreStateWithMove: (state: LevelState, move: Move) => number,
  scoreState: (state: LevelState) => number,
  lookAheadCount: number,
  random = Math.random
): WeightedMove | null => {
  const possibleMoves = generatePossibleMoves(initialState, tactics, random);

  let bestMove: WeightedMove | null = null;
  let bestScore = -Infinity;

  for (const move of possibleMoves) {
    const moveScore = lookahead(
      initialState,
      move.move,
      lookAheadCount,
      tactics,
      scoreStateWithMove,
      scoreState,
      random
    );

    if (moveScore > bestScore) {
      bestScore = moveScore;
      bestMove = move;
    }
  }

  return bestMove;
};
