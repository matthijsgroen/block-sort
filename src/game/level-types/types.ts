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
  inBetaTest?: boolean;
  activeDuringTheme?: BlockTheme;
  symbol?: string;
  /**
   * Must be a hex code
   */
  color?: string;
  borderClassName: string;
  buttonBackgroundClassName: string;
  textClassName: string;
  backgroundClassName?: string;
  levelModifiers?: levelModifiers;
  showIntro?: boolean;
  /**
   * Must be a hex code
   */
  introTextColor?: string;
  occurrence: (levelNr: number) => boolean;
  getSettings: (levelNr: number, random?: () => number) => LevelSettings;
  getZenSettings: (levelNr: number, difficulty: number) => LevelSettings;
};

export type Unlockable<T> = T & { unlocksAtLevel: number };
