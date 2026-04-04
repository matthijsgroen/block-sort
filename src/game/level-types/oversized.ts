import { getDifficultyLevel } from "../level-settings/levelSettings";
import type { LevelSettings, SettingsProducer } from "../types";

import type { LevelType } from "./types";

/**
 * Oversized columns — one oversized column (multiplier 2).
 * Column order: [oversized(0), extra1(1), extra2(2), normal cols(3+)]
 * Use layoutMap with small positive indices to reposition if needed.
 */
export const getOversized1Settings: SettingsProducer = (
  difficulty
): LevelSettings => {
  const amountColors = [4, 5, 6, 7, 8, 9, 6, 6, 8, 8, 13];
  const stackSizes = [4, 4, 5, 5, 4, 4, 6, 7, 6, 4, 4];
  const width = [4, 4, 5, 5, 6];

  let oversizedColumns: Partial<LevelSettings> = {
    oversizedColumns: [{ multiplier: 2 }],
    layoutMap: {
      width: width[Math.min(difficulty - 1, width.length - 1)],
      columns: [{ fromColumn: 0, toColumn: 2 }]
    }
  };
  if (difficulty >= 5) {
    oversizedColumns = {
      ...oversizedColumns,
      oversizedColumns: [{ multiplier: 1.5 }, { multiplier: 1.5 }],
      layoutMap: {
        width: width[Math.min(difficulty - 1, width.length - 1)],
        columns: [
          { fromColumn: 2, toColumn: 0, paddingTop: 1 },
          { fromColumn: 3, toColumn: 1, paddingTop: 1 },
          { fromColumn: 4, paddingTop: 1 },
          { fromColumn: 5, paddingTop: 1 }
        ]
      }
    };
  }
  if (difficulty >= 7) {
    oversizedColumns = {
      ...oversizedColumns,
      oversizedColumns: [{ multiplier: 2 }, { multiplier: 2 }],
      layoutMap: {
        width: width[Math.min(difficulty - 1, width.length - 1)],
        columns: [
          { fromColumn: 2, toColumn: 0 },
          { fromColumn: 3, toColumn: 1 }
        ]
      }
    };
  }
  if (difficulty >= 9) {
    oversizedColumns = {
      ...oversizedColumns,
      oversizedColumns: [
        { multiplier: 1.25 },
        { multiplier: 1.25 },
        { multiplier: 1.25 }
      ],
      layoutMap: {
        width: width[Math.min(difficulty - 1, width.length - 1)],
        columns: [
          { fromColumn: 3, toColumn: 0 },
          { fromColumn: 4, toColumn: 2 },
          { fromColumn: 5, toColumn: 4 }
        ]
      }
    };
  }
  if (difficulty >= 10) {
    oversizedColumns = {
      ...oversizedColumns,
      oversizedColumns: [{ multiplier: 3 }, { multiplier: 3 }],
      layoutMap: {
        width: width[Math.min(difficulty - 1, width.length - 1)],
        columns: [{ fromColumn: 3, toColumn: 0 }]
      }
    };
  }
  if (difficulty >= 11) {
    oversizedColumns = {
      ...oversizedColumns,
      oversizedColumns: [{ multiplier: 3 }],
      layoutMap: {
        width: width[Math.min(difficulty - 1, width.length - 1)],
        columns: [{ fromColumn: 0, toColumn: 3 }]
      }
    };
  }

  return {
    amountColors:
      amountColors[Math.min(difficulty - 1, amountColors.length - 1)],
    stackSize: stackSizes[Math.min(difficulty - 1, stackSizes.length - 1)],
    extraPlacementStacks: 0,
    extraPlacementLimits: 0,
    blockColorPick: "start",
    ...oversizedColumns
  };
};

export const oversized: LevelType<"oversized"> = {
  type: "oversized",
  name: "Oversized",
  /** No unlocksAtLevel — only accessible via beta test in Zen Mode */
  inBetaTest: true,
  symbol: "📦",
  color: "#f59e0b",
  borderClassName: "border-2 border-amber-500",
  textClassName: "text-amber-500",
  buttonBackgroundClassName: "bg-amber-500",
  backgroundClassName: "bg-amber-500/40",
  showIntro: true,
  introTextColor: "#f59e0b",
  /** Never occurs in the normal level track — beta only */
  occurrence: () => false,
  getSettings(levelNr) {
    const difficulty = getDifficultyLevel(levelNr);
    return getOversized1Settings(difficulty);
  },
  getZenSettings(_zenLevel, difficultyLevel) {
    return getOversized1Settings(difficultyLevel);
  }
};
