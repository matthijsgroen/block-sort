import { describe, expect, it } from "vitest";

import { mulberry32 } from "../support/random";

import { generateRandomLevel } from "./level-creation/generateRandomLevel";
import { selectFromColumn } from "./actions";
import {
  createBlock,
  createLevelState,
  createPlacementColumn,
} from "./factories";
import { hasWon, isStuck } from "./state";

const TEST_SEED = 123456789;

describe(selectFromColumn, () => {
  it("selects the top of a column with the same color", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 1,
      },
      random
    );
    const blocks = selectFromColumn(level, 0);
    expect(blocks).toEqual([createBlock("green")]);
  });

  it("selects the top of a column with the same color (multiple)", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 1,
      },
      random
    );
    const blocks = selectFromColumn(level, 1);
    expect(blocks).toEqual([createBlock("black"), createBlock("black")]);
  });

  it("selects the top of a column with the same color (partially hidden)", () => {
    const level = createLevelState([
      createPlacementColumn(4, [
        createBlock("green"),
        createBlock("black", true),
        createBlock("green", true),
        createBlock("green", true),
      ]),
      createPlacementColumn(4, [
        createBlock("black"),
        createBlock("black", true),
        createBlock("green", true),
        createBlock("black", true),
      ]),
      createPlacementColumn(4),
    ]);
    const blocks = selectFromColumn(level, 1);
    expect(blocks).toEqual([createBlock("black")]);
  });

  it("selects the top of an empty column", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 1,
      },
      random
    );
    const blocks = selectFromColumn(level, 2);
    expect(blocks).toEqual([]);
  });

  it("selects the top of an locked column", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        [
          createBlock("white"),
          createBlock("white"),
          createBlock("white"),
          createBlock("white"),
        ],
        undefined,
        true
      ),
    ]);
    const blocks = selectFromColumn(level, 0);
    expect(blocks).toEqual([]);
  });
});

describe(hasWon, () => {
  it("returns true if all columns are empty or locked", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        [
          createBlock("white"),
          createBlock("white"),
          createBlock("white"),
          createBlock("white"),
        ],
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        [
          createBlock("green"),
          createBlock("green"),
          createBlock("green"),
          createBlock("green"),
        ],
        undefined,
        true
      ),
      createPlacementColumn(4),
      createPlacementColumn(4),
    ]);
    const result = hasWon(level);
    expect(result).toBe(true);
  });

  it("returns false if not all columns are empty or locked", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        [
          createBlock("white"),
          createBlock("white"),
          createBlock("green"),
          createBlock("white"),
        ],
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        [createBlock("green"), createBlock("green"), createBlock("green")],
        undefined,
        true
      ),
      createPlacementColumn(4, [createBlock("white")]),
      createPlacementColumn(4),
    ]);
    const result = hasWon(level);
    expect(result).toBe(false);
  });
});

describe(isStuck, () => {
  it("returns false if a move makes a difference", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        [
          createBlock("white"),
          createBlock("white"),
          createBlock("green"),
          createBlock("white"),
        ],
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        [createBlock("green"), createBlock("green"), createBlock("green")],
        undefined,
        true
      ),
      createPlacementColumn(4, [createBlock("white")]),
      createPlacementColumn(4),
    ]);
    const result = isStuck(level);
    expect(result).toBe(false);
  });

  it("returns true if a move makes no difference", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        [
          createBlock("white"),
          createBlock("white"),
          createBlock("green"),
          createBlock("white"),
        ],
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        [createBlock("white"), createBlock("green"), createBlock("green")],
        undefined,
        true
      ),
      createPlacementColumn(4, [
        createBlock("green"),
        createBlock("red"),
        createBlock("red"),
      ]),
      createPlacementColumn(4, [createBlock("red"), createBlock("red")]),
    ]);
    const result = isStuck(level);
    expect(result).toBe(true);
  });
});
