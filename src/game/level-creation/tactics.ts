import { mulberry32 } from "@/support/random";

import { moveBlocks } from "../actions";
import type { LevelSettings, LevelState, Move } from "../types";

import {
  generateRandomLevel,
  hasMinimalLevelQuality
} from "./generateRandomLevel";
import { defaultSolver } from "./solvers";

const MAX_GENERATE_COST = 2_000;

export const generatePlayableLevel = async (
  settings: LevelSettings,
  {
    random = Math.random,
    seed = null,
    attempts = 1,
    afterAttempt
  }: {
    random?: () => number;
    seed?: number | null;
    attempts?: number;
    afterAttempt?: () => Promise<void>;
  } = {},
  solver = defaultSolver
): Promise<LevelState> => {
  // Start logging level seeds for faster reproduction
  const startSeed = seed ?? Math.floor(random() * 1e9);

  let attempt = 0;
  while (attempt < attempts) {
    const seed = startSeed + attempt;
    const generationRandom = mulberry32(seed);

    attempt++;
    const level = generateRandomLevel(settings, generationRandom);
    if (!hasMinimalLevelQuality(level)) {
      continue;
    }
    const [beatable, solveMoves, cost] = await solver(level, generationRandom);
    if (afterAttempt) {
      await afterAttempt();
    }
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

export const slowSolve = async (
  settings: LevelSettings,
  displayState: (
    state: LevelState,
    move: Move,
    tactic: string,
    moveIndex: number
  ) => Promise<boolean>,
  random = Math.random,
  seed: number | null = null,
  solver = defaultSolver
): Promise<Move[]> => {
  // Start logging level seeds for faster reproduction
  const startSeed = seed ?? Math.floor(random() * 1e9);

  const generationRandom = mulberry32(startSeed);

  let level = generateRandomLevel(settings, generationRandom);

  while (!hasMinimalLevelQuality(level)) {
    level = generateRandomLevel(settings, generationRandom);
  }

  const [beatable, moves] = await solver(level, generationRandom, displayState);
  if (beatable) {
    return moves;
  }
  return [];
};
