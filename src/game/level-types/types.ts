import { BlockTheme } from "../themes";
import { LevelSettings } from "../types";

export type levelModifiers = {
  theme?: BlockTheme;
  ghostMode?: boolean;
  packageMode?: boolean;
};

export type LevelType<T extends string> = {
  type: T;
  name: string;
  unlocksAtLevel?: number;
  symbol?: string;
  color?: string;
  borderClassName: string;
  buttonBackgroundClassName: string;
  textClassName: string;
  backgroundClassName?: string;
  levelModifiers?: levelModifiers;
  occurrence: (levelNr: number) => boolean;
  getSettings: (levelNr: number, random?: () => number) => LevelSettings;
  getZenSettings: (levelNr: number, difficulty: number) => LevelSettings;
};

export type Unlockable<T> = T & { unlocksAtLevel: number };
