import { getActiveTheme, getToday } from "@/game/themes/index";
import { pick } from "@/support/random";

import { getDifficultyLevel } from "../level-settings/levelSettings";
import { LevelSettings, SettingsProducer } from "../types";

import { normal } from "./normal";
import { LevelType } from "./types";

export const getSpringSettings: SettingsProducer = (difficulty) => ({
  amountColors: Math.min(1 + difficulty, 10),
  stackSize: Math.min(Math.max(Math.floor(3 + (difficulty - 2) / 2), 4), 7),
  extraPlacementStacks: 0,
  // extraPlacementStacks: difficulty < 2 ? 1 : 2,
  // extraPlacementLimits: difficulty > 9 ? 1 : undefined,
  hideBlockTypes: "none",
  extraBuffers: [
    {
      size: difficulty > 8 ? 5 : 4,
      amount: 1,
      limit: 0,
      unlimited: true
    },
    {
      size: difficulty > 9 ? 4 : 3,
      amount: 1,
      limit: 0,
      unlimited: true
    },
    {
      size: 2,
      amount: difficulty > 7 ? 1 : 0,
      limit: 0,
      unlimited: true
    }
  ]
});

export const spring: LevelType<"spring"> = {
  type: "spring",
  name: "Spring",
  symbol: "️🌈",
  borderClassName: "border-2 border-yellow-200",
  textClassName: "text-blue-300",
  buttonBackgroundClassName: "bg-pink-400",
  backgroundClassName: "bg-pink-200/10",
  occurrence: (levelNr) =>
    getActiveTheme(getToday()) === "spring" &&
    levelNr > 20 &&
    (levelNr - 1) % 4 === 0,
  getSettings: (levelNr, random) => {
    const difficulty = getDifficultyLevel(levelNr);
    const templates: LevelSettings[] = [getSpringSettings(difficulty)];
    return pick(templates, random);
  },
  getZenSettings: (levelNr, difficulty) => {
    return normal.getZenSettings(levelNr, difficulty);
  }
};
