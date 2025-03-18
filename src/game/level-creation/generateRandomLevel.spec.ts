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
});
