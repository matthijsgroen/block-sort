import type { BlockTheme } from "../themes";
import type { LevelSettings } from "../types";

import { dungeon } from "./dungeon";
import { easy } from "./easy";
import { hard } from "./hard";
import { normal } from "./normal";
import { scrambled } from "./scrambled";
import { special } from "./special";
import { spring } from "./spring";
import { summer } from "./summer";
import type { LevelType, Unlockable } from "./types";
import { winter } from "./winter";

const levelTypes = [
  // ghost, // -- not yet ready for release
  dungeon,
  special,
  hard,
  easy,
  scrambled,
  winter,
  spring,
  summer,
  normal
] as const satisfies LevelType<string>[];

export type LevelTypeString = (typeof levelTypes)[number]["type"];

export const getLevelType = (
  levelNr: number,
  theme: BlockTheme
): LevelType<string> =>
  levelTypes.find((level) => level.occurrence(levelNr, { theme }))!;

export const getLevelTypeByType = <T extends LevelTypeString>(
  type: T
): LevelType<T> =>
  levelTypes.find((level) => level.type === type) as LevelType<T>;

export const getLevelTypeByUnlock = (
  levelNr: number
): LevelType<LevelTypeString> =>
  levelTypes.find(
    (level) =>
      level.unlocksAtLevel === levelNr + 1 &&
      !level.inBetaTest &&
      !level.activeDuringTheme
  ) as LevelType<LevelTypeString>;

export const getUnlockableLevelTypes = (
  showBeta = false,
  activeTheme: BlockTheme = "default"
): Unlockable<LevelType<string>>[] =>
  (levelTypes as LevelType<string>[])
    .filter(
      (level): level is Unlockable<LevelType<string>> =>
        (level.unlocksAtLevel !== undefined &&
          level.activeDuringTheme === undefined) ||
        (!!level.inBetaTest && showBeta) ||
        (level.activeDuringTheme !== undefined &&
          level.activeDuringTheme === activeTheme)
    )
    .sort((a, b) => (a.unlocksAtLevel ?? 1000) - (b.unlocksAtLevel ?? 1000));

export const levelTypeTextColor = (
  levelNr: number,
  theme: BlockTheme
): string => {
  const levelType = getLevelType(levelNr, theme);

  return levelType.textClassName;
};

export const levelTypeBorder = (levelNr: number, theme: BlockTheme): string => {
  const levelType = getLevelType(levelNr, theme);

  return levelType.borderClassName;
};

export const getLevelSettings = (
  levelNr: number,
  theme: BlockTheme,
  random = Math.random
): LevelSettings => {
  const levelType = getLevelType(levelNr, theme);
  return levelType.getSettings(levelNr, random);
};
