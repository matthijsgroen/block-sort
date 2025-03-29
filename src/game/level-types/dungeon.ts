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
  lockOffset: 2,
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

export const getDungeonSettings3: SettingsProducer = (difficulty) => {
  const stackSize = Math.min(
    Math.max(Math.floor(3 + (difficulty - 2) / 2), 4),
    7
  );

  return {
    amountColors: Math.min(1 + difficulty, 10),
    stackSize,
    extraPlacementStacks: 0,
    extraPlacementLimits: difficulty > 9 ? 1 : undefined,
    hideBlockTypes: "all",
    amountLocks: 1 + Math.floor(difficulty / 4),
    amountLockTypes: Math.max(1, Math.floor(difficulty / 4)),
    lockOffset: 4,
    extraBuffers: [
      ...(difficulty >= 2 && difficulty < 9
        ? [
            {
              amount: 1,
              size: stackSize,
              limit: 0
            }
          ]
        : []),
      ...(difficulty >= 9
        ? [
            {
              amount: 2,
              size: 3,
              limit: 0
            }
          ]
        : []),
      {
        amount: 1,
        size: Math.min(stackSize, 4),
        limit: 1
      },
      {
        amount: 1,
        size: 2,
        bufferType: "inventory",
        limit: 0
      }
    ],
    layoutMap:
      difficulty >= 9
        ? {
            width: 6,
            columns: [{ fromColumn: 12, toColumn: 11 }]
          }
        : undefined
  };
};

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
    const difficultyLevel = getDifficultyLevel(encounter * 3);

    return {
      stages: [
        {
          settings: getDungeonSettings(difficultyLevel)
        },
        {
          settings: getDungeonSettings2(difficultyLevel),
          backgroundClassname: "bg-gray-700/40"
        },
        ...(difficultyLevel > 3
          ? [
              {
                settings: getDungeonSettings3(difficultyLevel),
                backgroundClassname: "bg-gray-800/40",
                levelModifiers: {
                  keepRevealed: true
                }
              }
            ]
          : [])
      ]
    };
  },
  getZenSettings: (_zenLevel, difficultyLevel) => ({
    stages: [
      {
        settings: getDungeonSettings(difficultyLevel)
      },
      {
        settings: getDungeonSettings2(difficultyLevel),
        backgroundClassname: "bg-gray-700/40"
      },
      ...(difficultyLevel > 3
        ? [
            {
              settings: getDungeonSettings3(difficultyLevel),
              backgroundClassname: "bg-gray-800/40",
              levelModifiers: {
                keepRevealed: true
              }
            }
          ]
        : [])
    ]
  })
};
