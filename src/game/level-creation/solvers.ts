import { randomMove } from "./solver-tactics/randomMove";
import { stackColumn } from "./solver-tactics/stackColumn";
import { startColumn } from "./solver-tactics/startColumn";
import { configureSolver } from "./configurable-solver";
import { scoreState, scoreStateWithMove } from "./scoreState";
import type { Solver } from "./types";

export const defaultSolver: Solver = configureSolver(
  [randomMove, startColumn, stackColumn],
  scoreState,
  scoreStateWithMove,
  2
);

export const dungeonSolver: Solver = configureSolver(
  [randomMove, startColumn, stackColumn],
  scoreState,
  scoreStateWithMove,
  2
);

export const solvers = {
  default: defaultSolver,
  dungeon: dungeonSolver
} as const satisfies Record<string, Solver>;
