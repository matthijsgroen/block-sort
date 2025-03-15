import { hard } from "./hard";
import type { LevelType } from "./types";

export const winter: LevelType<"winter"> = {
  type: "winter",
  name: "Winter",
  symbol: "️❄️",
  unlocksAtLevel: 20,
  activeDuringTheme: "winter",
  borderClassName: "border-2 border-slate-200",
  textClassName: "text-slate-300",
  buttonBackgroundClassName: "bg-slate-400",
  backgroundClassName: "bg-slate-200/10",
  levelModifiers: {
    theme: "winter",
    hideMode: "present",
    keepRevealed: true
  },
  showIntro: true,
  introTextColor: "#e2e8f0",
  occurrence: (levelNr, { theme }) =>
    theme === "winter" && levelNr > 20 && (levelNr - 1) % 6 === 0,
  getSettings: (levelNr) => {
    return hard.getSettings(levelNr);
  },
  getZenSettings: (levelNr, difficulty) => {
    return hard.getZenSettings(levelNr, difficulty);
  }
};
