export const BASE_SEED = 12345678901234;
export const ZEN_BASE_SEED = 43210987654321;
export const SCREEN_TRANSITION = 500; // ms

type DifficultyLevel = {
  name: string;
  unlocksAtLevel: number;
  difficulties: number[];
};

export const ZEN_MODE_UNLOCK = 30;

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  { name: "Starter", unlocksAtLevel: 30, difficulties: [0, 1, 2] },
  { name: "Junior", unlocksAtLevel: 50, difficulties: [3, 4, 5] },
  { name: "Expert", unlocksAtLevel: 80, difficulties: [6, 7] },
  { name: "Master", unlocksAtLevel: 200, difficulties: [8, 9] },
  { name: "Wizard", unlocksAtLevel: 300, difficulties: [10] }
];

type Difficulty = {
  name: string;
  stars: number;
};

export const DIFFICULTIES: Difficulty[] = [
  { name: "Starter", stars: 1 },
  { name: "Starter", stars: 1 },
  { name: "Starter +", stars: 1 },
  { name: "Junior", stars: 2 },
  { name: "Junior +", stars: 2 },
  { name: "Junior ++", stars: 2 },
  { name: "Expert", stars: 3 },
  { name: "Expert +", stars: 3 },
  { name: "Master", stars: 4 },
  { name: "Master +", stars: 4 },
  { name: "Wizard", stars: 5 }
];
