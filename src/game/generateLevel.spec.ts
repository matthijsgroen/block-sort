import { expect, it, describe } from "vitest";
import { generateLevel, selectFromColumn } from "./generateLevel";
import { mulberry32 } from "../support/random";

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
        {
          blocks: ["green", "black", "green", "green"],
          columnSize: 4,
          type: "placement",
        },
        {
          blocks: ["black", "black", "green", "black"],
          columnSize: 4,
          type: "placement",
        },
        { blocks: [], columnSize: 4, type: "placement" },
        { blocks: [], columnSize: 4, type: "placement" },
      ],
    });
  });
});

describe(selectFromColumn, () => {
  it("selects the top of a column with the same color", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateLevel(random, {
      amountColors: 2,
      stackSize: 4,
      extraPlacementStacks: 1,
    });
    const blocks = selectFromColumn(level, 0);
    expect(blocks).toEqual(["green"]);
  });

  it("selects the top of a column with the same color (multiple)", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateLevel(random, {
      amountColors: 2,
      stackSize: 4,
      extraPlacementStacks: 1,
    });
    const blocks = selectFromColumn(level, 1);
    expect(blocks).toEqual(["black", "black"]);
  });

  it("selects the top of an empty column", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateLevel(random, {
      amountColors: 2,
      stackSize: 4,
      extraPlacementStacks: 1,
    });
    const blocks = selectFromColumn(level, 2);
    expect(blocks).toEqual([]);
  });
});
