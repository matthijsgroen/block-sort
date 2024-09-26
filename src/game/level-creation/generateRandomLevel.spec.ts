import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";

import {
  createBlocks,
  createBufferColumn,
  createHiddenBlocks,
  createPlacementColumn,
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
        extraPlacementStacks: 2,
      },
      random
    );
    expect(level.colors).toEqual(["green", "pink"]);

    expect(level.columns).toEqual([
      createPlacementColumn(4, createBlocks("green", "pink", "green", "green")),
      createPlacementColumn(4, createBlocks("pink", "pink", "green", "pink")),
      createPlacementColumn(4),
      createPlacementColumn(4),
    ]);
  });

  it("can generate a hidden level", () => {
    const random = mulberry32(TEST_SEED);
    const level = generateRandomLevel(
      {
        amountColors: 2,
        stackSize: 4,
        extraPlacementStacks: 2,
        hideBlockTypes: true,
      },
      random
    );
    expect(level.colors).toEqual(["green", "pink"]);
    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "pink", "green", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("pink", "pink", "green", "pink")
      ),
      createPlacementColumn(4),
      createPlacementColumn(4),
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
        hideBlockTypes: true,
      },
      random
    );
    expect(level.colors).toEqual(["green", "pink"]);
    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "pink", "green", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("pink", "pink", "green", "pink")
      ),
      createBufferColumn(2),
      createBufferColumn(2),
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
        hideBlockTypes: true,
      },
      random
    );
    expect(level.colors).toEqual(["green", "pink"]);
    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "pink", "green", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("pink", "pink", "green", "pink")
      ),
      createBufferColumn(2),
      createBufferColumn(2),
      createBufferColumn(3, "pink"),
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
        hideBlockTypes: true,
      },
      random
    );
    expect(level.colors).toEqual(["darkblue", "gray", "green", "pink"]);
    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createHiddenBlocks("gray", "gray", "darkblue", "gray")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "green", "pink", "darkblue")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "pink", "pink", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("gray", "darkblue", "pink", "darkblue")
      ),

      createBufferColumn(2, "darkblue"),
      createBufferColumn(2, "gray"),
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
        hideBlockTypes: true,
      },
      random
    );
    expect(level.colors).toEqual(["darkblue", "gray", "green", "pink"]);
    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createHiddenBlocks("gray", "gray", "darkblue", "gray")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "green", "pink", "darkblue")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "pink", "pink", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("gray", "darkblue", "pink", "darkblue")
      ),

      createPlacementColumn(4, [], "gray"),
      createBufferColumn(2, "darkblue"),
    ]);
  });
});
