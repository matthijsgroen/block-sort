import type { LevelState, Move } from "../types";

export type Solver = (
  level: LevelState,
  random: () => number,
  displayState?: (
    state: LevelState,
    move: Move,
    tactic: string,
    moveIndex: number
  ) => Promise<boolean>
) => Promise<[beatable: boolean, moves: Move[], cost: number]>;
