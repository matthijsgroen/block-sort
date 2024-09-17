import { describe, expect, it } from "vitest";

import { mulberry32 } from "../support/random";

import { generateRandomLevel } from "./level-creation/generateRandomLevel";
import { selectFromColumn } from "./actions";
import {
  createBlock,
  createBlocks,
  createHiddenBlocks,
  createLevelState,
  createPlacementColumn,
} from "./factories";
import { hasWon, isStuck } from "./state";

const TEST_SEED = 123456789;

describe(selectFromColumn, () => {
  it("selects the top of a column", () => {
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
    expect(blocks).toEqual([createBlock("darkblue")]);
  });

  it("selects the top of a column with multiple of the same color", () => {
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
    expect(blocks).toEqual([createBlock("green"), createBlock("green")]);
  });

  it("selects the top of a column (partially hidden)", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("black", "black", "green", "black")
      ),
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
        createBlocks("white", "white", "white", "white"),
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
        createBlocks("white", "white", "white", "white"),
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "green", "green", "green"),
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
        createBlocks("white", "white", "green", "white"),
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "green", "green"),
        undefined,
        true
      ),
      createPlacementColumn(4, createBlocks("white")),
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
        createBlocks("white", "white", "green", "white"),
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "green", "green"),
        undefined,
        true
      ),
      createPlacementColumn(4, createBlocks("white")),
      createPlacementColumn(4),
    ]);
    const result = isStuck(level);
    expect(result).toBe(false);
  });

  it("returns true if a move makes no difference", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "green", "white"),
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        createBlocks("white", "green", "green"),
        undefined,
        true
      ),
      createPlacementColumn(4, createBlocks("green", "red", "red")),
      createPlacementColumn(4, createBlocks("red", "red")),
    ]);
    const result = isStuck(level);
    expect(result).toBe(true);
  });
});
