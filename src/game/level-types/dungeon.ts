import { getDifficultyLevel } from "../level-settings/levelSettings";
import type { BufferSettings, SettingsProducer } from "../types";

import type { LevelType } from "./types";

export const getDungeonSettings: SettingsProducer = (difficulty) => ({
  amountColors: Math.min(3 + difficulty, 10),
  stackSize: Math.min(Math.max(Math.floor(1 + difficulty), 4), 7),
  extraPlacementStacks: difficulty <= 6 ? 1 : 0,
  extraBuffers: [
    ...(difficulty > 6
      ? ([
          {
            size: 3,
            amount: 2,
            limit: 0,
            bufferType: "normal"
          }
        ] satisfies BufferSettings[])
      : []),
    ...(difficulty > 4
      ? ([
          {
            size: difficulty > 8 ? 1 : 3,
            amount: 1,
            limit: 0,
            bufferType: "normal"
          }
        ] satisfies BufferSettings[])
      : []),
    {
      size: difficulty > 8 ? 3 : 1,
      amount: 1,
      limit: 0,
      bufferType: "inventory"
    },
    ...(difficulty > 3
      ? ([
          {
            size: 1,
            amount: 1,
            limit: 0,
            bufferType: "inventory"
          }
        ] satisfies BufferSettings[])
      : [])
  ],
  amountLocks: 1 + Math.floor(difficulty / 2),
  amountLockTypes: Math.max(1, Math.floor(difficulty / 2)),
  hideBlockTypes: "none",
  blockColorPick: "end"
});

export const getDungeonSettings2: SettingsProducer = (difficulty) => ({
  amountColors: difficulty < 4 ? 3 : 4,
  stackSize: Math.min(12 + Math.max(Math.round(difficulty / 8), 0), 13),
  extraPlacementStacks: 0,
  layoutMap: {
    width: difficulty > 3 ? 6 : 5,
    columns: []
  },
  amountLocks: 1 + Math.floor(difficulty / 4),
  amountLockTypes: Math.max(1, Math.floor(difficulty / 4)),
  hideBlockTypes: "checker",

  extraBuffers: [
    {
      amount: difficulty < 4 ? 2 : 4,
      size: 3,
      limit: 1
    },
    {
      amount: 1,
      size: 2,
      limit: 0
    },
    {
      amount: 1,
      size: 3,
      limit: 0
    },
    {
      amount: 1,
      size: 1,
      bufferType: "inventory",
      limit: 0
    }
  ]
});

export const dungeon: LevelType<"dungeon"> = {
  type: "dungeon",
  name: "Dungeon",
  unlocksAtLevel: 800,
  symbol: "🐉",
  color: "#9ca3af",
  borderClassName: "border-2 border-gray-500",
  textClassName: "text-gray-500",
  buttonBackgroundClassName: "bg-gray-500",
  backgroundClassName: "bg-gray-500/40",
  showIntro: true,
  introTextColor: "#6b7280",
  occurrence: (levelNr) => levelNr + 1 >= 200 && (levelNr + 1) % 50 === 0,
  getSettings(levelNr) {
    const encounter = Math.floor((levelNr + 1 - 200) / 50);
    const difficulty = getDifficultyLevel(encounter);

    return getDungeonSettings(difficulty);
  },
  getZenSettings: (_zenLevel, difficultyLevel) =>
    getDungeonSettings(difficultyLevel)
};
