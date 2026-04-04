import { pick } from "@/support/random";

import { getDifficultyLevel } from "../level-settings/levelSettings";
import type { SettingsProducer } from "../types";

import type { LevelType } from "./types";

/**
 * Oversized columns — difficulty 1–4: one oversized column (multiplier 2).
 * Minimal colour count so the extra columns fit on screen without a layoutMap.
 */
export const getOversized1Settings: SettingsProducer = (difficulty) => ({
  amountColors: 3 + Math.min(Math.floor(difficulty / 3), 3),
  stackSize: 4,
  extraPlacementStacks: 1,
  extraPlacementLimits: 0,
  oversizedColumns: [{ multiplier: 2 }],
  blockColorPick: "end"
});

/**
 * Two oversized columns (one with multiplier 2, one with multiplier 3).
 * Only suitable at higher difficulties where the solver has enough room to work.
 */
export const getOversized2Settings: SettingsProducer = (difficulty) => ({
  amountColors: 4 + Math.min(Math.floor(difficulty / 4), 2),
  stackSize: 4,
  extraPlacementStacks: 1,
  extraPlacementLimits: 0,
  oversizedColumns: [{ multiplier: 2 }, { multiplier: 3 }],
  blockColorPick: "end"
});

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
    const templates: SettingsProducer[] = [
      getOversized1Settings,
      getOversized2Settings
    ];
    return pick(templates, Math.random)(difficulty);
  },
  getZenSettings(zenLevel, difficultyLevel) {
    const templates: SettingsProducer[] = [
      getOversized1Settings,
      getOversized2Settings
    ];
    return templates[zenLevel % templates.length](difficultyLevel);
  }
};
