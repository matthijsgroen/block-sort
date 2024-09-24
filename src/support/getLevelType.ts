import {
  isEasy,
  isHard,
  isScrambled,
  isSpecial,
} from "@/game/level-settings/levelSettings";

export type LevelType = "normal" | "hard" | "easy" | "special" | "scrambled";

export const getLevelType = (nr: number): LevelType => {
  if (isSpecial(nr)) {
    return "special";
  }
  if (isHard(nr)) {
    return "hard";
  }
  if (isEasy(nr)) {
    return "easy";
  }
  if (isScrambled(nr)) {
    return "scrambled";
  }
  return "normal";
};
