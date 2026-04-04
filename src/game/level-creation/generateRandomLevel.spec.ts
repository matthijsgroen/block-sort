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
    it("throws when oversizedColumns.length >= amountColors", () => {
      const random = mulberry32(TEST_SEED);
      // 2 oversized cols with 2 total colors → no normal color left
      expect(() =>
        generateRandomLevel(
          {
            amountColors: 2,
            stackSize: 4,
            extraPlacementStacks: 0,
            oversizedColumns: [{ multiplier: 2 }, { multiplier: 2 }]
          },
          random
        )
      ).toThrow(/must be less than amountColors/);
    });

    it("throws when combined oversized block total is not divisible by stackSize", () => {
      const random = mulberry32(TEST_SEED);
      // 1 × round(1.5 × 4) = 6, 6 % 4 = 2 ≠ 0 → invalid
      expect(() =>
        generateRandomLevel(
          {
            amountColors: 3,
            stackSize: 4,
            extraPlacementStacks: 0,
            oversizedColumns: [{ multiplier: 1.5 }]
          },
          random
        )
      ).toThrow(/not divisible by stackSize/);
    });

    it("does not throw when combined oversized block total is divisible by stackSize", () => {
      const random = mulberry32(TEST_SEED);
      // 2 × round(1.5 × 4) = 12, 12 % 4 = 0 ✓
      expect(() =>
        generateRandomLevel(
          {
            amountColors: 4,
            stackSize: 4,
            extraPlacementStacks: 0,
            oversizedColumns: [{ multiplier: 1.5 }, { multiplier: 1.5 }]
          },
          random
        )
      ).not.toThrow();
    });

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
      // All 16 blocks are shuffled into: 2 normal cols (4 each) + 2 extra placement cols (4 each)
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

    it("adds extra filled placement columns based on total oversized block count", () => {
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

      // layout: [oversized(0), extra1(1), extra2(2), normal1(3), normal2(4)]
      expect(level.columns).toHaveLength(5);
      // Column 0 is the oversized column (starts empty)
      expect(level.columns[0].oversized).toBe(true);
      expect(level.columns[0].blocks).toHaveLength(0);
      // The 4 non-oversized placement columns are all filled with stackSize blocks
      const placementCols = level.columns.filter(
        (c) => c.type === "placement" && c.oversized !== true
      );
      expect(placementCols).toHaveLength(4);
      for (const col of placementCols) {
        expect(col.blocks).toHaveLength(4);
      }
    });

    it("supports fractional multipliers when combined total is divisible by stackSize", () => {
      const random = mulberry32(TEST_SEED);
      // 2 oversized cols × multiplier 1.5 × stackSize 4 = 12 total oversized blocks
      // 12 / 4 = 3 extra cols; 2 normal colors × 4 = 8 normal blocks
      // total blocks placed = 12 + 8 = 20 across 2 normal + 3 extra cols = 5 cols × 4
      const level = generateRandomLevel(
        {
          amountColors: 4, // 2 normal + 2 oversized
          stackSize: 4,
          extraPlacementStacks: 0,
          oversizedColumns: [{ multiplier: 1.5 }, { multiplier: 1.5 }]
        },
        random
      );

      // layout: [oversized0(0, size 6), oversized1(1, size 6), extra0(2), extra1(3), extra2(4), normal0(5), normal1(6)]
      expect(level.columns).toHaveLength(7);
      // Two oversized columns at the front, both size 6 and empty
      expect(level.columns[0].oversized).toBe(true);
      expect(level.columns[0].columnSize).toBe(6);
      expect(level.columns[0].blocks).toHaveLength(0);
      expect(level.columns[1].oversized).toBe(true);
      expect(level.columns[1].columnSize).toBe(6);
      expect(level.columns[1].blocks).toHaveLength(0);
      // All non-oversized cols filled
      const placementCols = level.columns.filter(
        (c) => c.type === "placement" && c.oversized !== true
      );
      expect(placementCols).toHaveLength(5);
      for (const col of placementCols) {
        expect(col.blocks).toHaveLength(4);
      }
      // Total blocks = 5 × 4 = 20 (the 2 oversized cols are empty)
      const totalBlocks = level.columns.reduce(
        (sum, c) => sum + c.blocks.length,
        0
      );
      expect(totalBlocks).toBe(20);
    });
  });
});
