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
    expect(level.colors).toEqual(["darkblue", "green"]);

    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createBlocks("green", "green", "darkblue", "darkblue")
      ),
      createPlacementColumn(
        4,
        createBlocks("darkblue", "green", "green", "darkblue")
      ),
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
    expect(level.colors).toEqual(["darkblue", "green"]);
    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "green", "darkblue", "darkblue")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("darkblue", "green", "green", "darkblue")
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
    expect(level.colors).toEqual(["darkblue", "green"]);
    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "green", "darkblue", "darkblue")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("darkblue", "green", "green", "darkblue")
      ),
      createBufferColumn(2),
      createBufferColumn(2),
    ]);
  });

  it.only("can generates buffers that are locked", () => {
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
    expect(level.colors).toEqual(["darkblue", "green", "pink", "white"]);
    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "pink", "darkblue", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "white", "white", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "pink", "darkblue", "darkblue")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("pink", "darkblue", "green", "pink")
      ),

      createBufferColumn(2, "pink"),
      createBufferColumn(2, "white"),
    ]);
  });

  it.only("both buffers and columns can be locked", () => {
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
    expect(level.colors).toEqual(["darkblue", "green", "pink", "white"]);
    expect(level.columns).toEqual([
      createPlacementColumn(
        4,
        createHiddenBlocks("green", "pink", "darkblue", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "white", "white", "green")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("white", "pink", "darkblue", "darkblue")
      ),
      createPlacementColumn(
        4,
        createHiddenBlocks("pink", "darkblue", "green", "pink")
      ),

      createPlacementColumn(4, [], "white"),
      createBufferColumn(2, "pink"),
    ]);
  });
});
