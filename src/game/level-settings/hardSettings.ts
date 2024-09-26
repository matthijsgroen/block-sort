import { LevelSettings } from "../level-creation/generateRandomLevel";

import { getNormalSettings as getNormalSettings } from "./normalSettings";

export const getHardSettings = (difficulty: number): LevelSettings => ({
  ...getNormalSettings(difficulty),
  hideBlockTypes: true,
});
