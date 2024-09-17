import { describe, expect, it } from "vitest";

import { moveBlocks } from "./actions";
import {
  createBlock,
  createBlocks,
  createHiddenBlocks,
  createLevelState,
  createPlacementColumn,
} from "./factories";
import { canPlaceAmount } from "./state";
import { LevelState } from "./types";

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

describe(moveBlocks, () => {
  it("moves a block from one column to another", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "black", "green")
      ),
      createPlacementColumn(
        4,
        createBlocks("black", "black", "white", "white")
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(4),
      createPlacementColumn(4),
    ]);

    const result = moveBlocks(level, 0, 3);
    const expected: LevelState = {
      colors: ["black", "green", "white"],
      columns: [
        createPlacementColumn(4, createBlocks("black", "green")),
        createPlacementColumn(
          4,
          createBlocks("black", "black", "white", "white")
        ),
        createPlacementColumn(
          4,
          createBlocks("green", "black", "green", "green")
        ),
        createPlacementColumn(4, createBlocks("white", "white")),
        createPlacementColumn(4),
      ],
      moves: [],
    };
    expect(result).toEqual(expected);
  });

  it("will not move if column full", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "black", "green")
      ),
      createPlacementColumn(
        4,
        createBlocks("black", "black", "white", "white")
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(4),
      createPlacementColumn(4),
    ]);

    const result = moveBlocks(level, 0, 1);
    expect(result).toEqual(level);
  });

  it("will not move if column has restriction that is not met", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "black", "green")
      ),
      createPlacementColumn(
        4,
        createBlocks("black", "black", "white", "white")
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(4, [], "black"),
      createPlacementColumn(4),
    ]);

    const result = moveBlocks(level, 0, 3);
    expect(result).toEqual(level);
  });

  it("will move if column has restriction that is met", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "black", "green")
      ),
      createPlacementColumn(
        4,
        createBlocks("black", "black", "white", "white")
      ),
      createPlacementColumn(
        4,
        createBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(4, [], "white"),
      createPlacementColumn(4),
    ]);

    const result = moveBlocks(level, 0, 3);
    const expected: LevelState = {
      colors: ["black", "green", "white"],
      columns: [
        createPlacementColumn(4, createBlocks("black", "green")),
        createPlacementColumn(
          4,
          createBlocks("black", "black", "white", "white")
        ),
        createPlacementColumn(
          4,
          createBlocks("green", "black", "green", "green")
        ),
        createPlacementColumn(4, createBlocks("white", "white"), "white"),
        createPlacementColumn(4),
      ],
      moves: [],
    };
    expect(result).toEqual(expected);
  });

  it("will reveal hidden items underneath (single)", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "white", "black", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("black", "black", "white", "white")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(4),
      createPlacementColumn(4),
    ]);

    const result = moveBlocks(level, 0, 3);
    const expected: LevelState = {
      colors: ["black", "green", "white"],
      columns: [
        createPlacementColumn(4, createHiddenBlocks("white", "black", "green")),
        createPlacementColumn(
          4,
          createHiddenBlocks("black", "black", "white", "white")
        ),
        createPlacementColumn(
          4,
          createHiddenBlocks("green", "black", "green", "green")
        ),
        createPlacementColumn(4, [createBlock("white")]),
        createPlacementColumn(4),
      ],
      moves: [],
    };
    expect(result).toEqual(expected);
  });

  it("will reveal hidden items underneath (multiple)", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "black", "black", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("black", "black", "white", "black")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(4),
      createPlacementColumn(4),
    ]);
    const result = moveBlocks(level, 0, 3);

    const expected: LevelState = {
      colors: ["black", "green", "white"],
      columns: [
        createPlacementColumn(4, [
          createBlock("black"),
          createBlock("black"),
          createBlock("green", true),
        ]),
        createPlacementColumn(4, [
          createBlock("black"),
          createBlock("black", true),
          createBlock("white", true),
          createBlock("black", true),
        ]),
        createPlacementColumn(4, [
          createBlock("green"),
          createBlock("black", true),
          createBlock("green", true),
          createBlock("green", true),
        ]),
        createPlacementColumn(4, [createBlock("white")]),
        createPlacementColumn(4),
      ],
      moves: [],
    };
    expect(result).toEqual(expected);
  });

  it("locks placement column if complete", () => {
    const level = createLevelState([
      createPlacementColumn(
        4,
        createBlocks("white", "white", "black", "green")
      ),
      createPlacementColumn(4, createBlocks("black", "black")),
      createPlacementColumn(
        4,
        createBlocks("green", "black", "green", "green")
      ),
      createPlacementColumn(4, createBlocks("white", "white")),
      createPlacementColumn(4),
    ]);
    const result = moveBlocks(level, 0, 3);
    expect(result.columns[3].locked).toBe(true);
  });
});
