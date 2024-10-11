import { fib } from "@/support/fib";
import { pick } from "@/support/random";

import { LevelSettings, SettingsProducer } from "../types";

import {
  getHard2Settings as _getHard2Settings,
  getHardSettings as _getHardSettings,
} from "./hardSettings";
import {
  getNormal2Settings as _getNormal2Settings,
  getNormal3Settings as _getNormal3Settings,
  getNormalSettings as _getNormalSettings,
} from "./normalSettings";
import { getSettings as _getScrambledSettings } from "./scrambledSettings";
import {
  getSpecial1Settings,
  getSpecial2Settings,
  getSpecial3Settings,
  getSpecial4Settings,
  getSpecial5Settings,
} from "./specialSettings";

export const LEVEL_SCALE = fib(3, 11);
// 0: 3, 1: 6, 2: 9, 3: 15, 4: 24, 5: 39, 6: 63, 7: 102, 8: 165, 9: 267

export const getDifficultyLevel = (levelNr: number): number =>
  LEVEL_SCALE.filter((l) => l <= levelNr).length + 1;

export const nextLevelAt = (levelNr: number): number | undefined =>
  LEVEL_SCALE.find((l) => l > levelNr);

export const getNormalSettings = (
  levelNr: number,
  random = Math.random
): LevelSettings => {
  const difficulty = getDifficultyLevel(levelNr);
  const templates: LevelSettings[] = [_getNormalSettings(difficulty)];
  if (levelNr > 160) {
    templates.push(
      _getNormal2Settings(difficulty),
      _getNormal3Settings(difficulty)
    );
  }
  return pick(templates, random);
};

export const getEasySettings = (
  levelNr: number,
  random = Math.random
): LevelSettings => {
  const difficulty = getDifficultyLevel(levelNr);

  const easyDifficulty = Math.max(
    difficulty - Math.round(1 + random() * (difficulty - 2)),
    2
  );
  const lvlSimulation = LEVEL_SCALE[easyDifficulty - 1];

  const templates: LevelSettings[] = [
    getNormalSettings(lvlSimulation),
    getHardSettings(lvlSimulation),
    getSpecialSettings(lvlSimulation, random),
  ];

  return pick(templates, random);
};

export const getHardSettings = (
  levelNr: number,
  random = Math.random
): LevelSettings => {
  const difficulty = getDifficultyLevel(levelNr);

  if (difficulty > 8) {
    return pick(
      [_getHard2Settings(difficulty), _getHardSettings(difficulty)],
      random
    );
  }

  return _getHardSettings(difficulty);
};

export const getSpecialSettings = (
  levelNr: number,
  random = Math.random
): LevelSettings => {
  const difficulty = getDifficultyLevel(levelNr);

  const templates: SettingsProducer[] = [
    getSpecial1Settings,
    getSpecial2Settings,
    getSpecial3Settings,
    getSpecial4Settings,
    getSpecial5Settings,
  ];

  return pick(templates, random)(difficulty);
};

export const getScrambledSettings = (levelNr: number): LevelSettings =>
  _getScrambledSettings(getDifficultyLevel(levelNr));

export const isSpecial = (levelNr: number) =>
  (levelNr + 1) % 7 === 0 || (levelNr + 1) % 25 === 0;

export const isHard = (levelNr: number) =>
  !isSpecial(levelNr) && (levelNr + 1) % 9 === 0;

export const isEasy = (levelNr: number) =>
  !isSpecial(levelNr) &&
  !isHard(levelNr) &&
  levelNr > 150 &&
  (levelNr + 1) % 13 === 0;

export const isScrambled = (levelNr: number) =>
  !isSpecial(levelNr) &&
  !isHard(levelNr) &&
  !isEasy(levelNr) &&
  levelNr > 180 &&
  levelNr % 9 === 0;
