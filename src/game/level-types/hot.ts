import { getDifficultyLevel } from "../level-settings/levelSettings";
import type { MultiStageLevelSettings } from "../types";

import { getHard2Settings, getHard3Settings, getHardSettings } from "./hard";
import type { LevelType } from "./types";

export const hot: LevelType<"hot"> = {
  type: "hot",
  name: "Hot",
  // unlocksAtLevel: 1500,
  symbol: "🌶️",
  borderClassName: "border-2 border-red-400",
  textClassName: "text-red-400",
  buttonBackgroundClassName: "bg-red-500",
  backgroundClassName: "bg-red-600/70",
  showIntro: true,
  inBetaTest: true,
  introTextColor: "#ff8000",
  levelModifiers: {
    hideMode: "glass"
  },
  occurrence: (levelNr) => levelNr + 1 >= 1200 && (levelNr + 2) % 100 === 0,
  getSettings(levelNr): MultiStageLevelSettings {
    const difficultyLevel = getDifficultyLevel(levelNr);

    return {
      stages: [
        {
          settings: getHard2Settings(difficultyLevel),
          levelModifiers: {
            keepRevealed: true
          }
        },
        {
          settings: getHardSettings(difficultyLevel),
          backgroundClassname: "bg-red-500/90",
          levelModifiers: {
            particles: "none"
          }
        },
        {
          settings: getHard3Settings(difficultyLevel),
          backgroundClassname: "bg-red-600/90",
          levelModifiers: {
            particles: "sweat"
          }
        }
      ]
    };
  },
  getZenSettings: (_zenLevel, difficultyLevel) => ({
    stages: [
      {
        settings: getHardSettings(difficultyLevel),
        levelModifiers: {
          keepRevealed: true
        }
      },
      {
        settings: getHard2Settings(difficultyLevel),
        backgroundClassname: "bg-red-700/50",
        levelModifiers: {
          particles: "none"
        }
      },
      {
        settings: getHard3Settings(difficultyLevel),
        backgroundClassname: "bg-red-800/70",
        levelModifiers: {
          particles: "sweat"
        }
      }
    ]
  })
};
