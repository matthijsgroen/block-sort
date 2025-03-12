import { pick } from "@/support/random";

import { getDifficultyLevel } from "../level-settings/levelSettings";
import type { LayoutMap, SettingsProducer } from "../types";

import type { LevelType } from "./types";

export const getSpecial1Settings: SettingsProducer = (difficulty) => ({
  amountColors: difficulty < 4 ? 3 : 4,
  stackSize: Math.min(12 + Math.max(Math.round(difficulty / 8), 0), 13),
  extraPlacementStacks: 0,
  /* switch to new defintion if something else changes, because format change here causes seed change */
  buffers: difficulty < 4 ? 2 : 4,
  bufferSizes: 4 - Math.max(Math.round((difficulty - 7) / 4), 0),
  bufferPlacementLimits: 0 + Math.max(Math.round(difficulty / 4), 0),

  extraBuffers: [
    // {
    //   amount: difficulty < 4 ? 2 : 4,
    //   size: 4 - Math.max(Math.round((difficulty - 7) / 4), 0),
    //   limit: 0 + Math.max(Math.round(difficulty / 4), 0)
    // },
    {
      amount: 1,
      size: difficulty > 8 ? 3 : 4,
      limit: 0
    },
    {
      amount: 1,
      size: difficulty > 10 ? 3 : 4,
      limit: 0
    }
  ],
  blockColorPick: "end"
});

export const getSpecial2Settings: SettingsProducer = (difficulty) => {
  const getLayoutMap = (difficulty: number): LayoutMap => {
    if (difficulty === 1) {
      return {
        columns: [
          { fromColumn: 1, paddingTop: 2 },
          { fromColumn: 3, paddingTop: 2 }
        ]
      };
    }
    if (difficulty === 2 || difficulty === 3) {
      return {
        width: 5,
        columns: [
          { fromColumn: 0, paddingTop: 2 },
          { fromColumn: 1, paddingTop: 1 },
          { fromColumn: 3, paddingTop: 1 },
          { fromColumn: 4, paddingTop: 2 },

          { fromColumn: 9, toColumn: 5, paddingTop: 5 },
          { fromColumn: 8, toColumn: 6, paddingTop: 2 },
          { fromColumn: 7, paddingTop: 2 },
          { fromColumn: 5, toColumn: 8 },
          { fromColumn: 6, toColumn: 9 }
        ]
      };
    }
    if (difficulty === 4) {
      return {
        width: 5,
        columns: [
          { fromColumn: 0, paddingTop: 2 },
          { fromColumn: 1, paddingTop: 1 },
          { fromColumn: 2, paddingTop: 0 },
          { fromColumn: 3, paddingTop: 1 },
          { fromColumn: 4, paddingTop: 2 },

          { fromColumn: 9, toColumn: 5 },
          { fromColumn: 8, toColumn: 6, paddingTop: 2 },
          { fromColumn: 7, paddingTop: 2 },
          { fromColumn: 5, toColumn: 8 },
          { fromColumn: 6, toColumn: 9 }
        ]
      };
    }
    if (difficulty === 5) {
      return {
        width: 5,
        columns: [
          { fromColumn: 1, paddingTop: 2 },
          { fromColumn: 11, toColumn: 8 },
          { fromColumn: 12, toColumn: 3, paddingTop: 2 }
        ]
      };
    }
    if (difficulty === 6) {
      return {
        width: 5,
        columns: [
          { fromColumn: 1, paddingTop: 1 },
          { fromColumn: 2, toColumn: 13, paddingTop: 1 },
          { fromColumn: 3, paddingTop: 1 },
          { fromColumn: 5, paddingTop: 1 },
          { fromColumn: 6, paddingTop: 1 },
          { fromColumn: 10, paddingTop: 1 },
          { fromColumn: 12, toColumn: 9 },
          { fromColumn: 13, toColumn: 2, paddingTop: 3 }
        ]
      };
    }
    if (difficulty === 7) {
      return {
        width: 5,
        columns: [
          { fromColumn: 1, paddingTop: 1 },
          { fromColumn: 2, toColumn: 14, paddingTop: 1 },
          { fromColumn: 3, paddingTop: 1 },
          { fromColumn: 5, paddingTop: 1 },
          { fromColumn: 6, paddingTop: 1 },
          { fromColumn: 10, paddingTop: 1 },
          { fromColumn: 13, toColumn: 12 },
          { fromColumn: 14, toColumn: 2, paddingTop: 1 }
        ]
      };
    }
    if (difficulty === 8) {
      return {
        width: 6,
        columns: [
          { fromColumn: 0, paddingTop: 2 },
          { fromColumn: 5, paddingTop: 2 },
          { fromColumn: 14, toColumn: 7 },
          { fromColumn: 15, toColumn: 8 }
        ]
      };
    }
    if (difficulty === 9) {
      return {
        width: 6,
        columns: [
          { fromColumn: 0, paddingTop: 1 },
          { fromColumn: 2, paddingTop: 1 },
          { fromColumn: 4, paddingTop: 1 },
          { fromColumn: 15, toColumn: 5, paddingTop: 3 },
          { fromColumn: 16, toColumn: 11 }
        ]
      };
    }
    if (difficulty > 9) {
      return {
        width: 6,
        columns: [
          { fromColumn: 1, paddingTop: 1 },
          { fromColumn: 3, paddingTop: 1 },
          { fromColumn: 5, paddingTop: 1 }
        ]
      };
    }
    return { columns: [] };
  };

  return {
    amountColors: 5 + Math.min(Math.max(Math.round(difficulty * 1.1), 0), 11),
    stackSize: 3,
    extraPlacementStacks:
      4 - Math.min(Math.max(Math.round(difficulty / 2), 0), 2),
    extraPlacementLimits: Math.max(
      4 - Math.min(Math.max(Math.round(difficulty / 2), 0), 3) - 1,
      0
    ),
    blockColorPick: "end",
    layoutMap: getLayoutMap(difficulty)
  };
};

export const getSpecial3Settings: SettingsProducer = (difficulty) => ({
  amountColors: 5,
  stackSize: difficulty > 4 ? 5 : 4,
  extraPlacementStacks: 2,
  extraPlacementLimits:
    0 + Math.max(Math.min(Math.round(difficulty / 5), 2), 0),
  blockColorPick: "end",

  layoutMap: {
    width: 5,
    columns: [
      { fromColumn: 0, paddingTop: 3 },
      { fromColumn: 2, paddingTop: 3 },
      { fromColumn: 4, paddingTop: 3 }
    ]
  }
});

export const getSpecial4Settings: SettingsProducer = (difficulty) => {
  const getLayoutMap = (difficulty: number): LayoutMap => {
    if (difficulty === 1 || difficulty === 2) {
      return {
        width: 5,
        columns: [
          { fromColumn: 0, paddingTop: 1 },
          { fromColumn: 1, paddingTop: 1 },
          { fromColumn: 3, paddingTop: 1 },
          { fromColumn: 4, paddingTop: 1 }
        ]
      };
    }
    if (difficulty === 5 || difficulty === 6) {
      return {
        width: 5,
        columns: [
          { fromColumn: 0, paddingTop: 2 },
          { fromColumn: 4, paddingTop: 1 }
        ]
      };
    }
    if (difficulty === 7) {
      return {
        width: 5,
        columns: [
          { fromColumn: 1, paddingTop: 2 },
          { fromColumn: 3, paddingTop: 2 },
          { fromColumn: 5, paddingTop: 1 },
          { fromColumn: 7, paddingTop: 1 },
          { fromColumn: 11, paddingTop: 1 },
          { fromColumn: 12, paddingTop: 1 }
        ]
      };
    }
    if (difficulty > 7) {
      return {
        width: 5,
        columns: [
          { fromColumn: 1, paddingTop: 1 },
          { fromColumn: 3, paddingTop: 1 },
          { fromColumn: 5, paddingTop: 1 },
          { fromColumn: 7, paddingTop: 1 },
          { fromColumn: 11, paddingTop: 1 },
          { fromColumn: 14, paddingTop: 2 }
        ]
      };
    }
    return { columns: [] };
  };
  return {
    amountColors: 2 + Math.min(Math.max(Math.round(difficulty / 2), 0), 4),
    stacksPerColor: 2,
    stackSize: 3,
    extraPlacementStacks: 4 - Math.max(Math.round(difficulty / 5), 0),
    extraPlacementLimits: 2,
    buffers: 1,
    bufferSizes: 1,
    blockColorPick: "end",
    layoutMap: getLayoutMap(difficulty)
  };
};

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
    { amount: 1, size: difficulty > 4 && difficulty < 8 ? 3 : 2, limit: 1 }
  ],
  blockColorPick: "end",
  layoutMap:
    difficulty > 2
      ? {
          width: 5,
          columns: []
        }
      : undefined
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
  showIntro: true,
  introTextColor: "#a855f7",
  occurrence: (levelNr) => (levelNr + 1) % 7 === 0 || (levelNr + 1) % 25 === 0,
  getSettings(levelNr, random = Math.random) {
    const difficulty = getDifficultyLevel(levelNr);

    const templates: SettingsProducer[] = [
      getSpecial1Settings,
      getSpecial2Settings,
      getSpecial3Settings,
      getSpecial4Settings,
      getSpecial5Settings
    ];

    return pick(templates, random)(difficulty);
  },
  getZenSettings: (zenLevel, difficultyLevel) => {
    const templates: SettingsProducer[] = [
      getSpecial1Settings,
      getSpecial2Settings,
      getSpecial3Settings,
      getSpecial4Settings,
      getSpecial5Settings
    ];
    return templates[zenLevel % templates.length](difficultyLevel);
  }
};
