import { LevelSettings } from "../types";

export type LevelType<T extends string> = {
  type: T;
  name: string;
  unlocksAtLevel?: number;
  symbol?: string;
  color?: string;
  borderClassName: string;
  buttonBackgroundClassName: string;
  textClassName: string;
  occurrence: (levelNr: number) => boolean;
  getSettings: (levelNr: number, random?: () => number) => LevelSettings;
  getZenSettings: (levelNr: number, difficulty: number) => LevelSettings;
};

export type Unlockable<T> = T & { unlocksAtLevel: number };
