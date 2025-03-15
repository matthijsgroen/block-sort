import { getDifficultyLevel } from "../level-settings/levelSettings";

import { getScrambledSettings } from "./scrambled";
import type { LevelType } from "./types";

export const summer: LevelType<"summer"> = {
  type: "summer",
  name: "Summer",
  symbol: "️☀️",
  activeDuringTheme: "summer",
  unlocksAtLevel: 10,
  borderClassName: "border-2 border-yellow-200",
  textClassName: "text-yellow-300",
  buttonBackgroundClassName: "bg-yellow-400",
  backgroundClassName: "bg-yellow-200/10",
  showIntro: true,
  inBetaTest: true,
  levelModifiers: {
    // theme: "summer",
    hideMode: "ice",
    hideEvery: 2
  },
  introTextColor: "#ec4899",
  occurrence: (levelNr, { theme }) =>
    theme === "summer" && (levelNr - 1) % 6 === 0 && levelNr > 10,
  getSettings: (levelNr) => {
    const difficulty = getDifficultyLevel(levelNr);
    return getScrambledSettings(difficulty);
  },
  getZenSettings: (_levelNr, difficulty) => {
    return getScrambledSettings(difficulty);
  }
};
