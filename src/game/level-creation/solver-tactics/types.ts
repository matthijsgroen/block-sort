import type { LevelState, Move } from "@/game/types";

export type WeightedMove = { move: Move; name?: string; weight: number };

export type Tactic = (
  level: LevelState,
  random?: () => number
) => WeightedMove[];
