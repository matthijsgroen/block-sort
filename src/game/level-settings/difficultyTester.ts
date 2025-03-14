import type { LevelSettings } from "../types";

import { LEVEL_SCALE } from "./levelSettings";

const ALL_DIFFICULTIES = [1].concat(LEVEL_SCALE.map((_level, i) => i + 2));

export const testDifficulties = (
  _getSettings: (difficulty: number) => LevelSettings,
  _difficulties = ALL_DIFFICULTIES
) => {
  // describe.concurrent("playability", () => {
  //   it.each(
  //     difficulties.map((difficulty) => ({
  //       difficulty,
  //       level: (LEVEL_SCALE[difficulty - 2] ?? 0) + 1
  //     }))
  //   )(
  //     "can play difficulty $difficulty at level $level",
  //     async ({ difficulty }) => {
  //       const settings = getSettings(difficulty);
  //       const hash = settingsHash(settings);
  //       const seeds = levelSeeds[hash] ?? [];
  //       const preSeed = seeds[0]?.[0];
  //       expect(preSeed).toBeDefined();
  //       const random = mulberry32(preSeed);
  //       const result = await generatePlayableLevel(settings, {
  //         random,
  //         seed: preSeed
  //       });
  //       expect(result.moves.length).toBeGreaterThan(2);
  //       expect(result.generationInformation?.seed).toBe(preSeed);
  //       // actual play level
  //       let levelState = result;
  //       for (const move of result.moves) {
  //         levelState = moveBlocks(levelState, move);
  //       }
  //       const won = hasWon(levelState);
  //       expect(won).toBe(true);
  //     },
  //     90_000
  //   );
  // });
};
