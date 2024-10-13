import { pick } from "@/support/random";

import { getDifficultyLevel } from "../level-settings/levelSettings";
import { SettingsProducer } from "../types";

import { LevelType } from "./types";

export const getSpecial1Settings: SettingsProducer = (difficulty) => ({
  amountColors: difficulty < 4 ? 3 : 4,
  stackSize: 12 + Math.max(Math.round(difficulty / 8), 0),
  extraPlacementStacks: 0,
  buffers: difficulty < 4 ? 2 : 4,
  bufferSizes: 4 - Math.max(Math.round((difficulty - 7) / 4), 0),
  bufferPlacementLimits: 0 + Math.max(Math.round(difficulty / 4), 0),
  extraBuffers: [
    {
      amount: 1,
      size: difficulty > 8 ? 3 : 4,
      limit: 0,
    },
    {
      amount: 1,
      size: difficulty > 10 ? 3 : 4,
      limit: 0,
    },
  ],
  blockColorPick: "end",
});

export const getSpecial2Settings: SettingsProducer = (difficulty) => ({
  amountColors: 5 + Math.min(Math.max(Math.round(difficulty * 1.1), 0), 11),
  stackSize: 3,
  extraPlacementStacks:
    4 - Math.min(Math.max(Math.round(difficulty / 2), 0), 2),
  extraPlacementLimits: Math.max(
    4 - Math.min(Math.max(Math.round(difficulty / 2), 0), 3) - 1,
    0,
  ),
  blockColorPick: "end",
});

export const getSpecial3Settings: SettingsProducer = (difficulty) => ({
  amountColors: 5,
  stackSize: difficulty > 4 ? 5 : 4,
  extraPlacementStacks: 2,
  extraPlacementLimits:
    0 + Math.max(Math.min(Math.round(difficulty / 5), 2), 0),
  blockColorPick: "end",
});

export const getSpecial4Settings: SettingsProducer = (difficulty) => ({
  amountColors: 2 + Math.min(Math.max(Math.round(difficulty / 2), 0), 4),
  stacksPerColor: 2,
  stackSize: 3,
  extraPlacementStacks: 4 - Math.max(Math.round(difficulty / 5), 0),
  extraPlacementLimits: 2,
  buffers: 1,
  bufferSizes: 1,
  blockColorPick: "end",
});

export const getSpecial5Settings: SettingsProducer = (difficulty) => ({
  amountColors: difficulty < 3 ? 4 : 5,
  stackSize: difficulty > 4 ? 5 : 4,
  extraPlacementStacks: 0,
  extraPlacementLimits: 0,
  buffers: 1,
  bufferSizes: 4,
  bufferPlacementLimits: 1,
  extraBuffers: [
    { amount: 1, size: difficulty > 4 && difficulty < 10 ? 4 : 3, limit: 1 },
    { amount: 1, size: difficulty > 4 && difficulty < 8 ? 3 : 2, limit: 1 },
  ],
  blockColorPick: "end",
});

export const special: LevelType<"special"> = {
  type: "special",
  name: "Special",
  unlocksAtLevel: 75,
  symbol: "⭐️",
  color: "#a855f7",
  borderClassName: "border-2 border-purple-800",
  textClassName: "text-purple-500",
  buttonBackgroundClassName: "bg-purple-500",
  backgroundClassName: "bg-purple-500/40",
  occurrence: (levelNr) => (levelNr + 1) % 7 === 0 || (levelNr + 1) % 25 === 0,
  getSettings(levelNr, random = Math.random) {
    const difficulty = getDifficultyLevel(levelNr);

    const templates: SettingsProducer[] = [
      getSpecial1Settings,
      getSpecial2Settings,
      getSpecial3Settings,
      getSpecial4Settings,
      getSpecial5Settings,
    ];

    return pick(templates, random)(difficulty);
  },
  getZenSettings: (zenLevel, difficultyLevel) => {
    const templates: SettingsProducer[] = [
      getSpecial1Settings,
      getSpecial2Settings,
      getSpecial3Settings,
      getSpecial4Settings,
      getSpecial5Settings,
    ];
    return templates[zenLevel % templates.length](difficultyLevel);
  },
};
