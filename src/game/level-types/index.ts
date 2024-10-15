import { LevelSettings } from "../types";

import { easy } from "./easy";
import { hard } from "./hard";
import { normal } from "./normal";
import { scrambled } from "./scrambled";
import { special } from "./special";
import { LevelType, Unlockable } from "./types";
import { winter } from "./winter";

const levelTypes = [
  // ghost, // -- not yet ready for release
  special,
  hard,
  easy,
  scrambled,
  winter,
  normal,
] as const satisfies LevelType<string>[];

export type LevelTypeString = (typeof levelTypes)[number]["type"];

export const getLevelType = (levelNr: number): LevelType<string> =>
  levelTypes.find((level) => level.occurrence(levelNr))!;

export const getLevelTypeByType = <T extends LevelTypeString>(
  type: T,
): LevelType<T> =>
  levelTypes.find((level) => level.type === type) as LevelType<T>;

export const getUnlockableLevelTypes = (): Unlockable<LevelType<string>>[] =>
  (levelTypes as LevelType<string>[])
    .filter(
      (level): level is Unlockable<LevelType<string>> =>
        level.unlocksAtLevel !== undefined,
    )
    .sort((a, b) => a.unlocksAtLevel - b.unlocksAtLevel);

export const levelTypeTextColor = (levelNr: number): string => {
  const levelType = getLevelType(levelNr);

  return levelType.textClassName;
};

export const levelTypeBorder = (levelNr: number): string => {
  const levelType = getLevelType(levelNr);

  return levelType.borderClassName;
};

export const getLevelSettings = (
  levelNr: number,
  random = Math.random,
): LevelSettings => {
  const levelType = getLevelType(levelNr);
  return levelType.getSettings(levelNr, random);
};
