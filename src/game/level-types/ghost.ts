import type { SettingsProducer } from "../types";

import { getNormalSettings, normal } from "./normal";
import type { LevelType } from "./types";

export const getScrambledSettings: SettingsProducer = (difficulty) => ({
  ...getNormalSettings(difficulty),
  playMoves: [7, 0.3]
});

export const ghost: LevelType<"ghost"> = {
  type: "ghost",
  name: "Ghost",
  symbol: "️👻",
  borderClassName: "border-2 border-green-200",
  textClassName: "text-green-300",
  buttonBackgroundClassName: "bg-green-400",
  backgroundClassName: "bg-green-200/10",
  levelModifiers: {
    theme: "halloween",
    ghostMode: true
  },
  occurrence: (levelNr) =>
    levelNr == 29 || (levelNr > 100 && (levelNr + 3) % (15 * 4) === 0),
  getSettings: (levelNr) => {
    return normal.getSettings(levelNr);
  },
  getZenSettings: (levelNr, difficulty) => {
    return normal.getZenSettings(levelNr, difficulty);
  }
};
