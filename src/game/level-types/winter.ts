import { getActiveTheme, getToday } from "@/support/themes";

import { SettingsProducer } from "../types";

import { hard } from "./hard";
import { getNormalSettings, normal } from "./normal";
import { LevelType } from "./types";

export const getScrambledSettings: SettingsProducer = (difficulty) => ({
  ...getNormalSettings(difficulty),
  playMoves: [7, 0.3],
});

export const winter: LevelType<"winter"> = {
  type: "winter",
  name: "Winter",
  symbol: "️❄️",
  borderClassName: "border-2 border-slate-200",
  textClassName: "text-slate-300",
  buttonBackgroundClassName: "bg-slate-400",
  backgroundClassName: "bg-slate-200/10",
  levelModifiers: {
    packageMode: true,
  },
  occurrence: (levelNr) =>
    getActiveTheme(getToday()) === "winter" &&
    levelNr > 20 &&
    (levelNr - 1) % 4 === 0,
  getSettings: (levelNr) => {
    return hard.getSettings(levelNr);
  },
  getZenSettings: (levelNr, difficulty) => {
    return normal.getZenSettings(levelNr, difficulty);
  },
};
