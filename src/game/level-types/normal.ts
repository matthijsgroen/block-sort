import { pick } from "@/support/random";

import { getDifficultyLevel } from "../level-settings/levelSettings";
import { LevelSettings } from "../types";
import { SettingsProducer } from "../types";

import { LevelType } from "./types";

export const getNormalSettings: SettingsProducer = (difficulty) => ({
  amountColors: Math.min(1 + difficulty, 10),
  stackSize: Math.min(Math.max(2 + Math.floor(difficulty / 2), 4), 7),
  extraPlacementStacks: difficulty < 2 ? 1 : 2,
  extraPlacementLimits: difficulty > 9 ? 1 : undefined,
  hideBlockTypes: "none",
});

export const getNormal2Settings: SettingsProducer = (difficulty) => ({
  amountColors: Math.min(1 + difficulty, 10),
  stackSize: Math.min(Math.max(difficulty - 3, 4), 7),
  extraPlacementStacks: difficulty < 2 || difficulty > 9 ? 1 : 2,
  extraPlacementLimits: difficulty > 9 ? 1 : undefined,
  hideBlockTypes: "none",
  buffers: difficulty > 9 ? 2 : undefined,
  bufferSizes: difficulty === 10 ? 3 : difficulty === 11 ? 2 : undefined,
});

export const getNormal3Settings: SettingsProducer = (difficulty) => ({
  amountColors: Math.min(1 + difficulty, 10),
  stackSize: Math.min(Math.max(difficulty - 3, 4), 7),
  extraPlacementStacks: difficulty < 2 || difficulty > 9 ? 1 : 2,
  extraPlacementLimits: difficulty > 9 ? 1 : undefined,
  hideBlockTypes: "none",
  buffers: difficulty > 9 ? 2 : undefined,
  bufferSizes: difficulty === 10 ? 2 : difficulty === 11 ? 2 : undefined,
  extraBuffers:
    difficulty === 10 ? [{ size: 1, amount: 1, limit: 0 }] : undefined,
});

export const normal: LevelType<"normal"> = {
  type: "normal",
  name: "Normal",
  unlocksAtLevel: 0,
  borderClassName: "border border-block-brown",
  textClassName: "text-orange-400",
  buttonBackgroundClassName: "bg-orange-500",
  backgroundClassName: "bg-transparent",
  occurrence: () => true,
  getSettings(levelNr, random = Math.random) {
    const difficulty = getDifficultyLevel(levelNr);
    const templates: LevelSettings[] = [getNormalSettings(difficulty)];
    if (levelNr > 160) {
      templates.push(
        getNormal2Settings(difficulty),
        getNormal3Settings(difficulty),
      );
    }
    return pick(templates, random);
  },
  getZenSettings: (zenLevel, difficultyLevel) => {
    const templates: SettingsProducer[] = [getNormalSettings];
    if (difficultyLevel >= 8) {
      templates.push(getNormal2Settings, getNormal3Settings);
    }
    return templates[zenLevel % templates.length](difficultyLevel);
  },
};
