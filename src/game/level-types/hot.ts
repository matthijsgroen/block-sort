import { getDifficultyLevel } from "../level-settings/levelSettings";
import type { MultiStageLevelSettings, SettingsProducer } from "../types";

import {
  getNormal3Settings,
  getNormal4Settings,
  getNormal5Settings
} from "./normal";
import type { LevelType } from "./types";

export const getHotSettings: SettingsProducer = (difficulty) => ({
  ...getNormal3Settings(difficulty),
  hideBlockTypes: "checker"
});

export const getHot2Settings: SettingsProducer = (difficulty) => ({
  ...getNormal4Settings(difficulty),
  hideBlockTypes: "all"
});

export const getHot3Settings: SettingsProducer = (difficulty) => ({
  ...getNormal5Settings(difficulty),
  hideBlockTypes: "all"
});

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
          settings: getHotSettings(difficultyLevel),
          levelModifiers: {
            keepRevealed: true
          }
        },
        {
          settings: getHot2Settings(difficultyLevel),
          backgroundClassname: "bg-red-500/90",
          levelModifiers: {
            particles: "none"
          }
        },
        {
          settings: getHot3Settings(difficultyLevel),
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
        settings: getHotSettings(difficultyLevel),
        levelModifiers: {
          keepRevealed: true
        }
      },
      {
        settings: getHot2Settings(difficultyLevel),
        backgroundClassname: "bg-red-700/50",
        levelModifiers: {
          particles: "none"
        }
      },
      {
        settings: getHot3Settings(difficultyLevel),
        backgroundClassname: "bg-red-800/70",
        levelModifiers: {
          particles: "sweat"
        }
      }
    ]
  })
};
