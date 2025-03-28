import type { HideFormat } from "@/ui/Block/Block";

import type { BlockTheme } from "../themes";
import type { LevelSettings } from "../types";

export type LevelModifiers = {
  theme?: BlockTheme;
  ghostMode?: boolean;
  hideMode?: HideFormat;
  keepRevealed?: boolean;
  hideEvery?: number;
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
  levelModifiers?: LevelModifiers;
  showIntro?: boolean;
  /**
   * Must be a hex code
   */
  introTextColor?: string;
  occurrence: (levelNr: number, env: { theme: BlockTheme }) => boolean;
  getSettings: (levelNr: number, random?: () => number) => LevelSettings;
  getZenSettings: (levelNr: number, difficulty: number) => LevelSettings;
};

export type Unlockable<T> = T & { unlocksAtLevel: number };
