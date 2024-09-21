import { isEasy, isHard, isSpecial } from "@/game/level-settings/levelSettings";

export type LevelType = "normal" | "hard" | "easy" | "special";

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
  return "normal";
};
