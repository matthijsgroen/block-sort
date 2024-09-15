import { LevelState, Move } from "@/game/types";
import { Weighted } from "@/support/random";

export type WeightedMove = Weighted<{ move: Move; name: string }>;

export type Tactic = (
  level: LevelState,
  random?: () => number
) => WeightedMove[];
