import { SettingsProducer } from "../level-creation/generateRandomLevel";

import { getNormalSettings as getNormalSettings } from "./normalSettings";

export const getSettings: SettingsProducer = (difficulty) => ({
  ...getNormalSettings(difficulty),
  playMoves: [7, 0.3],
});
