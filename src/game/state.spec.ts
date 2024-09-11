import { describe, expect, it } from "vitest";
import { canPlaceAmount } from "./state";
import { LevelState } from "./types";
import { createBlock, createPlacementColumn } from "./factories";
import { moveBlocks } from "./actions";

describe(canPlaceAmount, () => {
  it("returns the amount that fits", () => {
    const level: LevelState = {
      colors: ["red", "white"],
      columns: [
        createPlacementColumn(4, [
          createBlock("red"),
          createBlock("white"),
          createBlock("white"),
        ]),
      ],
    };

    const result = canPlaceAmount(level, 0, [{ color: "red" }]);
    expect(result).toEqual(1);
  });

  it("returns 0 for a full column", () => {
    const level: LevelState = {
      colors: ["red", "white"],
      columns: [
        createPlacementColumn(4, [
          createBlock("red"),
          createBlock("red"),
          createBlock("white"),
          createBlock("white"),
        ]),
      ],
    };

    const result = canPlaceAmount(level, 0, [{ color: "red" }]);
    expect(result).toEqual(0);
  });

  it("returns 1 for a 2 set if only 1 space is available", () => {
    const level: LevelState = {
      colors: ["red", "white"],
      columns: [
        createPlacementColumn(4, [
          createBlock("red"),
          createBlock("white"),
          createBlock("white"),
        ]),
      ],
    };

    const result = canPlaceAmount(level, 0, [
      { color: "red" },
      { color: "red" },
    ]);
    expect(result).toEqual(1);
  });

  it("returns amount of blocks to place when even more space left", () => {
    const level: LevelState = {
      colors: ["red", "white"],
      columns: [createPlacementColumn(4)],
    };

    const result = canPlaceAmount(level, 0, [
      createBlock("red"),
      createBlock("red"),
    ]);
    expect(result).toEqual(2);
  });

  it("returns 0 on stacking mismatch", () => {
    const level: LevelState = {
      colors: ["red", "white"],
      columns: [createPlacementColumn(4, [createBlock("white")])],
    };

    const result = canPlaceAmount(level, 0, [
      createBlock("red"),
      createBlock("red"),
    ]);
    expect(result).toEqual(0);
  });

  it("returns 0 on conditional column", () => {
    const level: LevelState = {
      colors: ["red", "white"],
      columns: [createPlacementColumn(4, [], "white")],
    };

    const result = canPlaceAmount(level, 0, [
      createBlock("red"),
      createBlock("red"),
    ]);
    expect(result).toEqual(0);
  });
});

describe(moveBlocks, () => {
  it("moves a block from one column to another", () => {
    const level: LevelState = {
      colors: ["white", "black", "green"],
      columns: [
        createPlacementColumn(4, [
          createBlock("white"),
          createBlock("white"),
          createBlock("black"),
          createBlock("green"),
        ]),
        createPlacementColumn(4, [
          createBlock("black"),
          createBlock("black"),
          createBlock("white"),
          createBlock("white"),
        ]),
        createPlacementColumn(4, [
          createBlock("green"),
          createBlock("black"),
          createBlock("green"),
          createBlock("green"),
        ]),
        createPlacementColumn(4),
        createPlacementColumn(4),
      ],
    };

    const result = moveBlocks(level, 0, 3);
    const expected: LevelState = {
      colors: ["white", "black", "green"],
      columns: [
        createPlacementColumn(4, [createBlock("black"), createBlock("green")]),
        createPlacementColumn(4, [
          createBlock("black"),
          createBlock("black"),
          createBlock("white"),
          createBlock("white"),
        ]),
        createPlacementColumn(4, [
          createBlock("green"),
          createBlock("black"),
          createBlock("green"),
          createBlock("green"),
        ]),
        createPlacementColumn(4, [createBlock("white"), createBlock("white")]),
        createPlacementColumn(4),
      ],
    };
    expect(result).toEqual(expected);
  });

  it("will not move if column full", () => {
    const level: LevelState = {
      colors: ["white", "black", "green"],
      columns: [
        createPlacementColumn(4, [
          createBlock("white"),
          createBlock("white"),
          createBlock("black"),
          createBlock("green"),
        ]),
        createPlacementColumn(4, [
          createBlock("black"),
          createBlock("black"),
          createBlock("white"),
          createBlock("white"),
        ]),
        createPlacementColumn(4, [
          createBlock("green"),
          createBlock("black"),
          createBlock("green"),
          createBlock("green"),
        ]),
        createPlacementColumn(4),
        createPlacementColumn(4),
      ],
    };

    const result = moveBlocks(level, 0, 1);
    expect(result).toEqual(level);
  });

  it("will not move if column has restriction that is not met", () => {
    const level: LevelState = {
      colors: ["white", "black", "green"],
      columns: [
        createPlacementColumn(4, [
          createBlock("white"),
          createBlock("white"),
          createBlock("black"),
          createBlock("green"),
        ]),
        createPlacementColumn(4, [
          createBlock("black"),
          createBlock("black"),
          createBlock("white"),
          createBlock("white"),
        ]),
        createPlacementColumn(4, [
          createBlock("green"),
          createBlock("black"),
          createBlock("green"),
          createBlock("green"),
        ]),
        createPlacementColumn(4, [], "black"),
        createPlacementColumn(4),
      ],
    };

    const result = moveBlocks(level, 0, 3);
    expect(result).toEqual(level);
  });

  it("will move if column has restriction that is met", () => {
    const level: LevelState = {
      colors: ["white", "black", "green"],
      columns: [
        createPlacementColumn(4, [
          createBlock("white"),
          createBlock("white"),
          createBlock("black"),
          createBlock("green"),
        ]),
        createPlacementColumn(4, [
          createBlock("black"),
          createBlock("black"),
          createBlock("white"),
          createBlock("white"),
        ]),
        createPlacementColumn(4, [
          createBlock("green"),
          createBlock("black"),
          createBlock("green"),
          createBlock("green"),
        ]),
        createPlacementColumn(4, [], "white"),
        createPlacementColumn(4),
      ],
    };

    const result = moveBlocks(level, 0, 3);
    const expected: LevelState = {
      colors: ["white", "black", "green"],
      columns: [
        createPlacementColumn(4, [createBlock("black"), createBlock("green")]),
        createPlacementColumn(4, [
          createBlock("black"),
          createBlock("black"),
          createBlock("white"),
          createBlock("white"),
        ]),
        createPlacementColumn(4, [
          createBlock("green"),
          createBlock("black"),
          createBlock("green"),
          createBlock("green"),
        ]),
        createPlacementColumn(
          4,
          [createBlock("white"), createBlock("white")],
          "white"
        ),
        createPlacementColumn(4),
      ],
    };
    expect(result).toEqual(expected);
  });

  it("will reveal hidden items underneath (single)", () => {
    const level: LevelState = {
      colors: ["white", "black", "green"],
      columns: [
        createPlacementColumn(4, [
          createBlock("white"),
          createBlock("white", true),
          createBlock("black", true),
          createBlock("green", true),
        ]),
        createPlacementColumn(4, [
          createBlock("black"),
          createBlock("black", true),
          createBlock("white", true),
          createBlock("white", true),
        ]),
        createPlacementColumn(4, [
          createBlock("green"),
          createBlock("black", true),
          createBlock("green", true),
          createBlock("green", true),
        ]),
        createPlacementColumn(4),
        createPlacementColumn(4),
      ],
    };
    const result = moveBlocks(level, 0, 3);
    const expected: LevelState = {
      colors: ["white", "black", "green"],
      columns: [
        createPlacementColumn(4, [
          createBlock("white"),
          createBlock("black", true),
          createBlock("green", true),
        ]),
        createPlacementColumn(4, [
          createBlock("black"),
          createBlock("black", true),
          createBlock("white", true),
          createBlock("white", true),
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
    };
    expect(result).toEqual(expected);
  });

  it("will reveal hidden items underneath (multiple)", () => {
    const level: LevelState = {
      colors: ["white", "black", "green"],
      columns: [
        createPlacementColumn(4, [
          createBlock("white"),
          createBlock("black", true),
          createBlock("black", true),
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
        createPlacementColumn(4),
        createPlacementColumn(4),
      ],
    };
    const result = moveBlocks(level, 0, 3);

    const expected: LevelState = {
      colors: ["white", "black", "green"],
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
    };
    expect(result).toEqual(expected);
  });

  it("locks placement column if complete", () => {
    const level: LevelState = {
      colors: ["white", "black", "green"],
      columns: [
        createPlacementColumn(4, [
          createBlock("white"),
          createBlock("white"),
          createBlock("black"),
          createBlock("green"),
        ]),
        createPlacementColumn(4, [createBlock("black"), createBlock("black")]),
        createPlacementColumn(4, [
          createBlock("green"),
          createBlock("black"),
          createBlock("green"),
          createBlock("green"),
        ]),
        createPlacementColumn(4, [createBlock("white"), createBlock("white")]),
        createPlacementColumn(4),
      ],
    };
    const result = moveBlocks(level, 0, 3);
    expect(result.columns[3].locked).toBe(true);
  });
});
