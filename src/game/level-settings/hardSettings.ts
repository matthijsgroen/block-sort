import { SettingsProducer } from "../level-creation/generateRandomLevel";

import { getNormalSettings } from "./normalSettings";

export const getHardSettings: SettingsProducer = (difficulty) => ({
  ...getNormalSettings(difficulty),
  hideBlockTypes: "all",
});

export const getHard2Settings: SettingsProducer = (difficulty) => ({
  ...getNormalSettings(difficulty),
  hideBlockTypes: "checker",
});
