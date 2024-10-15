type DifficultyLevel = {
  name: string;
  unlocksAtLevel: number;
  difficulties: number[];
};

export const ZEN_MODE_UNLOCK = 30;

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { name: "Starter", unlocksAtLevel: 30, difficulties: [0, 1, 2] },
  { name: "Junior", unlocksAtLevel: 50, difficulties: [3, 4, 5] },
  { name: "Expert", unlocksAtLevel: 75, difficulties: [6, 7] },
  { name: "Master", unlocksAtLevel: 200, difficulties: [8, 9] },
  { name: "Wizard", unlocksAtLevel: 300, difficulties: [10, 11] },
];
