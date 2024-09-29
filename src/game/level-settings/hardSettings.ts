import { LevelSettings } from "../level-creation/generateRandomLevel";

import { getNormalSettings } from "./normalSettings";

export const getHardSettings = (difficulty: number): LevelSettings => ({
  ...getNormalSettings(difficulty),
  hideBlockTypes: "all",
});

export const getHard2Settings = (difficulty: number): LevelSettings => ({
  ...getNormalSettings(difficulty),
  hideBlockTypes: "checker",
});
