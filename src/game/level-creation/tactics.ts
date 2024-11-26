import { mulberry32 } from "@/support/random";

import { moveBlocks } from "../actions";
import { allShuffled, hasWon, isStuck } from "../state";
import { LevelSettings, LevelState, Move } from "../types";

import { randomMove } from "./tactics/randomMove";
import { stackColumn } from "./tactics/stackColumn";
import { startColumn } from "./tactics/startColumn";
import { Tactic, WeightedMove } from "./tactics/types";
import { generateRandomLevel } from "./generateRandomLevel";
import { scoreState, scoreStateWithMove } from "./scoreState";

const MAX_PLAY_ATTEMPTS = 1;
const MAX_LEVEL_MOVES = 1_000;

const MAX_GENERATE_COST = MAX_LEVEL_MOVES * MAX_PLAY_ATTEMPTS;

const tactics: Tactic[] = [randomMove, startColumn, stackColumn];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generatePlayableLevel = async (
  settings: LevelSettings,
  {
    random = Math.random,
    seed = null,
    attempts = 1
  }: { random?: () => number; seed?: number | null; attempts?: number } = {}
): Promise<LevelState> => {
  // Start logging level seeds for faster reproduction
  const startSeed = seed ?? Math.floor(random() * 1e9);

  let attempt = 0;
  while (attempt < attempts) {
    const seed = startSeed + attempt;
    const generationRandom = mulberry32(seed);

    attempt++;
    const level = generateRandomLevel(settings, generationRandom);
    if (isStuck(level) || !allShuffled(level)) {
      continue;
    }
    const [beatable, solveMoves, cost] = await isBeatable(
      level,
      generationRandom
    );
    const generationCost = cost + attempt * MAX_GENERATE_COST;
    // Scrub name from moves
    const moves = solveMoves.map<Move>(({ from, to }) => ({ from, to }));
    if (beatable) {
      if (settings.playMoves !== undefined) {
        const [minMoves, maxMovesPercentage] = settings.playMoves;
        const movesToPlay = Math.min(
          minMoves,
          Math.floor(maxMovesPercentage * moves.length)
        );
        const playedLevel = moves
          .slice(0, movesToPlay)
          .reduce((state, move) => moveBlocks(state, move), level);
        return {
          ...playedLevel,
          moves: moves.slice(movesToPlay),
          generationInformation: {
            cost: generationCost,
            attempts: attempt,
            seed
          }
        };
      }
      return {
        ...level,
        moves,
        generationInformation: {
          cost: generationCost,
          attempts: attempt,
          seed
        }
      };
    }
  }
  throw new Error("Can't generate playable level");
};

const generatePossibleMoves = (
  state: LevelState,
  random = Math.random
): WeightedMove[] =>
  tactics.reduce<WeightedMove[]>(
    (r, tactic) =>
      r.concat(
        tactic(state, random)
          .sort((a, b) => a.weight - b.weight)
          .slice(0, 3)
      ),
    []
  );

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

const isBeatable = async (
  level: LevelState,
  random = Math.random,
  displayState?: (
    state: LevelState,
    move: Move,
    tactic: string,
    moveIndex: number
  ) => Promise<boolean>
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

export const slowSolve = async (
  settings: LevelSettings,
  displayState: (
    state: LevelState,
    move: Move,
    tactic: string,
    moveIndex: number
  ) => Promise<boolean>,
  random = Math.random,
  seed: number | null = null
): Promise<Move[]> => {
  // Start logging level seeds for faster reproduction
  const startSeed = seed ?? Math.floor(random() * 1e9);

  const generationRandom = mulberry32(startSeed);

  let level = generateRandomLevel(settings, generationRandom);

  while (isStuck(level) || !allShuffled(level)) {
    level = generateRandomLevel(settings, generationRandom);
  }

  const [beatable, moves] = await isBeatable(
    level,
    generationRandom,
    displayState
  );
  if (beatable) {
    return moves;
  }
  return [];
};
