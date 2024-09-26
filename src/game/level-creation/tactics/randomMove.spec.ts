import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";

import { generateRandomLevel } from "../generateRandomLevel";

import { randomMove } from "./randomMove";

const TEST_SEED = 123456789;

describe(randomMove, () => {
  it("returns a random move to perform", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 4,
        stackSize: 4,
        extraPlacementStacks: 2,
      },
      random
    );
    const moves = randomMove(level, random);

    expect(moves).toHaveLength(1);
    expect(moves[0].weight).toEqual(1);
    expect(moves[0].move).toEqual({ from: 3, to: 4 });
  });

  it("will return a different move each time", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 4,
        stackSize: 4,
        extraPlacementStacks: 2,
      },
      random
    );
    randomMove(level, random);
    const moves = randomMove(level, random);

    expect(moves).toHaveLength(1);
    expect(moves[0].weight).toEqual(1);
    expect(moves[0].move).toEqual({ from: 3, to: 4 });
  });
});
