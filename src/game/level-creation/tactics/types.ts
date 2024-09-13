import { LevelState, Move } from "@/game/types";

export type Tactic = 
   (level: LevelState, random?: () => number) => { move: Move, weight: number}[]