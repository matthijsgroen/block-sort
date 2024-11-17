import { getActiveTheme, getToday } from "@/game/themes";

import { hard } from "./hard";
import { normal } from "./normal";
import { LevelType } from "./types";

export const winter: LevelType<"winter"> = {
  type: "winter",
  name: "Winter",
  symbol: "️❄️",
  borderClassName: "border-2 border-slate-200",
  textClassName: "text-slate-300",
  buttonBackgroundClassName: "bg-slate-400",
  backgroundClassName: "bg-slate-200/10",
  levelModifiers: {
    packageMode: true
  },
  showIntro: true,
  introTextColor: "#e2e8f0",
  occurrence: (levelNr) =>
    getActiveTheme(getToday()) === "winter" &&
    levelNr > 20 &&
    (levelNr - 1) % 4 === 0,
  getSettings: (levelNr) => {
    return hard.getSettings(levelNr);
  },
  getZenSettings: (levelNr, difficulty) => {
    return normal.getZenSettings(levelNr, difficulty);
  }
};
