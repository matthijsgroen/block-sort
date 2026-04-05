import { pick } from "@/support/random";

import { getDifficultyLevel } from "../level-settings/levelSettings";
import type { SettingsProducer } from "../types";

import { getNormalSettings } from "./normal";
import type { LevelType } from "./types";

export const getHardSettings: SettingsProducer = (difficulty) => {
  const normalSettings = getNormalSettings(difficulty);
  return {
    ...normalSettings,
    hideBlockTypes: "all",
    producerName: `Hard-${normalSettings.producerName}`,
    producerDifficulty: difficulty
  };
};

export const getHard2Settings: SettingsProducer = (difficulty) => {
  const normalSettings = getNormalSettings(difficulty);
  return {
    ...normalSettings,
    hideBlockTypes: "checker",
    producerName: `Hard2-${normalSettings.producerName}`,
    producerDifficulty: difficulty
  };
};

export const hard: LevelType<"hard"> = {
  type: "hard",
  name: "Hard",
  unlocksAtLevel: 100,
  symbol: "🔥",
  borderClassName: "border-2 border-orange-700",
  textClassName: "text-orange-400",
  buttonBackgroundClassName: "bg-orange-600",
  backgroundClassName: "bg-red-600/70",
  showIntro: true,
  introTextColor: "#ff8000",
  occurrence: (levelNr) => (levelNr + 1) % 9 === 0,
  getSettings(levelNr, random = Math.random) {
    const difficulty = getDifficultyLevel(levelNr);

    if (difficulty > 8) {
      return pick(
        [getHard2Settings(difficulty), getHardSettings(difficulty)],
        random
      );
    }

    return getHardSettings(difficulty);
  },
  getZenSettings: (levelNr, difficulty) => {
    if (difficulty > 8) {
      const templates: SettingsProducer[] = [getHardSettings, getHard2Settings];
      return templates[levelNr % templates.length](difficulty);
    }
    return getHardSettings(difficulty);
  }
};
