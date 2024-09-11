import { expect, it, describe } from "vitest";
import { generateLevel } from "./generateLevel";
import { mulberry32 } from "../support/random";
import { createBlock, createPlacementColumn } from "./factories";

const TEST_SEED = 123456789;

describe(generateLevel, () => {
  it("generates a simple level", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateLevel(random, {
      amountColors: 2,
      stackSize: 4,
      extraPlacementStacks: 2,
    });
    expect(level).toEqual({
      colors: ["black", "green"],
      columns: [
        createPlacementColumn(4, [
          createBlock("green"),
          createBlock("black"),
          createBlock("green"),
          createBlock("green"),
        ]),
        createPlacementColumn(4, [
          createBlock("black"),
          createBlock("black"),
          createBlock("green"),
          createBlock("black"),
        ]),
        createPlacementColumn(4),
        createPlacementColumn(4),
      ],
    });
  });
});
