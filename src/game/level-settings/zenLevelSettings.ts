import { LevelType } from "@/support/getLevelType";
import { pick } from "@/support/random";

import { LevelSettings } from "../level-creation/generateRandomLevel";

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
} from "./specialSettings";

export const getZenSettings = (
  difficultyLevel: number,
  levelType: LevelType,
  random = Math.random
): LevelSettings => {
  if (levelType === "normal") {
    const templates: LevelSettings[] = [getNormalSettings(difficultyLevel)];
    if (difficultyLevel >= 8) {
      templates.push(
        getNormal2Settings(difficultyLevel),
        getNormal3Settings(difficultyLevel)
      );
    }
    return pick(templates, random);
  }
  if (levelType === "hard") {
    if (difficultyLevel > 8) {
      return pick(
        [getHard2Settings(difficultyLevel), getHardSettings(difficultyLevel)],
        random
      );
    }

    return getHardSettings(difficultyLevel);
  }
  if (levelType === "special") {
    const templates: LevelSettings[] = [
      getSpecial1Settings(difficultyLevel),
      getSpecial2Settings(difficultyLevel),
      getSpecial3Settings(difficultyLevel),
      getSpecial4Settings(difficultyLevel),
    ];
    const baseSettings = pick(templates, random);
    if (difficultyLevel >= 9) {
      return pick(
        [
          baseSettings,
          baseSettings,
          { ...baseSettings, hideBlockTypes: "checker" },
        ],
        random
      );
    }

    return baseSettings;
  }

  return getScrambledSettings(difficultyLevel);
};
