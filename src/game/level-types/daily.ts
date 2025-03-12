import { getDifficultyLevel } from "../level-settings/levelSettings";
import type { SettingsProducer } from "../types";

import type { LevelType } from "./types";

export const getDailySettings: SettingsProducer = () => ({
  amountColors: 8,
  stackSize: 4,
  extraPlacementStacks: 2,
  hideBlockTypes: "none"
});

export const spring: LevelType<"daily"> = {
  type: "daily",
  name: "Daily",
  symbol: "📅",
  unlocksAtLevel: 30,
  borderClassName: "border-2 border-yellow-200",
  textClassName: "text-blue-300",
  buttonBackgroundClassName: "bg-pink-400",
  backgroundClassName: "bg-pink-200/10",
  occurrence: () => false,
  getSettings: (levelNr) => {
    const difficulty = getDifficultyLevel(levelNr);
    return getDailySettings(difficulty);
  },
  getZenSettings: (_levelNr, difficulty) => getDailySettings(difficulty)
};
