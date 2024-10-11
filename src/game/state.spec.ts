import { describe, expect, it } from "vitest";

import {
  createBlock,
  createBlocks,
  createBufferColumn,
  createHiddenBlocks,
  createLevelState,
  createPlacementColumn,
} from "./factories";
import { allShuffled, canPlaceAmount, hasWon, isStuck } from "./state";

describe(canPlaceAmount, () => {
  it("returns the amount that fits", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("red", "white", "white")),
    ]);

    const result = canPlaceAmount(level, 0, [{ color: "red" }]);
    expect(result).toEqual(1);
  });

  it("returns 0 for a full column", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("red", "red", "white", "white")),
    ]);

    const result = canPlaceAmount(level, 0, [{ color: "red" }]);
    expect(result).toEqual(0);
  });

  it("returns 1 for a 2 set if only 1 space is available", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("red", "white", "white")),
    ]);

    const result = canPlaceAmount(level, 0, [
      { color: "red" },
      { color: "red" },
    ]);
    expect(result).toEqual(1);
  });

  it("returns amount of blocks to place when even more space left", () => {
    const level = createLevelState([createPlacementColumn(4)]);

    const result = canPlaceAmount(level, 0, createBlocks("red", "red"));
    expect(result).toEqual(2);
  });

  it("returns 0 on stacking mismatch", () => {
    const level = createLevelState([
      createPlacementColumn(4, [createBlock("white")]),
    ]);

    const result = canPlaceAmount(level, 0, createBlocks("red", "red"));
    expect(result).toEqual(0);
  });

  it("returns 0 on conditional column", () => {
    const level = createLevelState([createPlacementColumn(4, [], "white")]);

    const result = canPlaceAmount(level, 0, createBlocks("red", "red"));
    expect(result).toEqual(0);
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
  it("returns false if a move changes the surface", () => {
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

  it("returns false if a move reveals something", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "white", "green", "white")
      ),
      createPlacementColumn(4, createHiddenBlocks("green", "green", "green")),
      createPlacementColumn(4, createHiddenBlocks("white", "pink", "pink")),
      createPlacementColumn(4, createHiddenBlocks("pink", "pink")),
    ]);
    const result = isStuck(level);
    expect(result).toBe(false);
  });

  it("returns false if you can divide a stack over other columns", () => {
    const level = createLevelState([
      createPlacementColumn(
        6,
        createBlocks("white", "white", "green", "green", "green")
      ),
      createPlacementColumn(
        6,
        createBlocks("white", "white", "green", "green", "green")
      ),
      createPlacementColumn(
        6,
        createBlocks("white", "white", "pink", "pink", "pink")
      ),
      createPlacementColumn(6, createBlocks("pink", "pink", "pink")),
    ]);
    // You can divide the 2 white blocks of column 2 to column 1 and 0, to access the pink column
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

  it("returns true if a move makes no difference (locked columns)", () => {
    const level = createLevelState([
      createPlacementColumn(4, createBlocks("white")),
      createPlacementColumn(4, createBlocks("red")),
      createPlacementColumn(4, createBlocks("black", "black", "red", "white")),
      createPlacementColumn(
        4,
        createBlocks("black", "green", "green", "brown")
      ),
      createPlacementColumn(
        4,
        createBlocks("black", "white", "white", "brown")
      ),
      createBufferColumn(4, "brown", createBlocks("brown", "brown")),
      createBufferColumn(3, "green", createBlocks("green", "green")),
      createBufferColumn(2, "red", createBlocks("red", "red")),
    ]);
    const result = isStuck(level);
    expect(result).toBe(true);
  });
});

describe(allShuffled, () => {
  it("returns false if a column has all same color", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "white", "white"),
        undefined,
        true
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "green", "green"),
        undefined,
        true
      ),
      createPlacementColumn(4, createBlocks("green")),
      createPlacementColumn(4),
    ]);
    const result = allShuffled(level);
    expect(result).toBe(false);
  });

  it("returns true if all columns are shuffled", () => {
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
