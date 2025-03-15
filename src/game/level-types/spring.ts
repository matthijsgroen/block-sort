import { getDifficultyLevel } from "../level-settings/levelSettings";
import type { LayoutMap, SettingsProducer } from "../types";

import type { LevelType } from "./types";

export const getSpringSettings: SettingsProducer = (difficulty) => {
  const extraBufferSize = (difficulty: number) => {
    if (difficulty < 6) {
      return -1;
    }
    if (difficulty > 10) {
      return 4;
    }
    if (difficulty > 8) {
      return 6;
    }
    if (difficulty > 6) {
      return 3;
    }
    return 0;
  };

  const getLayoutMap = (difficulty: number): LayoutMap => {
    if (difficulty === 1) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 0 },
          { fromColumn: 0, toColumn: 1, paddingTop: 1 },
          { fromColumn: 1, toColumn: 2, paddingTop: 2 }
        ]
      };
    }
    if (difficulty === 2) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 0 },
          { fromColumn: 0, toColumn: 1, paddingTop: 1 },
          { fromColumn: 1, toColumn: 2, paddingTop: 0 },
          { fromColumn: 2, toColumn: 3, paddingTop: 1 }
        ]
      };
    }
    if (difficulty === 3) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 3 },
          { fromColumn: 0, toColumn: 1, paddingTop: 1 },
          { fromColumn: 1, toColumn: 2, paddingTop: 0 },
          { fromColumn: 2, toColumn: 3, paddingTop: 1 },
          { fromColumn: 3, toColumn: 4, paddingTop: 2 }
        ]
      };
    }
    if (difficulty === 4) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 2 },
          { fromColumn: 2, toColumn: 2, paddingTop: 1 },
          { fromColumn: 3, toColumn: 3, paddingTop: 2 }
        ]
      };
    }
    if (difficulty === 5) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 0 },
          { fromColumn: 1, toColumn: 1, paddingTop: 1 },
          { fromColumn: 2, toColumn: 2, paddingTop: 2 },
          { fromColumn: 3, toColumn: 3, paddingTop: 3 },
          { fromColumn: 4, toColumn: 4, paddingTop: 4 },
          { fromColumn: 5, toColumn: 5, paddingTop: 5 }
        ]
      };
    }
    if (difficulty === 6) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 3 },
          { fromColumn: 1, toColumn: 1, paddingTop: 0 },
          { fromColumn: 2, toColumn: 2, paddingTop: 3 },
          { fromColumn: 3, toColumn: 3, paddingTop: 0 },
          { fromColumn: 4, toColumn: 4, paddingTop: 3 },
          { fromColumn: 5, toColumn: 5, paddingTop: 0 }
        ]
      };
    }
    if (difficulty === 7) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 1 },
          { fromColumn: 1, toColumn: 1, paddingTop: 0 },
          { fromColumn: 2, toColumn: 2, paddingTop: 3 },
          { fromColumn: 3, toColumn: 3, paddingTop: 0 },
          { fromColumn: 4, toColumn: 4, paddingTop: 3 },
          { fromColumn: 5, toColumn: 5, paddingTop: 0 }
        ]
      };
    }
    if (difficulty === 8) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 2 },
          { fromColumn: 5, toColumn: 5, paddingTop: 3 }
        ]
      };
    }
    if (difficulty === 11) {
      return {
        columns: [{ fromColumn: -1, toColumn: 0, paddingTop: 2 }]
      };
    }
    return {
      columns: [{ fromColumn: -1, toColumn: 0, paddingTop: 1 }]
    };
  };

  return {
    amountColors: Math.min(1 + difficulty, 10),
    stackSize: Math.min(Math.max(Math.floor(3 + (difficulty - 2) / 2), 4), 7),
    extraPlacementStacks: 0,
    hideBlockTypes: "none",
    extraBuffers: [
      {
        size:
          Math.min(Math.max(Math.floor(3 + (difficulty - 2) / 2), 4), 7) +
          extraBufferSize(difficulty),
        amount: 1,
        limit: 0,
        bufferType: "unlimited"
      }
    ],
    layoutMap: getLayoutMap(difficulty)
  };
};

export const getEasySpringSettings: SettingsProducer = (difficulty) => {
  const extraBufferSize = (difficulty: number) => {
    if (difficulty < 5) {
      return 0;
    }
    if (difficulty > 10) {
      return 6;
    }
    if (difficulty > 8) {
      return 7;
    }
    if (difficulty > 6) {
      return 4;
    }
    return 2;
  };

  const getLayoutMap = (difficulty: number): LayoutMap => {
    if (difficulty === 1) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 0 },
          { fromColumn: 0, toColumn: 1, paddingTop: 1 },
          { fromColumn: 1, toColumn: 2, paddingTop: 2 }
        ]
      };
    }
    if (difficulty === 2) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 0 },
          { fromColumn: 0, toColumn: 1, paddingTop: 1 },
          { fromColumn: 1, toColumn: 2, paddingTop: 0 },
          { fromColumn: 2, toColumn: 3, paddingTop: 1 }
        ]
      };
    }
    if (difficulty === 3) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 2 },
          { fromColumn: 0, toColumn: 1, paddingTop: 1 },
          { fromColumn: 1, toColumn: 2, paddingTop: 0 },
          { fromColumn: 2, toColumn: 3, paddingTop: 1 },
          { fromColumn: 3, toColumn: 4, paddingTop: 2 }
        ]
      };
    }
    if (difficulty === 4) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 1 },
          { fromColumn: 2, toColumn: 2, paddingTop: 1 },
          { fromColumn: 3, toColumn: 3, paddingTop: 2 }
        ]
      };
    }
    if (difficulty === 5) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 1 },
          { fromColumn: 2, toColumn: 2, paddingTop: 1 },
          { fromColumn: 3, toColumn: 3, paddingTop: 2 },
          { fromColumn: 4, toColumn: 4, paddingTop: 3 },
          { fromColumn: 5, toColumn: 5, paddingTop: 4 }
        ]
      };
    }
    if (difficulty === 6) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 2 },
          { fromColumn: 1, toColumn: 1, paddingTop: 3 },
          { fromColumn: 2, toColumn: 2, paddingTop: 0 },
          { fromColumn: 3, toColumn: 3, paddingTop: 3 },
          { fromColumn: 4, toColumn: 4, paddingTop: 0 },
          { fromColumn: 5, toColumn: 5, paddingTop: 3 }
        ]
      };
    }
    if (difficulty === 7) {
      return {
        columns: [
          { fromColumn: -1, toColumn: 0, paddingTop: 1 },
          { fromColumn: 1, toColumn: 1, paddingTop: 0 },
          { fromColumn: 2, toColumn: 2, paddingTop: 3 },
          { fromColumn: 3, toColumn: 3, paddingTop: 0 },
          { fromColumn: 4, toColumn: 4, paddingTop: 3 },
          { fromColumn: 5, toColumn: 5, paddingTop: 0 }
        ]
      };
    }
    return {
      columns: [{ fromColumn: -1, toColumn: 0, paddingTop: 1 }]
    };
  };

  return {
    amountColors: Math.min(1 + difficulty, 10),
    stackSize: Math.min(Math.max(Math.floor(3 + (difficulty - 2) / 2), 4), 7),
    extraPlacementStacks: 0,
    hideBlockTypes: "none",
    extraBuffers: [
      {
        size:
          Math.min(Math.max(Math.floor(3 + (difficulty - 2) / 2), 4), 7) +
          extraBufferSize(difficulty),
        amount: 1,
        limit: 0,
        bufferType: "unlimited"
      }
    ],
    layoutMap: getLayoutMap(difficulty)
  };
};

export const spring: LevelType<"spring"> = {
  type: "spring",
  name: "Spring",
  symbol: "️🌈",
  activeDuringTheme: "spring",
  unlocksAtLevel: 10,
  borderClassName: "border-2 border-yellow-200",
  textClassName: "text-blue-300",
  buttonBackgroundClassName: "bg-pink-400",
  backgroundClassName: "bg-pink-200/10",
  showIntro: true,
  introTextColor: "#ec4899",
  occurrence: (levelNr, { theme }) =>
    theme === "spring" && (levelNr - 1) % 6 === 0 && levelNr > 10,
  getSettings: (levelNr) => {
    if (levelNr < 200) {
      const easyDifficulty = getDifficultyLevel(levelNr);
      return getEasySpringSettings(easyDifficulty);
    }
    const difficulty = getDifficultyLevel(levelNr - 199);
    return getSpringSettings(difficulty);
  },
  getZenSettings: (_levelNr, difficulty) => {
    if (difficulty < 3) {
      return getEasySpringSettings(difficulty);
    }
    return getSpringSettings(difficulty);
  }
};
