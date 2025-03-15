import { getDifficultyLevel } from "../level-settings/levelSettings";
import type { BufferSettings, SettingsProducer } from "../types";

import type { LevelType } from "./types";

export const getDungeonSettings: SettingsProducer = (difficulty) => ({
  amountColors: Math.min(3 + difficulty, 10),
  stackSize: Math.min(Math.max(Math.floor(1 + difficulty), 4), 7),
  extraPlacementStacks: 1,
  extraBuffers: [
    ...(difficulty > 4
      ? ([
          {
            size: 3,
            amount: 1,
            limit: 0,
            bufferType: "normal"
          }
        ] satisfies BufferSettings[])
      : []),
    {
      size: 1,
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

export const dungeon: LevelType<"dungeon"> = {
  type: "dungeon",
  name: "Dungeon",
  unlocksAtLevel: 500,
  symbol: "🐉",
  color: "#6b7280",
  borderClassName: "border-2 border-gray-800",
  textClassName: "text-gray-500",
  buttonBackgroundClassName: "bg-gray-500",
  backgroundClassName: "bg-gray-500/40",
  showIntro: true,
  introTextColor: "#6b7280",
  occurrence: (levelNr) => levelNr > 400 && (levelNr + 3) % 20 === 0,
  getSettings(levelNr) {
    const difficulty = getDifficultyLevel(levelNr);

    return getDungeonSettings(difficulty);
  },
  getZenSettings: (_zenLevel, difficultyLevel) => {
    return getDungeonSettings(difficultyLevel);
  }
};
