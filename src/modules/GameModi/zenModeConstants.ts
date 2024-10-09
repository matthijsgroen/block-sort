import { LevelType } from "@/support/getLevelType";

type DifficultyLevel = {
  name: string;
  unlocksAtLevel: number;
  difficulties: number[];
};

type UnlockableLevelType = {
  name: string;
  levelType: LevelType;
  unlocksAtLevel: number;
};

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { name: "Starter", unlocksAtLevel: 50, difficulties: [0, 1, 2] },
  { name: "Junior", unlocksAtLevel: 50, difficulties: [3, 4, 5] },
  { name: "Expert", unlocksAtLevel: 75, difficulties: [6, 7] },
  { name: "Master", unlocksAtLevel: 200, difficulties: [8, 9] },
  { name: "Wizard", unlocksAtLevel: 300, difficulties: [10, 11] },
];

export const LEVEL_TYPES: UnlockableLevelType[] = [
  { name: "Normal", levelType: "normal", unlocksAtLevel: 0 },
  { name: "Special", levelType: "special", unlocksAtLevel: 75 },
  { name: "Hard", levelType: "hard", unlocksAtLevel: 100 },
  { name: "Scrambled", levelType: "scrambled", unlocksAtLevel: 200 },
];
