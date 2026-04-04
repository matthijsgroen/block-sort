import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";

import {
  createBlocks,
  createBufferColumn,
  createHiddenBlocks,
  createPlacementColumn
} from "../factories";

import { generateRandomLevel } from "./generateRandomLevel";

const TEST_SEED = 123456789;

describe(generateRandomLevel, () => {
  it("generates a simple level", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 2
      },
      random
    );
    expect(level.blockTypes).toEqual(["blue", "white"]);
    expect(level.columns).toEqual([
      createPlacementColumn(4, createBlocks("white", "white", "blue", "blue")),
      createPlacementColumn(4, createBlocks("blue", "white", "white", "blue")),
      createPlacementColumn(4),
      createPlacementColumn(4)
    ]);
  });

  it("can generate a hidden level", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 2,
        hideBlockTypes: "all"
      },
      random
    );
    expect(level.blockTypes).toEqual(["blue", "white"]);
    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "white", "blue", "blue")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("blue", "white", "white", "blue")
      ),
      createPlacementColumn(4),
      createPlacementColumn(4)
    ]);
  });

  it("can generates buffers", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 0,
        buffers: 2,
        bufferSizes: 2,
        hideBlockTypes: "all"
      },
      random
    );
    expect(level.blockTypes).toEqual(["blue", "white"]);
    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "white", "blue", "blue")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("blue", "white", "white", "blue")
      ),
      createBufferColumn(2),
      createBufferColumn(2)
    ]);
  });

  it("can generates buffers of different sizes", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 0,
        buffers: 2,
        bufferSizes: 2,
        extraBuffers: [{ amount: 1, size: 3, limit: 1 }],
        hideBlockTypes: "all"
      },
      random
    );
    expect(level.blockTypes).toEqual(["blue", "white"]);
    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "white", "blue", "blue")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("blue", "white", "white", "blue")
      ),
      createBufferColumn(2),
      createBufferColumn(2),
      createBufferColumn(3, "blue")
    ]);
  });

  it("can generates buffers that are locked", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 4,
        stackSize: 4,
        extraPlacementStacks: 0,
        buffers: 2,
        bufferSizes: 2,
        bufferPlacementLimits: 2,
        hideBlockTypes: "all"
      },
      random
    );
    expect(level.blockTypes).toEqual(["blue", "red", "white", "yellow"]);
    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "yellow", "blue", "white")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("red", "red", "red", "white")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("red", "yellow", "blue", "blue")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("yellow", "blue", "white", "yellow")
      ),

      createBufferColumn(2, "yellow"),
      createBufferColumn(2, "red")
    ]);
  });

  it("both buffers and columns can be locked", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 4,
        stackSize: 4,
        extraPlacementStacks: 1,
        extraPlacementLimits: 1,
        buffers: 1,
        bufferSizes: 2,
        bufferPlacementLimits: 1,
        hideBlockTypes: "all"
      },
      random
    );
    expect(level.blockTypes).toEqual(["blue", "red", "white", "yellow"]);
    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "yellow", "blue", "white")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("red", "red", "red", "white")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("red", "yellow", "blue", "blue")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("yellow", "blue", "white", "yellow")
      ),

      createPlacementColumn(4, [], "red"),
      createBufferColumn(2, "yellow")
    ]);
  });

  describe("oversized columns", () => {
    it("generates an oversized column that starts empty with the correct size", () => {
      const random = mulberry32(TEST_SEED);
      // 2 normal colors + 1 oversized color (multiplier 2 → size 8), stackSize 4
      const level = generateRandomLevel(
        {
          amountColors: 3,
          stackSize: 4,
          extraPlacementStacks: 0,
          oversizedColumns: [{ multiplier: 2 }]
        },
        random
      );

      // The oversized column should be empty, have size 8, and the oversized flag
      const oversizedCols = level.columns.filter((c) => c.oversized === true);
      expect(oversizedCols).toHaveLength(1);
      expect(oversizedCols[0].columnSize).toBe(8);
      expect(oversizedCols[0].blocks).toHaveLength(0);
    });

    it("generates the correct total block count when oversized columns are present", () => {
      const random = mulberry32(TEST_SEED);
      // 2 normal colors (4 blocks each = 8) + 1 oversized color (2×4 = 8) = 16 total
      // All 16 blocks are shuffled into: 2 normal cols (4 each) + 2 extra empties (4 each)
      // The oversized column itself starts empty.
      const level = generateRandomLevel(
        {
          amountColors: 3,
          stackSize: 4,
          extraPlacementStacks: 0,
          oversizedColumns: [{ multiplier: 2 }]
        },
        random
      );

      const totalBlocks = level.columns.reduce(
        (sum, c) => sum + c.blocks.length,
        0
      );
      // 2 normal cols × 4 + 2 extra cols × 4 = 16 blocks (oversized column starts empty)
      expect(totalBlocks).toBe(16);
    });

    it("adds multiplier extra filled placement columns per oversized column", () => {
      const random = mulberry32(TEST_SEED);
      const level = generateRandomLevel(
        {
          amountColors: 3,
          stackSize: 4,
          extraPlacementStacks: 0,
          oversizedColumns: [{ multiplier: 2 }]
        },
        random
      );

      // 2 normal cols + 0 extra placements + 1 oversized + 2 extra filled cols = 5 columns total
      expect(level.columns).toHaveLength(5);
      // exactly one oversized column (starts empty)
      const oversizedCols = level.columns.filter((c) => c.oversized === true);
      expect(oversizedCols).toHaveLength(1);
      expect(oversizedCols[0].blocks).toHaveLength(0);
      // The 4 non-oversized placement columns are all filled with stackSize blocks
      const placementCols = level.columns.filter(
        (c) => c.type === "placement" && c.oversized !== true
      );
      expect(placementCols).toHaveLength(4);
      for (const col of placementCols) {
        expect(col.blocks).toHaveLength(4);
      }
    });
  });
});
