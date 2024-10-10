import { LevelType } from "@/support/getLevelType";

import {
  LevelSettings,
  SettingsProducer,
} from "../level-creation/generateRandomLevel";

import { getHard2Settings, getHardSettings } from "./hardSettings";
import {
  getNormal2Settings,
  getNormal3Settings,
  getNormalSettings,
} from "./normalSettings";
import { getSettings as getScrambledSettings } from "./scrambledSettings";
import {
  getSpecial1Settings,
  getSpecial2Settings,
  getSpecial3Settings,
  getSpecial4Settings,
  getSpecial5Settings,
} from "./specialSettings";

export const getZenSettings = (
  difficultyLevel: number,
  levelType: LevelType,
  zenLevel: number
): LevelSettings => {
  if (levelType === "normal") {
    const templates: SettingsProducer[] = [getNormalSettings];
    if (difficultyLevel >= 8) {
      templates.push(getNormal2Settings, getNormal3Settings);
    }
    return templates[zenLevel % templates.length](difficultyLevel);
  }
  if (levelType === "hard") {
    if (difficultyLevel > 8) {
      const templates: SettingsProducer[] = [getHardSettings, getHard2Settings];
      return templates[zenLevel % templates.length](difficultyLevel);
    }

    return getHardSettings(difficultyLevel);
  }
  if (levelType === "special") {
    const templates: SettingsProducer[] = [
      getSpecial1Settings,
      getSpecial2Settings,
      getSpecial3Settings,
      getSpecial4Settings,
      getSpecial5Settings,
    ];
    return templates[zenLevel % templates.length](difficultyLevel);
  }

  return getScrambledSettings(difficultyLevel);
};
