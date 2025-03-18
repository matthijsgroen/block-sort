import { pick } from "@/support/random";

import { getDifficultyLevel } from "../level-settings/levelSettings";
import type { LevelSettings } from "../types";
import type { SettingsProducer } from "../types";

import type { LevelType } from "./types";

export const getNormalSettings: SettingsProducer = (difficulty) => ({
  amountColors: Math.min(1 + difficulty, 10),
  stackSize: Math.min(Math.max(Math.floor(3 + (difficulty - 2) / 2), 4), 7),
  extraPlacementStacks: difficulty < 2 ? 1 : 2,
  extraPlacementLimits: difficulty > 9 ? 1 : undefined,
  hideBlockTypes: "none"
});

export const getNormal2Settings: SettingsProducer = (difficulty) => ({
  amountColors: Math.min(1 + difficulty, 10),
  stackSize: Math.min(Math.max(Math.floor(3 + (difficulty - 2) / 2), 4), 7),
  extraPlacementStacks: difficulty < 2 || difficulty > 9 ? 1 : 2,
  extraPlacementLimits: difficulty > 9 ? 1 : undefined,
  hideBlockTypes: "none",
  buffers: difficulty > 9 ? 2 : undefined,
  bufferSizes: difficulty === 10 ? 3 : difficulty >= 11 ? 2 : undefined
});

export const getNormal3Settings: SettingsProducer = (difficulty) => ({
  amountColors: Math.min(1 + difficulty, 10),
  stackSize: Math.min(Math.max(Math.floor(3 + (difficulty - 2) / 2), 4), 7),
  extraPlacementStacks: difficulty < 2 || difficulty > 9 ? 1 : 2,
  extraPlacementLimits: difficulty > 9 ? 1 : undefined,
  hideBlockTypes: "none",
  buffers: difficulty > 9 ? 2 : undefined,
  bufferSizes: difficulty === 10 ? 2 : difficulty === 11 ? 2 : undefined,
  extraBuffers:
    difficulty === 10 ? [{ size: 1, amount: 1, limit: 0 }] : undefined
});

export const getNormal4Settings: SettingsProducer = (difficulty) => ({
  amountColors: Math.min(1 + difficulty, 10),
  stackSize: Math.min(Math.max(Math.floor(3 + (difficulty - 2) / 2), 4), 7),
  extraPlacementStacks: difficulty >= 8 ? 0 : difficulty < 2 ? 1 : 2,
  hideBlockTypes: "none",
  extraBuffers:
    difficulty >= 8
      ? [
          { size: difficulty === 11 ? 4 : 3, amount: 1, limit: 0 },
          { size: difficulty > 10 ? 1 : 2, amount: 1, limit: 0 },
          { size: difficulty === 10 ? 4 : 3, amount: 1, limit: 0 },
          { size: difficulty === 10 ? 3 : 2, amount: 1, limit: 0 }
        ]
      : undefined
});

export const getNormal5Settings: SettingsProducer = () => ({
  amountColors: 16,
  stackSize: 4,
  extraPlacementStacks: 0,
  hideBlockTypes: "none",
  extraBuffers: [
    { size: 2, amount: 1, limit: 0 },
    { size: 1, amount: 1, limit: 0 },
    { size: 2, amount: 1, limit: 0 },
    { size: 1, amount: 1, limit: 0 }
  ]
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
        getNormal3Settings(difficulty)
      );
    }
    if (levelNr > 230) {
      templates.push(getNormal4Settings(difficulty));
    }
    if (levelNr > 300) {
      templates.push(getNormal5Settings(difficulty));
    }
    return pick(templates, random);
  },
  getZenSettings: (zenLevel, difficultyLevel) => {
    const templates: SettingsProducer[] = [getNormalSettings];
    if (difficultyLevel >= 8) {
      templates.push(
        getNormal2Settings,
        getNormal3Settings,
        getNormal4Settings
      );
    }
    if (difficultyLevel >= 11) {
      templates.push(getNormal5Settings);
    }
    return templates[zenLevel % templates.length](difficultyLevel);
  }
};
