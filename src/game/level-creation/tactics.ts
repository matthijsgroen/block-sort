import { mulberry32 } from "@/support/random";

import { moveBlocks } from "../actions";
import { allShuffled, hasWon, isStuck } from "../state";
import { LevelSettings, LevelState, Move } from "../types";

import { randomMove } from "./tactics/randomMove";
import { stackColumn } from "./tactics/stackColumn";
import { startColumn } from "./tactics/startColumn";
import { Tactic, WeightedMove } from "./tactics/types";
import { generateRandomLevel } from "./generateRandomLevel";
import { scoreState } from "./scoreState";

const MAX_PLAY_ATTEMPTS = 1;
const MAX_GENERATE_ATTEMPTS = 500;
const MAX_LEVEL_MOVES = 1000;

const MAX_GENERATE_COST = MAX_LEVEL_MOVES * MAX_PLAY_ATTEMPTS;

const tactics: Tactic[] = [randomMove, startColumn, stackColumn];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generatePlayableLevel = async (
  settings: LevelSettings,
  random = Math.random,
  seed: number | null = null
): Promise<LevelState> => {
  // Start logging level seeds for faster reproduction
  const startSeed = seed ?? Math.floor(random() * 1e9);

  let attempt = 0;
  while (attempt < MAX_GENERATE_ATTEMPTS) {
    const seed = startSeed + attempt;
    const generationRandom = mulberry32(seed);

    attempt++;
    const level = generateRandomLevel(settings, generationRandom);
    if (isStuck(level) || !allShuffled(level)) {
      continue;
    }
    const [beatable, moves, cost] = await isBeatable(level, generationRandom);
    const generationCost = cost + attempt * MAX_GENERATE_COST;
    if (beatable) {
      if (settings.playMoves !== undefined) {
        const [minMoves, maxMovesPercentage] = settings.playMoves;
        const movesToPlay = Math.min(
          minMoves,
          Math.floor(maxMovesPercentage * moves.length)
        );
        const playedLevel = moves
          .slice(0, movesToPlay)
          .reduce(
            (state, move) => moveBlocks(state, move.from, move.to),
            level
          );
        return {
          ...playedLevel,
          moves: moves.slice(movesToPlay),
          generationInformation: {
            cost: generationCost,
            attempts: attempt,
          },
        };
      }
      return {
        ...level,
        moves,
        generationInformation: {
          cost: generationCost,
          attempts: attempt,
          seed,
        },
      };
    }
  }
  throw new Error("Can't generate playable level");
};

const generatePossibleMoves = (
  state: LevelState,
  random = Math.random
): WeightedMove[] => {
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
    .map((move) => move);
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
    const newState = moveBlocks(state, move.move.from, move.move.to);
    const score = lookahead(newState, depth - 1, random); // Recursive lookahead
    bestScore = Math.max(bestScore, score); // Track the best score
  }

  return bestScore;
};

const evaluateBestMove = (
  initialState: LevelState,
  random = Math.random
): WeightedMove | null => {
  const possibleMoves = generatePossibleMoves(initialState, random);

  let bestMove: WeightedMove | null = null;
  let bestScore = -Infinity;

  for (const move of possibleMoves) {
    const nextState = moveBlocks(initialState, move.move.from, move.move.to);
    const moveScore = lookahead(nextState, 2, random); // Look 1 move ahead (so total of 2 moves including this one)

    if (moveScore > bestScore) {
      bestScore = moveScore;
      bestMove = move;
    }
  }

  return bestMove;
};

const isBeatable = async (
  level: LevelState,
  random = Math.random
): Promise<[beatable: boolean, moves: Move[], cost: number]> => {
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

        moves.push({
          from: nextMove.move.from,
          to: nextMove.move.to,
          tactic: nextMove.name,
        });

        playLevel = moveBlocks(playLevel, nextMove.move.from, nextMove.move.to);
        if (moves.length % 10 === 0) {
          await delay(2);
        }
      }
      if (hasWon(playLevel)) {
        return [true, moves, moves.length + MAX_LEVEL_MOVES * attempt];
      }
    }
    attempt++;
  }

  return [false, [], 0];
};
