import { getActiveTheme, getToday } from "@/game/themes/index";

import { getDifficultyLevel } from "../level-settings/levelSettings";
import { SettingsProducer } from "../types";

import { LevelType } from "./types";

export const getSpringSettings: SettingsProducer = (difficulty) => {
  const extraBufferSize = (difficulty: number) => {
    if (difficulty < 6) {
      return -1;
    }
    if (difficulty > 10) {
      return 4;
    }
    if (difficulty > 8) {
      return 6;
    }
    if (difficulty > 6) {
      return 3;
    }
    return 0;
  };

  const paddingTop = (difficulty: number) => {
    if (difficulty === 11 || difficulty === 8) {
      return 2;
    }
    if (difficulty === 10 || difficulty === 7 || difficulty < 6) {
      return 1;
    }
    return 0;
  };

  return {
    amountColors: Math.min(1 + difficulty, 10),
    stackSize: Math.min(Math.max(Math.floor(3 + (difficulty - 2) / 2), 4), 7),
    extraPlacementStacks: 0,
    hideBlockTypes: "none",
    extraBuffers: [
      {
        size:
          Math.min(Math.max(Math.floor(3 + (difficulty - 2) / 2), 4), 7) +
          extraBufferSize(difficulty),
        amount: 1,
        limit: 0,
        unlimited: true
      }
    ],
    layoutMap: {
      columns: [
        { fromColumn: -1, toColumn: 0, paddingTop: paddingTop(difficulty) }
      ]
    }
  };
};

export const spring: LevelType<"spring"> = {
  type: "spring",
  name: "Spring",
  symbol: "️🌈",
  borderClassName: "border-2 border-yellow-200",
  textClassName: "text-blue-300",
  buttonBackgroundClassName: "bg-pink-400",
  backgroundClassName: "bg-pink-200/10",
  inBetaTest: true,
  occurrence: (levelNr) =>
    getActiveTheme(getToday()) === "spring" &&
    levelNr > 200 &&
    (levelNr - 1) % 6 === 0,
  getSettings: (levelNr) => {
    const difficulty = getDifficultyLevel(levelNr - 199);
    return getSpringSettings(difficulty);
  },
  getZenSettings: (_levelNr, difficulty) => {
    return getSpringSettings(difficulty);
  }
};
