import { fib } from "@/support/fib";
import { pick } from "@/support/random";

import { LevelSettings } from "../level-creation/generateRandomLevel";

import { getSettings as _getHardSettings } from "./hardSettings";
import { getSettings as _getNormalSettings } from "./normalSettings";
import { getSettings as _getSpecial1Settings } from "./special1Settings";
import { getSettings as _getSpecial2Settings } from "./special2Settings";
import { getSettings as _getSpecial3Settings } from "./special3Settings";
import { getSettings as _getSpecial4Settings } from "./special4Settings";

export const LEVEL_SCALE = fib(3, 11);

export const getDifficultyLevel = (levelNr: number): number =>
  LEVEL_SCALE.filter((l) => l <= levelNr).length + 1;

export const nextLevelAt = (levelNr: number): number | undefined =>
  LEVEL_SCALE.find((l) => l > levelNr);

export const getNormalSettings = (levelNr: number): LevelSettings =>
  _getNormalSettings(getDifficultyLevel(levelNr));

export const getEasySettings = (
  levelNr: number,
  random = Math.random
): LevelSettings => {
  const difficulty = getDifficultyLevel(levelNr);

  const easyDifficulty = Math.max(
    difficulty - Math.round(1 + random() * (difficulty - 2)),
    2
  );

  const specialTemplate: LevelSettings[] = [
    _getSpecial1Settings(easyDifficulty),
    _getSpecial2Settings(easyDifficulty),
    _getSpecial3Settings(easyDifficulty),
    _getSpecial4Settings(easyDifficulty),
  ];

  const templates: LevelSettings[] = [
    _getNormalSettings(easyDifficulty),
    _getHardSettings(easyDifficulty),
    pick(specialTemplate, random),
  ];

  return pick(templates, random);
};

export const getHardSettings = (levelNr: number): LevelSettings =>
  _getHardSettings(getDifficultyLevel(levelNr));

export const getSpecialSettings = (
  levelNr: number,
  random = Math.random
): LevelSettings => {
  const difficulty = getDifficultyLevel(levelNr);

  const templates: LevelSettings[] = [
    _getSpecial1Settings(difficulty),
    _getSpecial2Settings(difficulty),
    _getSpecial3Settings(difficulty),
    _getSpecial4Settings(difficulty),
  ];

  return pick(templates, random);
};

export const isSpecial = (levelNr: number) => (levelNr + 1) % 7 === 0;

export const isHard = (levelNr: number) =>
  !isSpecial(levelNr) && (levelNr + 1) % 9 === 0;

export const isEasy = (levelNr: number) =>
  !isSpecial(levelNr) &&
  !isHard(levelNr) &&
  levelNr > 150 &&
  (levelNr + 1) % 13 === 0;
