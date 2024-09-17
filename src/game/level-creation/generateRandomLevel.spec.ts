import { describe, expect, it } from "vitest";

import { mulberry32 } from "@/support/random";

import {
  createBlocks,
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
});
