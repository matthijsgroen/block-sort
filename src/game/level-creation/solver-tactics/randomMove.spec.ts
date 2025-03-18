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
        extraPlacementStacks: 2
      },
      random
    );
    const moves = randomMove(level, random);

    expect(moves).toHaveLength(2);
    expect(moves[0].weight).toEqual(1);
    expect(moves[0].move).toEqual({ from: 3, to: 4 });
  });

  it("will return a different move each time", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 4,
        stackSize: 4,
        extraPlacementStacks: 2
      },
      random
    );
    randomMove(level, random);
    const moves = randomMove(level, random);

    expect(moves).toHaveLength(2);
    expect(moves[0].weight).toEqual(1);
    expect(moves[0].move).toEqual({ from: 1, to: 4 });
  });

  it("will not suggest inventory columns", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 4,
        stackSize: 4,
        extraPlacementStacks: 1,
        extraBuffers: [
          {
            size: 1,
            amount: 1,
            bufferType: "inventory",
            limit: 0
          }
        ]
      },
      random
    );
    randomMove(level, random);
    const moves = randomMove(level, random);

    expect(moves).toHaveLength(2);
    expect(moves.every((m) => m.move.to === 4)).toBe(true);
  });
});
