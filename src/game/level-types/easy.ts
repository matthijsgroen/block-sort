import { pick } from "@/support/random";

import {
  getDifficultyLevel,
  LEVEL_SCALE
} from "../level-settings/levelSettings";
import type { LevelSettings, MultiStageLevelSettings } from "../types";

import { hard } from "./hard";
import { normal } from "./normal";
import { special } from "./special";
import type { LevelType } from "./types";

export const easy: LevelType<"easy"> = {
  type: "easy",
  name: "Easy",
  symbol: "️🍀",
  color: "#15803d",
  borderClassName: "border-2 border-green-800",
  textClassName: "text-green-700",
  buttonBackgroundClassName: "bg-green-700",
  backgroundClassName: "bg-green-600/40",
  showIntro: true,
  introTextColor: "#15803d",
  occurrence: (levelNr) => levelNr > 150 && (levelNr + 1) % 13 === 0,
  getSettings(levelNr, random = Math.random) {
    const difficulty = getDifficultyLevel(levelNr);

    const easyDifficulty = Math.max(
      difficulty - Math.round(1 + random() * (difficulty - 2)),
      2
    );
    const lvlSimulation = LEVEL_SCALE[easyDifficulty - 1];

    const templates: (LevelSettings | MultiStageLevelSettings)[] = [
      normal.getSettings(lvlSimulation, random),
      hard.getSettings(lvlSimulation, random),
      special.getSettings(lvlSimulation, random)
    ];

    return pick(templates, random);
  },
  getZenSettings: () => {
    // no zen settings for easy
    return special.getSettings(1);
  }
};
