import { getDifficultyLevel } from "../level-settings/levelSettings";
import { SettingsProducer } from "../types";

import { getNormalSettings } from "./normal";
import { LevelType } from "./types";

export const getScrambledSettings: SettingsProducer = (difficulty) => ({
  ...getNormalSettings(difficulty),
  playMoves: [7, 0.3],
});

export const ghost: LevelType<"ghost"> = {
  type: "ghost",
  name: "Ghost",
  symbol: "️👻",
  borderClassName: "border-2 border-green-200",
  textClassName: "text-green-300",
  buttonBackgroundClassName: "bg-green-400",
  backgroundClassName: "bg-slate-400/40",
  unlocksAtLevel: 350,
  levelModifiers: {
    theme: "halloween",
  },
  occurrence: (levelNr) => levelNr === 49 || levelNr === 48,
  getSettings: (levelNr) => {
    const difficulty = getDifficultyLevel(levelNr);
    return getScrambledSettings(difficulty);
  },
  getZenSettings: (_levelNr, difficulty) => {
    return getScrambledSettings(difficulty);
  },
};
